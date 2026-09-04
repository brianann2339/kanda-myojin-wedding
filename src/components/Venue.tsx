import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Jacket, Pin, Torii } from './icons'
import { SectionHead } from './SectionHead'

const noticeIcons = [Jacket]

export function Venue() {
  const { t, l } = useLang()
  const photo = wedding.photos.venue

  return (
    <section className="section" id="venue">
      <SectionHead num="參" kicker={t.venue.kicker} title={t.venue.title} />

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
        <div className="prose">
          {t.venue.about.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.venue.deitiesTitle}</div>
        {t.venue.deities.map((deity) => (
          <div className="deity" key={deity.name}>
            <div className="deity-head">
              <span className="deity-name">{deity.name}</span>
              <span className="deity-alias">{deity.alias}</span>
            </div>
            <div className="deity-role">{deity.role}</div>
          </div>
        ))}
        <div className="small-note">{t.venue.aboutSource}</div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.venue.videoTitle}</div>
        <p className="body-text">{t.venue.videoDesc}</p>
        <video
          className="video-embed"
          style={{ aspectRatio: '16 / 9' }}
          controls
          preload="none"
          playsInline
          poster={wedding.videos.ceremonyPreview.poster}
        >
          <source src={wedding.videos.ceremonyPreview.src} type="video/mp4" />
        </video>
        <div className="credit">{wedding.videos.ceremonyPreview.credit}</div>
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
              <p>{notice}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
