// Text and settings live in localStorage. Uploaded files are too big for it, so they go in IndexedDB,
// keyed by the media id stored in the ad state.

const DB_NAME = 'ads-preview'
const STORE = 'media'

let dbPromise
function db() {
  dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function run(mode, fn) {
  return db().then((d) => new Promise((resolve, reject) => {
    const tx = d.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req?.result)
    tx.onerror = () => reject(tx.error)
  }))
}

export const putMedia = (id, blob) => run('readwrite', (s) => s.put(blob, id)).catch(() => {})
const getMedia = (id) => run('readonly', (s) => s.get(id)).catch(() => null)

function deleteUnused(keep) {
  return run('readwrite', (s) => {
    const req = s.getAllKeys()
    req.onsuccess = () => req.result.forEach((k) => { if (!keep.has(k)) s.delete(k) })
  }).catch(() => {})
}

const isMedia = (v) => v && typeof v === 'object' && typeof v.id === 'string' && (v.type === 'image' || v.type === 'video')

function mapMedia(value, fn) {
  if (isMedia(value)) return fn(value)
  if (Array.isArray(value)) return value.map((v) => mapMedia(v, fn))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapMedia(v, fn)]))
  }
  return value
}

function mediaIds(...states) {
  const ids = new Set()
  states.forEach((s) => mapMedia(s, (m) => { ids.add(m.id); return m }))
  return ids
}

export async function loadState(key, fallback) {
  let saved
  try {
    const raw = localStorage.getItem(key)
    saved = raw && JSON.parse(raw)
  } catch {
    saved = null
  }
  if (!saved) return fallback

  const state = { ...fallback, ...saved }
  const urls = {}
  await Promise.all([...mediaIds(state)].map(async (id) => {
    const blob = await getMedia(id)
    if (blob) urls[id] = URL.createObjectURL(blob)
  }))
  return mapMedia(state, (m) => (urls[m.id] ? { ...m, url: urls[m.id] } : null))
}

export function saveState(key, state) {
  try {
    // Object URLs die on refresh, so only the media id is stored.
    localStorage.setItem(key, JSON.stringify(mapMedia(state, ({ url, ...m }) => m)))
  } catch {
    // Storage full or blocked: keep working without saving.
  }
}

export function cleanUpMedia(...states) {
  return deleteUnused(mediaIds(...states))
}

export function loadValue(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export function saveValue(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}
