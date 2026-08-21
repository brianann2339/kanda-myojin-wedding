import { useState } from 'react'
import { useLang } from '../i18n'
import { Chevron } from './icons'
import { SectionHead } from './SectionHead'

/** 攝影規範一題要標明「依神社規定」 */
const SHRINE_RULE_INDEX = 4

export function FAQ() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section" id="faq">
      <SectionHead num="捌" kicker={t.faq.kicker} title={t.faq.title} />

      <div className="stack-sm">
        {t.faq.items.map((item, i) => {
          const isOpen = open === i && item.a !== null
          const answered = item.status === 'answered'
          const draft = item.status === 'draft'
          const tag = answered
            ? t.common.confirmed
            : draft
              ? t.common.draft
              : i === SHRINE_RULE_INDEX
                ? t.faq.shrineTag
                : t.faq.pendingTag

          return (
            <div className="faq" key={item.q} data-open={isOpen} data-answered={answered} data-draft={draft}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-meta">
                  <span className={answered ? 'tag tag-fixed' : 'tag tag-tbd'}>{tag}</span>
                  <Chevron className="faq-chevron" />
                </span>
              </button>
              {isOpen && <div className="faq-a">{item.a}</div>}
            </div>
          )
        })}
      </div>

      <div className="hint" style={{ marginTop: 20 }}>
        <span aria-hidden />
        <p>{t.faq.note}</p>
      </div>
    </section>
  )
}
