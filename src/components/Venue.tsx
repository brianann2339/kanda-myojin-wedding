import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Crowd, Jacket, Pin, Torii } from './icons'
import { SectionHead } from './SectionHead'

const noticeIcons = [Jacket, Crowd]

export function Venue() {
  const { t, l } = useLang()
  const photo = wedding.photos.venue

  return (
    <section className="section" id="venue">
      <SectionHead num="肆" kicker={t.venue.kicker} title={t.venue.title} />

      <figure className="venue-figure">
        <div className="photo-frame">
          {photo ? (
            <img src={photo.src} alt={t.venue.photoAlt} loading="lazy" />
          ) : (
            <>
              <Torii size={88} />
              <span>{t.venue.photoPlaceholder}</span>
            </>
          )}
        </div>
        {photo && (
          <figcaption>
            <a className="credit" href={photo.creditUrl} target="_blank" rel="noreferrer">
              {photo.credit}
            </a>
          </figcaption>
        )}
      </figure>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.venue.aboutTitle}</div>
        <div className="placeholder">
          <div className="body-text">{t.venue.aboutDraft}</div>
          <div className="small-note">{t.venue.aboutDraftSub}</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.venue.addressTitle}</div>
        <div className="card stack">
          <div className="stack-sm">
            <div className="fact-label" style={{ width: 'auto' }}>
              {t.venue.addressLabel}
            </div>
            <div className="address">
              {wedding.venue.postalCode}
              <br />
              {l(wedding.venue.address)}
            </div>
          </div>
          <a className="btn" href={wedding.venue.mapUrl} target="_blank" rel="noreferrer">
            <Pin />
            {t.venue.mapButton}
          </a>
          <a className="btn-ghost" href={wedding.venue.officialUrl} target="_blank" rel="noreferrer">
            {t.venue.officialButton}
          </a>
          <div className="small-note">{t.venue.addressSource}</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.venue.noticeTitle}</div>
        {t.venue.notices.map((notice, i) => {
          const Icon = noticeIcons[i]
          return (
            <div className="notice" key={notice}>
              <Icon />
              <p>
                {notice}
                <em>（{t.venue.noticeTags[i]}）</em>
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
