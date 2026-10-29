import { useState } from 'react'
import { EMPTY_AD } from './data.js'
import { META_EMPTY } from './meta/metaData.js'
import GoogleSandbox from './GoogleSandbox.jsx'
import MetaSandbox from './meta/MetaSandbox.jsx'

const PLATFORMS = [
  { id: 'google', label: 'Google Ads Preview' },
  { id: 'meta', label: 'Meta Ads Preview' },
]

export default function App() {
  const [platform, setPlatform] = useState('google')
  const [googleAd, setGoogleAd] = useState(EMPTY_AD)
  const [metaAd, setMetaAd] = useState(META_EMPTY)

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
