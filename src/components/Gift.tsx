import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { TulipRose } from './icons'
import { SectionHead } from './SectionHead'

export function Gift() {
  const { t, l } = useLang()

  return (
    <section className="section" id="gift">
      <SectionHead num="玖" kicker={t.gift.kicker} title={t.gift.title} />

      <div className="gift">
        <span className="tag" style={{ background: 'var(--gold)', color: 'var(--card)', letterSpacing: '0.24em', padding: '4px 12px' }}>
          {t.gift.chosen}
        </span>
        <TulipRose />
        <div className="stack-sm" style={{ alignItems: 'center' }}>
          <div className="gift-brand">{wedding.gift.brand}</div>
          <div className="gift-local">{l(wedding.gift.brandLocal)}</div>
        </div>
        <div className="letter-divider" />
        <div className="gift-desc">
          {t.gift.desc.map((line) => (
            <p key={line} style={{ margin: 0 }}>
              {line}
            </p>
          ))}
        </div>
        <a className="gift-site" href={wedding.gift.site} target="_blank" rel="noreferrer">
          tuliprose.jp
        </a>
      </div>

      <div className="stack-sm" style={{ marginTop: 12 }}>
        {t.gift.rows.map((row) => (
          <div className="card row-between" key={row.label}>
            <span className="body-text">{row.label}</span>
            <span className="tag tag-tbd">{row.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
