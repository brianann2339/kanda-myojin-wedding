import { useLang } from '../i18n'
import { SectionHead } from './SectionHead'

export function Stay() {
  const { t } = useLang()

  return (
    <section className="section" id="stay">
      <SectionHead num="柒" kicker={t.stay.kicker} title={t.stay.title} />

      <div className="stack">
        {t.stay.areas.map((area, i) => (
          <div className="area" key={area.name}>
            <div className="row-between">
              <h3>{area.name}</h3>
              {i === 0 && <span className="tag tag-solid">{t.stay.nearest}</span>}
            </div>
            <p>{area.desc}</p>
            <div className="area-tbd">{t.stay.hotelTbd}</div>
          </div>
        ))}
      </div>

      <div className="hint" style={{ marginTop: 20 }}>
        <span aria-hidden />
        <p>{t.stay.note}</p>
      </div>
    </section>
  )
}
