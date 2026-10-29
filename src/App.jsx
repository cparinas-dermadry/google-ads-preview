import { useEffect, useState } from 'react'
import { EMPTY_AD } from './data.js'
import { META_EMPTY } from './meta/metaData.js'
import { loadState, saveState, cleanUpMedia, loadValue, saveValue } from './storage.js'
import { buildShareLink, readShareLink, clearShareHash } from './share.js'
import GoogleSandbox from './GoogleSandbox.jsx'
import MetaSandbox from './meta/MetaSandbox.jsx'

const PLATFORMS = [
  { id: 'google', label: 'Google Ads Preview' },
  { id: 'meta', label: 'Meta Ads Preview' },
]

const KEYS = {
  platform: 'adsPreview.platform',
  google: 'adsPreview.google',
  meta: 'adsPreview.meta',
}

function ShareButton({ platform, ad }) {
  const [label, setLabel] = useState('Share link')
  const share = async () => {
    const link = await buildShareLink(platform, ad)
    try {
      await navigator.clipboard.writeText(link)
      setLabel('Link copied')
    } catch {
      window.prompt('Copy this link', link)
    }
    setTimeout(() => setLabel('Share link'), 2000)
  }
  return <button className="btn" onClick={share}>{label}</button>
}

export default function App() {
  const [platform, setPlatform] = useState(() => loadValue(KEYS.platform, 'google'))
  const [googleAd, setGoogleAd] = useState(EMPTY_AD)
  const [metaAd, setMetaAd] = useState(META_EMPTY)
  // An ad opened from a share link. Shown instead of your own ad for that platform, never saved.
  const [shared, setShared] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([loadState(KEYS.google, EMPTY_AD), loadState(KEYS.meta, META_EMPTY), readShareLink()]).then(([g, m, s]) => {
      if (cancelled) return
      setGoogleAd(g)
      setMetaAd(m)
      if (s) {
        setShared(s)
        setPlatform(s.platform)
      }
      setReady(true)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const onHash = async () => {
      const s = await readShareLink()
      if (s) {
        setShared(s)
        setPlatform(s.platform)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => {
      saveState(KEYS.google, googleAd)
      saveState(KEYS.meta, metaAd)
      cleanUpMedia(googleAd, metaAd, shared?.ad)
    }, 300)
    return () => clearTimeout(t)
  }, [ready, googleAd, metaAd, shared])

  useEffect(() => {
    if (!shared) saveValue(KEYS.platform, platform)
  }, [platform, shared])

  if (!ready) return null

  const viewingShared = shared?.platform === platform
  const ownAd = platform === 'google' ? googleAd : metaAd
  const setOwnAd = platform === 'google' ? setGoogleAd : setMetaAd
  const ad = viewingShared ? shared.ad : ownAd
  const setAd = viewingShared
    ? (update) => setShared((s) => ({ ...s, ad: typeof update === 'function' ? update(s.ad) : update }))
    : setOwnAd

  const backToMine = () => {
    setShared(null)
    clearShareHash()
  }

  const switcher = (
    <select
      className="platform-select"
      aria-label="Ad platform"
      value={platform}
      onChange={(e) => setPlatform(e.target.value)}
    >
      {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
    </select>
  )

  const share = <ShareButton platform={platform} ad={ad} />

  const banner = viewingShared && (
    <div className="shared-banner">
      <span>
        You are viewing a shared ad. Changes here are not saved, and your own work is untouched.
        Images and videos are not included in share links.
      </span>
      <button className="btn" onClick={backToMine}>Back to my work</button>
    </div>
  )

  const Sandbox = platform === 'google' ? GoogleSandbox : MetaSandbox
  return <Sandbox ad={ad} setAd={setAd} switcher={switcher} share={share} banner={banner} />
}
