import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { SectionHead } from './SectionHead'

export function Stay() {
  const { t, l } = useLang()

  return (
    <section className="section" id="stay">
      <SectionHead num="柒" kicker={t.stay.kicker} title={t.stay.title} />

      <div className="hint" style={{ marginBottom: 20 }}>
        <span aria-hidden />
        <p>{t.stay.criteria}</p>
      </div>

      <div className="stack">
        {wedding.hotels.map((hotel) => (
          <a className="hotel" key={hotel.url} href={hotel.url} target="_blank" rel="noreferrer">
            <span className="hotel-body">
              <span className="hotel-name">{hotel.name}</span>
              <span className="hotel-romaji">{hotel.romaji}</span>
              <span className="hotel-access">
                {t.stay.stationLabel}：{l(hotel.station)}
              </span>
            </span>
            <span className="hotel-walk">
              <span className="hotel-walk-label">{t.stay.walkToVenue}</span>
              <span className="hotel-walk-min">{hotel.walkMin} {t.stay.minUnit}</span>
              <span className="hotel-walk-m">{hotel.walkMeters} m</span>
            </span>
          </a>
        ))}
      </div>

      <div className="small-note" style={{ marginTop: 12 }}>
        {t.stay.walkSource}
      </div>
    </section>
  )
}
