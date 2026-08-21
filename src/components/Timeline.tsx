import { useLang } from '../i18n'
import { SectionHead } from './SectionHead'

/** 參進之儀與神前式是當天的重點，時間軸上以實心點標示 */
const KEY_STEPS = new Set([3, 4])

export function Timeline() {
  const { t } = useLang()
  const items = t.timeline.items

  return (
    <section className="section" id="timeline">
      <SectionHead num="參" kicker={t.timeline.kicker} title={t.timeline.title} />

      <div className="hint" style={{ marginBottom: 20 }}>
        <span aria-hidden />
        <p>{t.timeline.note}</p>
      </div>

      <div className="timeline">
        {items.map((item, i) => (
          <div className="tl-item" key={item.name} data-key={KEY_STEPS.has(i)}>
            <div className="tl-marker">
              <div className="tl-dot" />
              {i < items.length - 1 && <div className="tl-line" />}
            </div>
            <div className="tl-body">
              <div className="tl-time">──：──</div>
              <div className="tl-name">{item.name}</div>
              <div className="tl-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
