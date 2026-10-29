import { Logo, Media } from '../components/Fields.jsx'
import FitBoard from '../components/FitBoard.jsx'

function Phone({ label, children, dark }) {
  return (
    <figure className="phone-fig">
      <div className={`phone ${dark ? 'dark' : ''}`}>
        <div className="phone-notch" />
        <div className="phone-screen">{children}</div>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function SkeletonVideo() {
  return (
    <div className="yt-skel">
      <div className="skel-box" />
      <div className="yt-skel-meta">
        <span className="skel-dot" />
        <div style={{ flex: 1 }}>
          <div className="skel w90" />
          <div className="skel w50" />
        </div>
      </div>
    </div>
  )
}

export default function DemandGenPreview({ ad }) {
  const name = ad.businessName || 'Business'
  const headline = ad.dgHeadline || 'Headline'
  const desc = ad.dgDescription || 'Description'

  return (
    <div className="preview-section">
      <FitBoard widths={[940, 620]} maxScale={1.15}>
      <div className="phone-grid">
        <Phone label="YouTube home feed" dark>
          <div className="yt-top">
            <span className="yt-logo"><span className="yt-play">▶</span>YouTube</span>
          </div>
          <div className="yt-ad">
            <Media media={ad.dgMedia} className="yt-media" placeholder="Image or video 16:9" />
            <div className="yt-meta">
              <Logo logo={ad.logo} name={name} size={36} />
              <div className="yt-text">
                <div className="yt-title clamp2">{headline}</div>
                <div className="yt-desc clamp2">{desc}</div>
                <div className="yt-sub"><b>Sponsored</b> · {name}</div>
              </div>
            </div>
            <span className="yt-cta">{ad.cta}</span>
          </div>
          <SkeletonVideo />
        </Phone>

        <Phone label="Discover feed">
          <div className="disc-top">
            <div className="skel w40" />
          </div>
          <div className="disc-card">
            <Media media={ad.dgMedia} className="disc-media" placeholder="Image 1.91:1" />
            <div className="disc-body">
              <div className="disc-brand"><Logo logo={ad.logo} name={name} size={16} />{name}</div>
              <div className="disc-title clamp2">{headline}</div>
              <div className="disc-desc clamp2">{desc}</div>
              <div className="disc-foot">
                <span><b>Sponsored</b></span>
                <span className="disc-cta">{ad.cta}</span>
              </div>
            </div>
          </div>
          <div className="disc-card ghost">
            <div className="skel-box" />
            <div className="disc-body">
              <div className="skel w50" />
              <div className="skel w90" />
            </div>
          </div>
        </Phone>

        <Phone label="Gmail promotions">
          <div className="gm-top">
            <div className="gm-search">Search in mail</div>
            <div className="gm-tab">Promotions</div>
          </div>
          <div className="gm-row ad">
            <Logo logo={ad.logo} name={name} size={36} />
            <div className="gm-text">
              <div className="gm-line1"><span className="gm-badge">Ad</span><b>{name}</b></div>
              <div className="gm-subject clamp1">{headline}</div>
              <div className="gm-snippet clamp1">{desc}</div>
            </div>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div className="gm-row" key={i}>
              <span className="skel-dot big" />
              <div className="gm-text">
                <div className="skel w40" />
                <div className="skel w80" />
                <div className="skel w90" />
              </div>
            </div>
          ))}
        </Phone>
      </div>
      </FitBoard>
      <p className="note">Demand Gen ads show across YouTube, Discover and Gmail. Layout is approximate.</p>
    </div>
  )
}
