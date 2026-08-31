import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Chevron } from './icons'
import { SectionHead } from './SectionHead'

export function Contact() {
  const { t, l } = useLang()
  const { formUrl } = wedding.rsvp

  return (
    <section className="section" id="contact">
      <SectionHead num="捌" kicker={t.contact.kicker} title={t.contact.title} />

      <div className="card stack">
        <div className="body-text">{t.contact.formIntro}</div>
        <div className="stack-sm">
          {t.contact.fields.map((field) => (
            <div className="field" key={field}>
              <span>{field}</span>
              <Chevron />
            </div>
          ))}
        </div>

        {formUrl ? (
          <a className="btn" href={formUrl} target="_blank" rel="noreferrer">
            {t.contact.rsvpButton}
          </a>
        ) : (
          <>
            <span className="btn" aria-disabled="true">
              {t.contact.rsvpButton}
            </span>
            <span className="tag tag-tbd" style={{ alignSelf: 'center' }}>
              {t.contact.formTbd}
            </span>
          </>
        )}
      </div>

      <div className="card stack" style={{ marginTop: 12 }}>
        <div className="group-title">{t.contact.contactTitle}</div>
        <div className="fact-sub">{t.contact.contactIntro}</div>

        <div className="contact-cards">
          {wedding.contacts.map((c) => (
            <div className="person-card stack-sm" key={c.person}>
              <div className="person-name">
                {l(c.person === 'groom' ? wedding.couple.groom : wedding.couple.bride)}
              </div>
              <a className="channel" href={c.instagramUrl} target="_blank" rel="noreferrer">
                <span className="channel-name">INSTAGRAM</span>
                <span className="channel-val">@{c.instagram}</span>
              </a>
              <a className="channel" href={c.facebookUrl} target="_blank" rel="noreferrer">
                <span className="channel-name">FACEBOOK</span>
                <span className="channel-val">{c.facebookHandle}</span>
              </a>
              <a className="channel" href={`https://line.me/ti/p/~${c.lineId}`} target="_blank" rel="noreferrer">
                <span className="channel-name">LINE</span>
                <span className="channel-val">{c.lineId}</span>
              </a>
              <a className="channel" href={`mailto:${c.email}`}>
                <span className="channel-name">EMAIL</span>
                <span className="channel-val">{c.email}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="small-note">{t.contact.noPhone}</div>
      </div>
    </section>
  )
}
