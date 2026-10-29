import { useState } from 'react'
import { DEFAULT_AD, EMPTY_AD, LIMITS, MAX, CTAS } from './data.js'
import { TextField, ListField, MediaField } from './components/Fields.jsx'
import SearchPreview from './previews/SearchPreview.jsx'
import DisplayPreview from './previews/DisplayPreview.jsx'
import DemandGenPreview from './previews/DemandGenPreview.jsx'

const TABS = [
  { id: 'search', label: 'Search' },
  { id: 'display', label: 'Display' },
  { id: 'demandgen', label: 'YouTube & Demand Gen' },
]

function SitelinksField({ sitelinks, onChange }) {
  const update = (i, key, v) => onChange(sitelinks.map((s, j) => (j === i ? { ...s, [key]: v } : s)))
  return (
    <div className="field">
      <span className="field-label">Sitelinks<span className="muted">{sitelinks.length}/{MAX.sitelinks}</span></span>
      {sitelinks.map((s, i) => (
        <div className="sitelink-box" key={i}>
          <div className="sitelink-head">
            <span>Sitelink {i + 1}</span>
            <button type="button" className="icon-btn" title="Remove" onClick={() => onChange(sitelinks.filter((_, j) => j !== i))}>×</button>
          </div>
          <TextField label="Link text" value={s.text} limit={LIMITS.sitelinkText} onChange={(v) => update(i, 'text', v)} />
          <TextField label="Description line 1" value={s.line1} limit={LIMITS.sitelinkLine} onChange={(v) => update(i, 'line1', v)} />
          <TextField label="Description line 2" value={s.line2} limit={LIMITS.sitelinkLine} onChange={(v) => update(i, 'line2', v)} />
        </div>
      ))}
      {sitelinks.length < MAX.sitelinks && (
        <button type="button" className="add-btn" onClick={() => onChange([...sitelinks, { text: '', line1: '', line2: '' }])}>
          + Add sitelink
        </button>
      )}
    </div>
  )
}

export default function App() {
  const [ad, setAd] = useState(EMPTY_AD)
  const [tab, setTab] = useState('search')
  const set = (key) => (value) => setAd((a) => ({ ...a, [key]: value }))

  return (
    <div className="app">
      <header className="topbar">
        <h1>Google Ads Preview</h1>
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="btn" onClick={() => setAd(DEFAULT_AD)}>Put samples</button>
          <button className="btn ghost" onClick={() => setAd(EMPTY_AD)}>Clear</button>
        </div>
      </header>

      <div className="layout">
        <aside className="editor">
          <section>
            <h2>Brand</h2>
            <TextField label="Business name" value={ad.businessName} limit={LIMITS.businessName} onChange={set('businessName')} />
            <TextField label="Final URL" value={ad.finalUrl} onChange={set('finalUrl')} placeholder="https://www.example.com" />
            <MediaField label="Logo" hint="1:1" value={ad.logo} onChange={set('logo')} />
          </section>

          {tab === 'search' && (
            <section>
              <h2>Search ad</h2>
              <div className="two-col">
                <TextField label="Path 1" value={ad.path1} limit={LIMITS.path} onChange={set('path1')} />
                <TextField label="Path 2" value={ad.path2} limit={LIMITS.path} onChange={set('path2')} />
              </div>
              <ListField label="Headlines" items={ad.headlines} limit={LIMITS.headline} max={MAX.headlines} onChange={set('headlines')} />
              <ListField label="Descriptions" items={ad.descriptions} limit={LIMITS.description} max={MAX.descriptions} multiline onChange={set('descriptions')} />
              <SitelinksField sitelinks={ad.sitelinks} onChange={set('sitelinks')} />
            </section>
          )}

          {tab === 'display' && (
            <section>
              <h2>Display ad</h2>
              <MediaField label="Landscape image" hint="1.91:1" value={ad.landscapeImage} onChange={set('landscapeImage')} />
              <MediaField label="Square image" hint="1:1" value={ad.squareImage} onChange={set('squareImage')} />
              <TextField label="Short headline" value={ad.shortHeadline} limit={LIMITS.shortHeadline} onChange={set('shortHeadline')} />
              <TextField label="Long headline" value={ad.longHeadline} limit={LIMITS.longHeadline} multiline onChange={set('longHeadline')} />
              <TextField label="Description" value={ad.displayDescription} limit={LIMITS.displayDescription} multiline onChange={set('displayDescription')} />
              <CtaField value={ad.cta} onChange={set('cta')} />
            </section>
          )}

          {tab === 'demandgen' && (
            <section>
              <h2>YouTube & Demand Gen</h2>
              <MediaField label="Image or video" hint="16:9 or 1.91:1" accept="image/*,video/*" value={ad.dgMedia} onChange={set('dgMedia')} />
              <TextField label="Headline" value={ad.dgHeadline} limit={LIMITS.dgHeadline} onChange={set('dgHeadline')} />
              <TextField label="Description" value={ad.dgDescription} limit={LIMITS.dgDescription} multiline onChange={set('dgDescription')} />
              <CtaField value={ad.cta} onChange={set('cta')} />
            </section>
          )}
        </aside>

        <main className="stage">
          {tab === 'search' && <SearchPreview ad={ad} />}
          {tab === 'display' && <DisplayPreview ad={ad} />}
          {tab === 'demandgen' && <DemandGenPreview ad={ad} />}
        </main>
      </div>
    </div>
  )
}

function CtaField({ value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">Call to action</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {CTAS.map((c) => <option key={c}>{c}</option>)}
      </select>
    </label>
  )
}
