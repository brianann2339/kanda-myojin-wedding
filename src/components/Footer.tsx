import { wedding } from '../content/wedding'
import { useCoupleNames, useLang } from '../i18n'
import { Torii } from './icons'

export function Footer() {
  const { t } = useLang()
  const names = useCoupleNames()

  return (
    <footer className="footer">
      <Torii size={46} tone="gold" />
      <div className="footer-names">{names.full}</div>
      <div className="footer-romaji">{wedding.couple.romaji}</div>
      <div className="footer-date">{wedding.date.display} · TOKYO</div>
      <div className="footer-tagline">{t.contact.tagline}</div>
    </footer>
  )
}
