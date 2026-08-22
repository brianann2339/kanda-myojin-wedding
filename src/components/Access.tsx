import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { TrainJR, TrainMetro } from './icons'
import { SectionHead } from './SectionHead'

export function Access() {
  const { t, l } = useLang()

  return (
    <section className="section" id="access">
      <SectionHead num="伍" kicker={t.access.kicker} title={t.access.title} />

      <div className="stack">
        <div className="group-title">{t.access.stationsTitle}</div>
        {wedding.stations.map((station) => (
          <div className="station" key={station.id}>
            {station.kind === 'jr' ? <TrainJR /> : <TrainMetro />}
            <div className="station-body">
              <div className="station-name">
                {l(station.name)}
                {station.exit && <small>{l(station.exit)}</small>}
              </div>
              <div className="station-lines">{l(station.lines)}</div>
            </div>
            <div className="station-walk">{t.access.walkUnit(station.walk)}</div>
          </div>
        ))}
        <div className="small-note">{t.access.source}</div>
      </div>

      <div className="stack" style={{ marginTop: 24 }}>
        <div className="group-title">{t.access.airportTitle}</div>

        {wedding.airportRoutes.map((airport) => (
          <div className="airport" key={airport.id}>
            <div className="airport-name">{l(airport.airport)}</div>
            {airport.routes.map((route) => (
              <div className="route-card" key={route.operator.url + l(route.label)}>
                <div className="route-label">{l(route.label)}</div>
                <ol className="legs">
                  {route.legs.map((leg) => (
                    <li key={l(leg)}>{l(leg)}</li>
                  ))}
                </ol>
                <div className="route-meta">
                  <span className="route-duration">{l(route.duration)}</span>
                  <a href={route.operator.url} target="_blank" rel="noreferrer">
                    {t.access.operatorLink} ↗
                  </a>
                </div>
                {route.fare && <div className="route-fare">{l(route.fare)}</div>}
              </div>
            ))}
          </div>
        ))}

        <div className="small-note">{t.access.routeSource}</div>
      </div>

      <div className="card row-between" style={{ marginTop: 24 }}>
        <div className="stack-sm">
          <div className="group-title">{t.access.taxiTitle}</div>
          <div className="fact-sub">{t.access.taxiDesc}</div>
        </div>
        <span className="tag tag-tbd">{t.common.toBeAdded}</span>
      </div>
    </section>
  )
}
