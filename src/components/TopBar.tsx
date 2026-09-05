import { useEffect, useRef } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { LangSwitch } from './LangSwitch'

/** 第一行：與頁面上的七個內容 section 一一對應（出席入口另做第二行按鈕） */
const LINKS = [
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
  const barRef = useRef<HTMLDivElement>(null)

  /* 兩行頂欄的實際高度隨語言、字型載入與寬度而變：量出來寫進 --topbar-h，錨點位移與 hero 上緣才不會被蓋到 */
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const root = document.documentElement
    const apply = () => root.style.setProperty('--topbar-h', `${el.getBoundingClientRect().height}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--topbar-h')
    }
  }, [])

  return (
    <div className="topbar" ref={barRef}>
      <div className="topbar-inner">
        <a className="topbar-name" href="#top">
          {wedding.couple.romaji}
        </a>
        <nav className="topbar-links" aria-label={t.nav.sectionsLabel}>
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`}>
              {t.nav[link.key]}
            </a>
          ))}
        </nav>
        <LangSwitch />
      </div>

      {/* 第二行：出席入口。新增＝表單（#contact）、查詢／修改＝名單（#attendees） */}
      <nav className="topbar-actions" aria-label={t.nav.rsvpLabel}>
        <a className="topbar-btn topbar-btn--add" href="#contact">
          {t.nav.addGuests}
        </a>
        <a className="topbar-btn topbar-btn--check" href="#attendees">
          {t.nav.checkGuests}
        </a>
      </nav>
    </div>
  )
}
