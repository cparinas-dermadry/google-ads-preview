import { useState } from 'react'
import { Logo } from '../components/Fields.jsx'
import { displayDomain } from '../data.js'

function pickCombo(list, count, offset) {
  const filled = list.filter((s) => s.trim())
  if (filled.length === 0) return []
  const out = []
  for (let i = 0; i < Math.min(count, filled.length); i++) {
    out.push(filled[(offset + i) % filled.length])
  }
  return out
}

function SearchAd({ ad, device, offset }) {
  const headlines = pickCombo(ad.headlines, 3, offset)
  const descriptions = pickCombo(ad.descriptions, 2, offset)
  const sitelinks = ad.sitelinks.filter((s) => s.text.trim())
  const domain = displayDomain(ad.finalUrl)
  const crumbs = [ad.path1, ad.path2].filter((p) => p.trim())

  return (
    <div className={`serp-ad ${device}`}>
      <div className="serp-sponsored">Sponsored</div>
      <div className="serp-source">
        <span className="serp-favicon"><Logo logo={ad.logo} name={ad.businessName} size={18} /></span>
        <div className="serp-source-text">
          <div className="serp-name">{ad.businessName || domain}</div>
          <div className="serp-url">
            {`https://${domain}`}
            {crumbs.map((c) => <span key={c}> › {c}</span>)}
          </div>
        </div>
        <span className="serp-dots">⋮</span>
      </div>
      <a className="serp-headline" href="#" onClick={(e) => e.preventDefault()}>
        {headlines.length ? headlines.join(' | ') : 'Your headline here'}
      </a>
      <div className="serp-desc">
        {descriptions.length ? descriptions.join(' ') : 'Your description here.'}
      </div>

      {sitelinks.length > 0 && device === 'desktop' && (
        <div className="serp-sitelinks">
          {sitelinks.map((s, i) => (
            <div className="serp-sitelink" key={i}>
              <a href="#" onClick={(e) => e.preventDefault()}>{s.text}</a>
              {s.line1 && <div>{s.line1}</div>}
              {s.line2 && <div>{s.line2}</div>}
            </div>
          ))}
        </div>
      )}
      {sitelinks.length > 0 && device === 'mobile' && (
        <div className="serp-chips">
          {sitelinks.map((s, i) => <span className="serp-chip" key={i}>{s.text}</span>)}
        </div>
      )}
    </div>
  )
}

function SerpFrame({ ad, device, offset }) {
  return (
    <figure className={`serp-fig ${device}`}>
      <figcaption>{device === 'desktop' ? 'Desktop' : 'Mobile'}</figcaption>
      <div className={`serp-frame ${device}`}>
        <div className="serp-searchbar">
          <span className="g-logo">
            <b style={{ color: '#4285f4' }}>G</b><b style={{ color: '#ea4335' }}>o</b><b style={{ color: '#fbbc05' }}>o</b>
            <b style={{ color: '#4285f4' }}>g</b><b style={{ color: '#34a853' }}>l</b><b style={{ color: '#ea4335' }}>e</b>
          </span>
          <div className="serp-input">{ad.headlines.find((h) => h.trim())?.toLowerCase() || 'search'}</div>
        </div>
        <div className="serp-results">
          <SearchAd ad={ad} device={device} offset={offset} />
          {[0, 1].map((i) => (
            <div className="serp-organic" key={i}>
              <div className="skel w40" />
              <div className="skel w70 tall" />
              <div className="skel w90" />
              <div className="skel w80" />
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}

export default function SearchPreview({ ad }) {
  const [offset, setOffset] = useState(0)

  return (
    <div className="preview-section">
      <div className="preview-toolbar">
        <button className="btn" onClick={() => setOffset((o) => o + 1)}>Next combination</button>
      </div>

      <div className="search-grid">
        <SerpFrame ad={ad} device="desktop" offset={offset} />
        <SerpFrame ad={ad} device="mobile" offset={offset} />
      </div>
      <p className="note">Google mixes your headlines and descriptions. Use "Next combination" to see other mixes.</p>
    </div>
  )
}
