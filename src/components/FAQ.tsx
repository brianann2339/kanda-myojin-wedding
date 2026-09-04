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
      <SectionHead num="柒" kicker={t.faq.kicker} title={t.faq.title} />

      <div className="stack-sm">
        {t.faq.items.map((item, i) => {
          const isOpen = open === i && item.a !== null
          const answered = item.status === 'answered'
          const draft = item.status === 'draft'
          const tag = draft ? t.common.draft : i === SHRINE_RULE_INDEX ? t.faq.shrineTag : t.faq.pendingTag

          return (
            <div className="faq" key={item.q} data-open={isOpen} data-answered={answered} data-draft={draft}>
              {item.a !== null ? (
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-meta">
                    {!answered && <span className="tag tag-tbd">{tag}</span>}
                    <Chevron className="faq-chevron" />
                  </span>
                </button>
              ) : (
                <div className="faq-q faq-q--static">
                  <span>{item.q}</span>
                  <span className="faq-meta">
                    <span className="tag tag-tbd">{tag}</span>
                  </span>
                </div>
              )}
              {isOpen && <div className="faq-a">{item.a}</div>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
