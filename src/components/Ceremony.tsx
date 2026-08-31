import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { SectionHead } from './SectionHead'

export function Ceremony() {
  const { t, l } = useLang()
  const reception = wedding.reception

  return (
    <section className="section" id="ceremony">
      <SectionHead num="貳" kicker={t.ceremony.kicker} title={t.ceremony.title} />

      <div className="stack">
        <div className="fact">
          <div className="fact-label">{t.ceremony.dateLabel}</div>
          <div className="fact-body">
            <div className="row-between" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <span className="fact-main">{l(wedding.date.main)}</span>
              {!wedding.date.confirmed && <span className="tag tag-tbd">{t.common.tbd}</span>}
            </div>
            <div className="fact-sub">{l(wedding.date.estimate)}</div>
          </div>
        </div>

        <div className="fact">
          <div className="fact-label">{t.ceremony.timeLabel}</div>
          <div className="fact-body">
            <div className="fact-main-placeholder">{wedding.date.time ?? '──：──'}</div>
            <div className="row-between" style={{ justifyContent: 'flex-start', gap: 8 }}>
              <span className="fact-sub">{t.ceremony.timeSub}</span>
              {!wedding.date.time && <span className="tag tag-tbd">{t.common.tbd}</span>}
            </div>
          </div>
        </div>

        <div className="fact">
          <div className="fact-label">{t.ceremony.venueLabel}</div>
          <div className="fact-body">
            <div className="fact-main">{l(wedding.venue.name)}</div>
            <div className="fact-sub">{l(wedding.venue.sub)}</div>
          </div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.ceremony.orderTitle}</div>
        <p className="body-text">{t.ceremony.ritualNote}</p>
        <ol className="order">
          {t.ceremony.order.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="card stack-sm">
          <div className="fact-sub">{t.ceremony.capacity}</div>
        </div>
        <div className="small-note">{t.ceremony.ritualSource}</div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="row-between">
          <div className="group-title">{t.ceremony.receptionTitle}</div>
          <span className="tag tag-fixed">{t.common.confirmed}</span>
        </div>
        <p className="body-text">{t.ceremony.receptionDesc}</p>

        <div className="card stack">
          <div className="reception-row">
            <span className="reception-label">{t.ceremony.receptionHallLabel}</span>
            <span className="reception-value">
              <span className="reception-hall">
                {l(reception.venueName)} · {l(reception.hall.name)}
              </span>
              <span className="fact-sub">{l(reception.hall.capacity)}</span>
              <span className="fact-sub">{l(reception.hall.feature)}</span>
              <span className="fact-sub">{l(reception.venueNote)}</span>
            </span>
          </div>

          <div className="reception-row">
            <span className="reception-label">{t.ceremony.receptionTimeLabel}</span>
            <span className="reception-value">
              <span className="row-between" style={{ justifyContent: 'flex-start', gap: 8 }}>
                <span className="fact-main-placeholder">{reception.startTime ?? '──：──'}</span>
                {!reception.startTime && <span className="tag tag-tbd">{t.common.tbd}</span>}
              </span>
            </span>
          </div>

          <div className="reception-row">
            <span className="reception-label">{t.ceremony.receptionCuisineLabel}</span>
            <span className="reception-value">
              <span className="fact-sub">{l(reception.cuisine)}</span>
            </span>
          </div>

          <a className="btn-ghost" href={reception.officialUrl} target="_blank" rel="noreferrer">
            {t.ceremony.receptionSiteButton} ↗
          </a>
          <div className="small-note">{l(reception.sourceNote)}</div>
        </div>
      </div>
    </section>
  )
}
