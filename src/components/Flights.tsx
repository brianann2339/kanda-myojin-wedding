import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { RouteArrow } from './icons'
import { SectionHead } from './SectionHead'

export function Flights() {
  const { t, l } = useLang()

  return (
    <section className="section" id="flights">
      <SectionHead num="陸" kicker={t.flights.kicker} title={t.flights.title} />

      <div className="hint" style={{ marginBottom: 20 }}>
        <span aria-hidden />
        <p>{t.flights.note}</p>
      </div>

      <div className="stack">
        {wedding.departures.map((route) => (
          <div className="route" key={route.code}>
            <div className="route-top">
              <div>
                <div className="route-code">{route.code}</div>
                <div className="route-place">{l(route.from)}</div>
              </div>
              <RouteArrow />
              <div className="route-end">
                <div className="route-code">{route.toCode}</div>
                <div className="route-place">{l(route.to)}</div>
              </div>
            </div>
            <div className="route-foot">
              <span className="fact-sub">{l(route.note)}</span>
              <span className="tag tag-tbd">{t.flights.flightTbd}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.flights.compareTitle}</div>
        <div className="placeholder">
          <div className="body-text">{t.flights.compareDesc}</div>
          <span className="tag tag-tbd" style={{ alignSelf: 'flex-start' }}>
            {t.flights.compareTbd}
          </span>
        </div>
      </div>

      <div className="card stack-sm" style={{ marginTop: 12 }}>
        <div className="group-title">{t.flights.japanTitle}</div>
        <div className="fact-sub">{t.flights.japanDesc}</div>
      </div>
    </section>
  )
}
