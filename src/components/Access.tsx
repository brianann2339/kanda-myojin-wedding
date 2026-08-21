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
        <div className="placeholder">
          <div className="row-between" style={{ justifyContent: 'flex-start', gap: 8 }}>
            <span className="body-text">{t.access.haneda}</span>
            <span className="tag tag-tbd">{t.access.routeTbd}</span>
          </div>
          <div className="row-between" style={{ justifyContent: 'flex-start', gap: 8 }}>
            <span className="body-text">{t.access.narita}</span>
            <span className="tag tag-tbd">{t.access.routeTbd}</span>
          </div>
          <div className="small-note">{t.access.airportNote}</div>
        </div>
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
