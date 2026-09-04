import { useEffect, useState } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { LangSwitch } from './LangSwitch'

/** 與頁面上的八個 section 一一對應 */
const LINKS = [
  { id: 'contact', key: 'contact' },
  { id: 'invitation', key: 'invitation' },
  { id: 'timeline', key: 'timeline' },
  { id: 'venue', key: 'venue' },
  { id: 'access', key: 'access' },
  { id: 'flights', key: 'flights' },
  { id: 'stay', key: 'stay' },
  { id: 'faq', key: 'faq' },
] as const

export function TopBar() {
  const { t } = useLang()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="topbar" data-shown={shown}>
      <div className="topbar-inner">
        <a className="topbar-name" href="#top">
          {wedding.couple.romaji}
        </a>
        <nav className="topbar-links">
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={link.id === 'contact' ? 'topbar-rsvp' : undefined}>
              {t.nav[link.key]}
            </a>
          ))}
        </nav>
        <LangSwitch />
      </div>
    </div>
  )
}
