// Share links carry the ad's text in the URL hash (#s=...), compressed and base64url encoded.
// The hash never reaches the server. Images and videos are left out to keep links short.

import { DEFAULT_AD, EMPTY_AD } from './data.js'
import { META_SAMPLE, META_EMPTY } from './meta/metaData.js'

const PREFIX = '#s='
const MAX_TEXT = 1000
const MAX_ITEMS = 20

// The sample ads have every list filled, so they double as the shape of a valid ad.
const SHAPES = {
  google: { shape: DEFAULT_AD, empty: EMPTY_AD },
  meta: { shape: META_SAMPLE, empty: META_EMPTY },
}

function toBase64Url(bytes) {
  let s = ''
  bytes.forEach((b) => { s += String.fromCharCode(b) })
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text) {
  const s = atob(text.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(s, (c) => c.charCodeAt(0))
}

async function pipe(bytes, stream) {
  const out = new Blob([bytes]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

// Keep only fields the app knows, as plain strings. Media slots always come back empty.
function clean(shape, value, fallback) {
  if (shape === null) return null
  if (typeof shape === 'string') return typeof value === 'string' ? value.slice(0, MAX_TEXT) : (fallback ?? '')
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) return fallback ?? []
    return value.slice(0, MAX_ITEMS).map((item) => clean(shape[0], item))
  }
  const source = value && typeof value === 'object' ? value : {}
  return Object.fromEntries(Object.keys(shape).map((k) => [k, clean(shape[k], source[k], fallback?.[k])]))
}

export async function buildShareLink(platform, ad) {
  const { shape } = SHAPES[platform]
  const json = JSON.stringify({ v: 1, p: platform, a: clean(shape, ad) })
  const packed = await pipe(new TextEncoder().encode(json), new CompressionStream('deflate-raw'))
  return `${location.origin}${location.pathname}${PREFIX}${toBase64Url(packed)}`
}

export async function readShareLink(hash = location.hash) {
  if (!hash.startsWith(PREFIX)) return null
  try {
    const bytes = await pipe(fromBase64Url(hash.slice(PREFIX.length)), new DecompressionStream('deflate-raw'))
    const data = JSON.parse(new TextDecoder().decode(bytes))
    const entry = SHAPES[data?.p]
    if (!entry) return null
    return { platform: data.p, ad: clean(entry.shape, data.a, entry.empty) }
  } catch {
    return null
  }
}

export function clearShareHash() {
  history.replaceState(null, '', location.pathname + location.search)
}
