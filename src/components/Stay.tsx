import { wedding, type HotelArea } from '../content/wedding'
import { useLang } from '../i18n'
import { SectionHead } from './SectionHead'

/** 與 copy.ts 的 stay.areas 同順序 */
const AREA_KEYS: HotelArea[] = ['ochanomizu', 'akihabara', 'kanda', 'tokyo-station']

export function Stay() {
  const { t, l } = useLang()

  return (
    <section className="section" id="stay">
      <SectionHead num="柒" kicker={t.stay.kicker} title={t.stay.title} />

      <div className="hint" style={{ marginBottom: 20 }}>
        <span aria-hidden />
        <p>{t.stay.note}</p>
      </div>

      <div className="stack">
        {t.stay.areas.map((area, i) => {
          const hotels = wedding.hotels.filter((hotel) => hotel.area === AREA_KEYS[i])
          return (
            <div className="area" key={area.name}>
              <div className="row-between">
                <h3>{area.name}</h3>
                {i === 0 && <span className="tag tag-solid">{t.stay.nearest}</span>}
              </div>
              <p>{area.desc}</p>

              {hotels.length > 0 ? (
                <div className="stack-sm">
                  {hotels.map((hotel) => (
                    <a className="hotel" key={hotel.url} href={hotel.url} target="_blank" rel="noreferrer">
                      <span className="hotel-body">
                        <span className="hotel-name">{hotel.name}</span>
                        <span className="hotel-romaji">{hotel.romaji}</span>
                        <span className="hotel-access">{l(hotel.access)}</span>
                      </span>
                      <span className="hotel-link">{t.stay.officialSite} ↗</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="area-tbd">{t.stay.hotelTbd}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="small-note" style={{ marginTop: 12 }}>
        {t.stay.walkSource}
      </div>
    </section>
  )
}
