import { useState } from 'react'
import { Logo, Media } from '../components/Fields.jsx'
import FitBoard from '../components/FitBoard.jsx'
import Phone from '../components/Phone.jsx'
import { displayDomain } from '../data.js'

/* ---------- helpers ---------- */

function info(ad) {
  const isCarousel = ad.format === 'carousel'
  return {
    isCarousel,
    name: ad.pageName || 'Page name',
    user: ad.username || 'username',
    domain: displayDomain(ad.websiteUrl).toUpperCase(),
    items: isCarousel
      ? ad.cards
      : [{ media: ad.media, headline: ad.headline, description: ad.description }],
    vertical: isCarousel ? ad.cards[0]?.media : ad.verticalMedia || ad.media,
  }
}

function Avatar({ ad, size, ring }) {
  const img = <Logo logo={ad.avatar} name={ad.pageName || ad.username} size={size} />
  return ring ? <span className="ig-ring">{img}</span> : img
}

function PrimaryText({ text, limit, more = 'See more', className, prefix }) {
  const full = text || 'Your primary text goes here.'
  const cut = full.length > limit
  return (
    <div className={className}>
      {prefix}
      {cut ? full.slice(0, limit).trimEnd() : full}
      {cut && <>... <span className="m-more">{more}</span></>}
    </div>
  )
}

function Strip({ items, render, className = '' }) {
  return (
    <div className={`m-strip ${className}`}>
      {items.map((it, i) => <div className="m-strip-card" key={i}>{render(it, i)}</div>)}
    </div>
  )
}

function Slides({ items, render, onIndex }) {
  const [index, setIndex] = useState(0)
  const onScroll = (e) => {
    const i = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth)
    if (i !== index) { setIndex(i); onIndex?.(i) }
  }
  return (
    <div className="m-slides-wrap">
      <div className="m-slides" onScroll={onScroll}>
        {items.map((it, i) => <div className="m-slide" key={i}>{render(it, i)}</div>)}
      </div>
      {items.length > 1 && <span className="m-count">{index + 1}/{items.length}</span>}
    </div>
  )
}

function Dots({ count, active }) {
  if (count < 2) return null
  return <span className="m-dots">{Array.from({ length: count }, (_, i) => <i key={i} className={i === active ? 'on' : ''} />)}</span>
}

function SkelPost() {
  return (
    <div className="m-skel-post">
      <div className="m-skel-head"><span className="skel-dot" /><div style={{ flex: 1 }}><div className="skel w40" /><div className="skel w20" /></div></div>
      <div className="skel w90" />
      <div className="skel w70" />
      <div className="skel-box" />
    </div>
  )
}

/* ---------- Facebook post (feed, search, explore) ---------- */

function FbPost({ ad, textLimit = 125, wide }) {
  const { isCarousel, name, domain, items } = info(ad)
  return (
    <div className="fb-post">
      <div className="fb-head">
        <Avatar ad={ad} size={36} />
        <div className="fb-head-text">
          <div className="fb-name">{name}</div>
          <div className="fb-meta">Sponsored · <span className="fb-globe">◍</span></div>
        </div>
        <span className="fb-dots">⋯ ✕</span>
      </div>
      <PrimaryText className="fb-text" text={ad.primaryText} limit={textLimit} />
      {isCarousel ? (
        <Strip
          items={items}
          className="fb"
          render={(c) => (
            <>
              <Media media={c.media} className="m-sq" placeholder="1:1" />
              <div className="fb-card-foot">
                <div className="fb-card-text">
                  <div className="fb-headline clamp1">{c.headline || 'Headline'}</div>
                  <div className="fb-desc clamp1">{c.description || 'Description'}</div>
                </div>
                <span className="fb-cta">{ad.cta}</span>
              </div>
            </>
          )}
        />
      ) : (
        <>
          <Media media={ad.media} className={wide ? 'm-wide' : 'm-sq'} placeholder="Image or video" />
          <div className="fb-linkbar">
            <div className="fb-link-text">
              <div className="fb-domain">{domain}</div>
              <div className="fb-headline clamp1">{ad.headline || 'Headline'}</div>
              {ad.description && <div className="fb-desc clamp1">{ad.description}</div>}
            </div>
            <span className="fb-cta">{ad.cta}</span>
          </div>
        </>
      )}
      <div className="fb-actions"><span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span></div>
    </div>
  )
}

/* ---------- Feeds ---------- */

function FacebookFeed({ ad }) {
  return (
    <Phone label="Facebook Feed">
      <div className="fb-appbar"><span className="fb-logo">facebook</span><span className="fb-appicons">＋ 🔍 💬</span></div>
      <FbPost ad={ad} />
      <SkelPost />
    </Phone>
  )
}

function InstagramFeed({ ad }) {
  const { isCarousel, user, items } = info(ad)
  const [index, setIndex] = useState(0)
  return (
    <Phone label="Instagram Feed">
      <div className="ig-appbar"><span className="ig-logo">Instagram</span><span>♡ ✉</span></div>
      <div className="ig-head">
        <Avatar ad={ad} size={30} ring />
        <div className="ig-head-text">
          <div className="ig-user">{user}</div>
          <div className="ig-sub">Sponsored</div>
        </div>
        <span>⋯</span>
      </div>
      {isCarousel ? (
        <Slides items={items} onIndex={setIndex} render={(c) => <Media media={c.media} className="m-sq" placeholder="1:1" />} />
      ) : (
        <Media media={ad.media} className="m-portrait" placeholder="Image or video 1:1 or 4:5" />
      )}
      <div className="ig-ctabar"><span>{ad.cta}</span><span>›</span></div>
      <div className="ig-icons">
        <span>♡ 💬 ➤</span>
        <Dots count={isCarousel ? items.length : 0} active={index} />
        <span>🔖</span>
      </div>
      <PrimaryText className="ig-caption" text={ad.primaryText} limit={80} more="more" prefix={<b>{user} </b>} />
    </Phone>
  )
}

function ThreadsFeed({ ad }) {
  const { isCarousel, user, items } = info(ad)
  return (
    <Phone label="Threads feed">
      <div className="th-appbar">@</div>
      <div className="th-post">
        <Avatar ad={ad} size={36} />
        <div className="th-body">
          <div className="th-headrow">
            <b>{user}</b>
            <span className="th-sponsored">Sponsored</span>
            <span className="th-dots">⋯</span>
          </div>
          <PrimaryText className="th-text" text={ad.primaryText} limit={125} more="more" />
          {isCarousel ? (
            <Strip
              items={items}
              className="th"
              render={(c) => (
                <>
                  <Media media={c.media} className="m-sq" placeholder="1:1" />
                  <div className="th-linkbar"><span className="clamp1">{c.headline || 'Headline'}</span><span className="th-cta">{ad.cta}</span></div>
                </>
              )}
            />
          ) : (
            <div className="th-media">
              <Media media={ad.media} className="m-sq" placeholder="Image or video" />
              <div className="th-linkbar"><span className="clamp1">{ad.headline || 'Headline'}</span><span className="th-cta">{ad.cta}</span></div>
            </div>
          )}
          <div className="th-icons">♡ 💬 🔁 ➤</div>
        </div>
      </div>
      <div className="th-post ghost">
        <span className="skel-dot big" />
        <div className="th-body"><div className="skel w40" /><div className="skel w90" /><div className="skel w70" /></div>
      </div>
    </Phone>
  )
}

export function FeedsPreview({ ad }) {
  return (
    <div className="preview-section">
      <FitBoard widths={[940, 620]} maxScale={1.15}>
        <div className="phone-grid">
          <FacebookFeed ad={ad} />
          <InstagramFeed ad={ad} />
          <ThreadsFeed ad={ad} />
        </div>
      </FitBoard>
      <p className="note">Carousels scroll sideways. Layout is approximate.</p>
    </div>
  )
}

/* ---------- Stories & Reels ---------- */

function StoryBars({ count }) {
  return <div className="st-bars">{Array.from({ length: Math.max(count, 1) }, (_, i) => <span key={i} className={i === 0 ? 'on' : ''} />)}</div>
}

function InstagramStory({ ad }) {
  const { user, items, vertical } = info(ad)
  return (
    <Phone label="Instagram Stories" dark bleed>
      <div className="st">
        <Media media={vertical} className="st-media" placeholder="Image or video 9:16" />
        <div className="st-top">
          <StoryBars count={items.length} />
          <div className="st-head"><Avatar ad={ad} size={28} /><b>{user}</b><span>Sponsored</span><span className="st-x">⋯ ✕</span></div>
        </div>
        <div className="st-bottom"><span className="st-cta-ig"><span className="st-chev">⌃</span>{ad.cta}</span></div>
      </div>
    </Phone>
  )
}

function FacebookStory({ ad }) {
  const { name, items, vertical } = info(ad)
  return (
    <Phone label="Facebook Stories" dark bleed>
      <div className="st">
        <Media media={vertical} className="st-media" placeholder="Image or video 9:16" />
        <div className="st-top">
          <StoryBars count={items.length} />
          <div className="st-head"><Avatar ad={ad} size={28} /><div><b>{name}</b><div className="st-small">Sponsored</div></div><span className="st-x">⋯ ✕</span></div>
        </div>
        <div className="st-bottom"><span className="st-cta-fb">🔗 {ad.cta}</span></div>
      </div>
    </Phone>
  )
}

function Reel({ ad, label, who, variant }) {
  const { vertical } = info(ad)
  return (
    <Phone label={label} dark bleed>
      <div className="st">
        <Media media={vertical} className="st-media" placeholder="Image or video 9:16" />
        <div className="rl-title">Reels</div>
        <div className="rl-side">
          <span>♡<small>Like</small></span>
          <span>💬<small>Comment</small></span>
          <span>➤<small>Share</small></span>
          <span>⋯</span>
        </div>
        <div className="rl-bottom">
          <div className="rl-user"><Avatar ad={ad} size={28} /><b>{who}</b><span className="rl-sp">Sponsored</span></div>
          <PrimaryText className="rl-text" text={ad.primaryText} limit={60} more="more" />
          <span className={`rl-cta ${variant}`}>{ad.cta}<span>›</span></span>
        </div>
      </div>
    </Phone>
  )
}

export function StoriesPreview({ ad }) {
  const { name, user } = info(ad)
  return (
    <div className="preview-section">
      <FitBoard widths={[1260, 620]} maxScale={1.15}>
        <div className="phone-grid">
          <InstagramStory ad={ad} />
          <Reel ad={ad} label="Instagram Reels" who={user} variant="ig" />
          <FacebookStory ad={ad} />
          <Reel ad={ad} label="Facebook Reels" who={name} variant="fb" />
        </div>
      </FitBoard>
      <p className="note">Uses the 9:16 version when you add one, otherwise the main image. Carousels show the first card. Leave the top and bottom 14% free of text and logos.</p>
    </div>
  )
}

/* ---------- More placements ---------- */

function Marketplace({ ad }) {
  const { name, items } = info(ad)
  const first = items[0] || {}
  return (
    <Phone label="Facebook Marketplace">
      <div className="mk-top"><b>Marketplace</b><span>👤 🔍</span></div>
      <div className="mk-chips"><span>Sell</span><span>For you</span><span>Local</span></div>
      <div className="mk-title-row"><b>Today's picks</b></div>
      <div className="mk-grid">
        <div className="mk-tile">
          <Media media={first.media} className="m-sq" placeholder="1:1" />
          <div className="mk-name clamp1">{first.headline || 'Headline'}</div>
          <div className="mk-sub clamp1">Sponsored · {name}</div>
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="mk-tile" key={i}><div className="skel-box sq" /><div className="skel w70" /><div className="skel w40" /></div>
        ))}
      </div>
    </Phone>
  )
}

function SearchResults({ ad }) {
  const query = (ad.headline || ad.cards[0]?.headline || 'search').toLowerCase()
  return (
    <Phone label="Facebook search results">
      <div className="fs-top"><span>←</span><div className="fs-input">{query}</div></div>
      <div className="fs-chips"><span className="on">All</span><span>Posts</span><span>People</span><span>Pages</span></div>
      <FbPost ad={ad} textLimit={90} wide />
      <SkelPost />
    </Phone>
  )
}

function BusinessExplore({ ad }) {
  return (
    <Phone label="Facebook Business Explore">
      <div className="bx-top"><span>←</span><div><b>Explore</b><div className="bx-sub">More from businesses</div></div></div>
      <FbPost ad={ad} />
      <SkelPost />
    </Phone>
  )
}

function RightColumn({ ad }) {
  const { domain, items } = info(ad)
  const first = items[0] || {}
  return (
    <figure className="phone-fig">
      <div className="rc-frame">
        <div className="rc-bar"><span className="fb-logo small">f</span><span className="rc-search">Search Facebook</span></div>
        <div className="rc-body">
          <div className="rc-feed"><SkelPost /><SkelPost /></div>
          <aside className="rc-col">
            <div className="rc-heading">Sponsored</div>
            <div className="rc-ad">
              <Media media={first.media} className="rc-img" placeholder="1:1" />
              <div className="rc-text">
                <div className="rc-headline clamp2">{first.headline || 'Headline'}</div>
                <div className="rc-domain">{domain.toLowerCase()}</div>
              </div>
            </div>
            <div className="rc-heading">Birthdays</div>
            <div className="skel w90" />
            <div className="rc-heading">Contacts</div>
            {[0, 1, 2, 3].map((i) => <div className="rc-contact" key={i}><span className="skel-dot" /><div className="skel w70" /></div>)}
          </aside>
        </div>
      </div>
      <figcaption>Facebook right column (desktop)</figcaption>
    </figure>
  )
}

export function MorePreview({ ad }) {
  return (
    <div className="preview-section">
      <FitBoard widths={[1260, 620]} maxScale={1.15}>
        <div className="phone-grid">
          <Marketplace ad={ad} />
          <SearchResults ad={ad} />
          <BusinessExplore ad={ad} />
          <RightColumn ad={ad} />
        </div>
      </FitBoard>
      <p className="note">Marketplace and the right column show the first card of a carousel. Layout is approximate.</p>
    </div>
  )
}
