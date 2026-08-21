import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Chevron } from './icons'
import { SectionHead } from './SectionHead'

export function Contact() {
  const { t } = useLang()
  const { formUrl, lineUrl, email } = wedding.rsvp

  return (
    <section className="section" id="contact">
      <SectionHead num="拾" kicker={t.contact.kicker} title={t.contact.title} />

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

        <div className="stack-sm">
          <div className="channel">
            <span className="channel-name">LINE</span>
            {lineUrl ? (
              <a href={lineUrl} target="_blank" rel="noreferrer">
                LINE
              </a>
            ) : (
              <span className="tag tag-tbd">{t.contact.lineTbd}</span>
            )}
          </div>
          <div className="channel">
            <span className="channel-name">EMAIL</span>
            {email ? <a href={`mailto:${email}`}>{email}</a> : <span className="tag tag-tbd">{t.contact.emailTbd}</span>}
          </div>
        </div>

        <div className="small-note">{t.contact.noPhone}</div>
      </div>
    </section>
  )
}
