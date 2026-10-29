import { Logo, Media } from '../components/Fields.jsx'
import FitBoard from '../components/FitBoard.jsx'

function Frame({ w, h, label, children }) {
  return (
    <figure className="display-fig">
      <div className="display-ad" style={{ width: w, height: h }}>
        <span className="ad-choices">Ad ▷</span>
        {children}
      </div>
      <figcaption>{label} · {w}×{h}</figcaption>
    </figure>
  )
}

export default function DisplayPreview({ ad }) {
  const name = ad.businessName || 'Business'
  const headline = ad.shortHeadline || 'Short headline'
  const longHeadline = ad.longHeadline || 'Long headline'
  const desc = ad.displayDescription || 'Description'
  const square = ad.squareImage || ad.landscapeImage

  return (
    <div className="preview-section">
      <FitBoard width={728}>
        <div className="display-board">
          <Frame w={728} h={90} label="Leaderboard">
            <div className="d-row">
              <Media media={square} className="d-sq" placeholder="Square" />
              <div className="d-row-text">
                <div className="d-headline">{headline}</div>
                <div className="d-desc clamp1">{desc}</div>
              </div>
              <span className="d-cta">{ad.cta}</span>
            </div>
          </Frame>

          <div className="display-row">
            <Frame w={300} h={600} label="Half page">
              <div className="d-col">
                <Media media={ad.landscapeImage} className="d-img" placeholder="Landscape 1.91:1" />
                <div className="d-body tall">
                  <div className="d-tall-main">
                    <Logo logo={ad.logo} name={name} size={48} />
                    <div className="d-headline big">{longHeadline}</div>
                    <div className="d-desc">{desc}</div>
                  </div>
                  <div className="d-brand-line">{name}</div>
                  <span className="d-cta full">{ad.cta}</span>
                </div>
              </div>
            </Frame>

            <div className="display-col">
              <Frame w={336} h={280} label="Large rectangle">
                <div className="d-col">
                  <Media media={ad.landscapeImage} className="d-img" placeholder="Landscape 1.91:1" />
                  <div className="d-body">
                    <div className="d-headline">{longHeadline}</div>
                    <div className="d-foot">
                      <span className="d-brand"><Logo logo={ad.logo} name={name} size={18} />{name}</span>
                      <span className="d-cta">{ad.cta}</span>
                    </div>
                  </div>
                </div>
              </Frame>

              <Frame w={300} h={250} label="Medium rectangle">
                <div className="d-col">
                  <Media media={ad.landscapeImage} className="d-img" placeholder="Landscape 1.91:1" />
                  <div className="d-body">
                    <div className="d-headline">{headline}</div>
                    <div className="d-desc clamp1">{desc}</div>
                    <div className="d-foot">
                      <span className="d-brand"><Logo logo={ad.logo} name={name} size={18} />{name}</span>
                      <span className="d-cta">{ad.cta}</span>
                    </div>
                  </div>
                </div>
              </Frame>
            </div>
          </div>

          <div className="display-row">
            <Frame w={320} h={100} label="Large mobile banner">
              <div className="d-row">
                <Media media={square} className="d-sq" placeholder="Square" />
                <div className="d-row-text">
                  <div className="d-headline small">{headline}</div>
                  <div className="d-desc clamp1 small">{name}</div>
                </div>
                <span className="d-cta round">›</span>
              </div>
            </Frame>

            <Frame w={320} h={50} label="Mobile banner">
              <div className="d-row tight">
                <Logo logo={ad.logo} name={name} size={34} />
                <div className="d-row-text">
                  <div className="d-headline small clamp1">{headline}</div>
                </div>
                <span className="d-cta round">›</span>
              </div>
            </Frame>
          </div>
        </div>
      </FitBoard>
      <p className="note">Scaled to fit the screen. Sizes in the labels are the real pixel sizes.</p>
    </div>
  )
}
