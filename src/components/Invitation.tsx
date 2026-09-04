import { useCoupleNames, useLang } from '../i18n'
import { Mizuhiki } from './icons'
import { SectionHead } from './SectionHead'

export function Invitation() {
  const { t, lang } = useLang()
  const names = useCoupleNames()

  return (
    <section className="section" id="invitation">
      <SectionHead num="壹" kicker={t.invitation.kicker} title={t.invitation.title} />

      <div className="envelope">
        <Mizuhiki />
        <div className="letter">
          <div className="letter-eyebrow">{t.invitation.eyebrow}</div>
          <h3>{t.invitation.heading}</h3>
          <div className="letter-divider" />
          <div className="letter-body">
            {t.invitation.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="letter-sign">
            {lang === 'en' ? names.full : `${names.full}　${t.invitation.signature}`}
          </div>
        </div>
      </div>
    </section>
  )
}
