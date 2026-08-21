import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Gagaku, MikoDance, ToriiSmall } from './icons'
import { SectionHead } from './SectionHead'

const ritualIcons = [ToriiSmall, Gagaku, MikoDance]

export function Ceremony() {
  const { t, l } = useLang()

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
        <div className="group-title">{t.ceremony.ritualTitle}</div>
        {t.ceremony.rituals.map((ritual, i) => {
          const Icon = ritualIcons[i]
          return (
            <div className="ritual" key={ritual.name}>
              <Icon />
              <div>
                <h4>{ritual.name}</h4>
                <p>{ritual.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.ceremony.orderTitle}</div>
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

      <div className="card row-between" style={{ marginTop: 24 }}>
        <div className="stack-sm">
          <div className="group-title">{t.ceremony.receptionTitle}</div>
          <div className="fact-sub">{t.ceremony.receptionDesc}</div>
        </div>
        <span className="tag tag-fixed">{t.common.confirmed}</span>
      </div>
    </section>
  )
}
