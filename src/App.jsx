import { useEffect, useState } from 'react'
import { EMPTY_AD } from './data.js'
import { META_EMPTY } from './meta/metaData.js'
import { loadState, saveState, cleanUpMedia, loadValue, saveValue } from './storage.js'
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

export default function App() {
  const [platform, setPlatform] = useState(() => loadValue(KEYS.platform, 'google'))
  const [googleAd, setGoogleAd] = useState(EMPTY_AD)
  const [metaAd, setMetaAd] = useState(META_EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([loadState(KEYS.google, EMPTY_AD), loadState(KEYS.meta, META_EMPTY)]).then(([g, m]) => {
      if (cancelled) return
      setGoogleAd(g)
      setMetaAd(m)
      setReady(true)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => {
      saveState(KEYS.google, googleAd)
      saveState(KEYS.meta, metaAd)
      cleanUpMedia(googleAd, metaAd)
    }, 300)
    return () => clearTimeout(t)
  }, [ready, googleAd, metaAd])

  useEffect(() => saveValue(KEYS.platform, platform), [platform])

  if (!ready) return null

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

  return platform === 'google'
    ? <GoogleSandbox ad={googleAd} setAd={setGoogleAd} switcher={switcher} />
    : <MetaSandbox ad={metaAd} setAd={setMetaAd} switcher={switcher} />
}
