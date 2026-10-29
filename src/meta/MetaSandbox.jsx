import { useState } from 'react'
import { TextField, MediaField } from '../components/Fields.jsx'
import { META_EMPTY, META_SAMPLE, META_LIMITS, META_CTAS, MAX_CARDS, MIN_CARDS, emptyCard } from './metaData.js'
import { FeedsPreview, StoriesPreview, MorePreview } from './MetaPreviews.jsx'

const TABS = [
  { id: 'feeds', label: 'Feeds' },
  { id: 'stories', label: 'Stories & Reels' },
  { id: 'more', label: 'More placements' },
]

function CardsField({ cards, onChange }) {
  const update = (i, key, v) => onChange(cards.map((c, j) => (j === i ? { ...c, [key]: v } : c)))
  return (
    <div className="field">
      <span className="field-label">Carousel cards<span className="muted">{cards.length}/{MAX_CARDS}</span></span>
      {cards.map((c, i) => (
        <div className="sitelink-box" key={i}>
          <div className="sitelink-head">
            <span>Card {i + 1}</span>
            {cards.length > MIN_CARDS && (
              <button type="button" className="icon-btn" title="Remove" onClick={() => onChange(cards.filter((_, j) => j !== i))}>×</button>
            )}
          </div>
          <MediaField label="Image or video" hint="1:1" accept="image/*,video/*" value={c.media} onChange={(v) => update(i, 'media', v)} />
          <TextField label="Headline" value={c.headline} limit={META_LIMITS.headline} onChange={(v) => update(i, 'headline', v)} />
          <TextField label="Description" value={c.description} limit={META_LIMITS.description} onChange={(v) => update(i, 'description', v)} />
        </div>
      ))}
      {cards.length < MAX_CARDS && (
        <button type="button" className="add-btn" onClick={() => onChange([...cards, emptyCard()])}>+ Add card</button>
      )}
    </div>
  )
}

export default function MetaSandbox({ ad, setAd, switcher }) {
  const [tab, setTab] = useState('feeds')
  const set = (key) => (value) => setAd((a) => ({ ...a, [key]: value }))

  return (
    <div className="app">
      <header className="topbar">
        {switcher}
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="btn" onClick={() => setAd(META_SAMPLE)}>Put samples</button>
          <button className="btn ghost" onClick={() => setAd(META_EMPTY)}>Clear</button>
        </div>
      </header>

      <div className="layout">
        <aside className="editor">
          <section>
            <h2>Identity</h2>
            <TextField label="Facebook Page name" value={ad.pageName} onChange={set('pageName')} />
            <TextField label="Instagram and Threads username" value={ad.username} limit={META_LIMITS.username} onChange={set('username')} placeholder="username" />
            <MediaField label="Profile picture" hint="1:1" value={ad.avatar} onChange={set('avatar')} />
            <TextField label="Website URL" value={ad.websiteUrl} onChange={set('websiteUrl')} placeholder="https://www.example.com" />
          </section>

          <section>
            <h2>Ad</h2>
            <div className="field">
              <span className="field-label">Format</span>
              <div className="segmented full">
                {['single', 'carousel'].map((f) => (
                  <button key={f} type="button" className={ad.format === f ? 'active' : ''} onClick={() => set('format')(f)}>
                    {f === 'single' ? 'Single image or video' : 'Carousel'}
                  </button>
                ))}
              </div>
            </div>
            <TextField label="Primary text" value={ad.primaryText} limit={META_LIMITS.primaryText} multiline onChange={set('primaryText')} />
            <label className="field">
              <span className="field-label">Call to action</span>
              <select value={ad.cta} onChange={(e) => set('cta')(e.target.value)}>
                {META_CTAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>

            {ad.format === 'single' ? (
              <>
                <MediaField label="Image or video" hint="1:1 or 4:5" accept="image/*,video/*" value={ad.media} onChange={set('media')} />
                <MediaField label="Stories and Reels version" hint="9:16, optional" accept="image/*,video/*" value={ad.verticalMedia} onChange={set('verticalMedia')} />
                <TextField label="Headline" value={ad.headline} limit={META_LIMITS.headline} onChange={set('headline')} />
                <TextField label="Description" value={ad.description} limit={META_LIMITS.description} onChange={set('description')} />
              </>
            ) : (
              <CardsField cards={ad.cards} onChange={set('cards')} />
            )}
            <p className="muted">Counters show Meta's recommended lengths. Longer text gets cut off in most placements.</p>
          </section>
        </aside>

        <main className="stage">
          {tab === 'feeds' && <FeedsPreview ad={ad} />}
          {tab === 'stories' && <StoriesPreview ad={ad} />}
          {tab === 'more' && <MorePreview ad={ad} />}
        </main>
      </div>
    </div>
  )
}
