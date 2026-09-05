import { useEffect, useRef, useState } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Attendees } from './Attendees'
import { RsvpForm } from './RsvpForm'
import { SectionHead } from './SectionHead'

export function Contact() {
  const { t, l } = useLang()
  const [refreshKey, setRefreshKey] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  /* 送出成功後才捲到「查詢已報名賓客」：放在 effect 裡，等表單收合成完成訊息、版面定型後再量位置 */
  useEffect(() => {
    if (refreshKey === 0) return
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [refreshKey])

  return (
    <section className="section" id="contact">
      <SectionHead num="捌" kicker={t.contact.kicker} title={t.contact.title} />

      <div className="card stack">
        <RsvpForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
      </div>

      <div ref={listRef} id="attendees" className="scroll-target">
        <Attendees refreshKey={refreshKey} />
      </div>

      <div className="card stack" style={{ marginTop: 12 }}>
        <div className="group-title">{t.contact.contactTitle}</div>
        <div className="fact-sub">{t.contact.contactIntro}</div>

        <div className="contact-cards">
          {wedding.contacts.map((c) => {
            const name = l(c.person === 'groom' ? wedding.couple.groom : wedding.couple.bride)
            /* 帳號本身不顯示，點名稱直接開對應的私訊視窗 */
            const channels = [
              { label: 'INSTAGRAM', href: c.instagramUrl },
              { label: 'FACEBOOK', href: c.facebookUrl },
              { label: 'LINE', href: `https://line.me/ti/p/~${c.lineId}` },
              { label: 'EMAIL', href: `mailto:${c.email}` },
            ]

            return (
              <div className="person-card stack-sm" key={c.person}>
                <div className="person-name">{name}</div>
                {channels.map((ch) => (
                  <a
                    className="channel"
                    key={ch.label}
                    href={ch.href}
                    aria-label={`${name}・${ch.label}`}
                    {...(ch.label === 'EMAIL' ? {} : { target: '_blank', rel: 'noreferrer' })}
                  >
                    <span className="channel-name">{ch.label}</span>
                    <span className="channel-go" aria-hidden>
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            )
          })}
        </div>

        <div className="small-note">{t.contact.noPhone}</div>
      </div>
    </section>
  )
}
