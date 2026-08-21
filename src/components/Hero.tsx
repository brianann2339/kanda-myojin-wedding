import { useEffect, useState } from 'react'
import { wedding } from '../content/wedding'
import { useCoupleNames, useLang } from '../i18n'
import { Chevron, Torii } from './icons'
import { LangSwitch } from './LangSwitch'

/** 日期確定前回傳 null，畫面顯示佔位的 ── */
function useCountdown() {
  const target =
    wedding.date.confirmed && wedding.date.iso
      ? new Date(`${wedding.date.iso}T${wedding.date.time ?? '00:00'}:00+09:00`).getTime()
      : null

  const [left, setLeft] = useState(() => (target ? Math.max(0, target - Date.now()) : null))

  useEffect(() => {
    if (!target) return
    const tick = () => setLeft(Math.max(0, target - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (left === null) return null
  const s = Math.floor(left / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function Hero() {
  const { t } = useLang()
  const names = useCoupleNames()
  const left = useCountdown()
  const photo = wedding.photos.hero

  const cells = [
    { unit: t.hero.days, value: left ? String(left.days) : '──' },
    { unit: t.hero.hours, value: left ? pad(left.hours) : '──' },
    { unit: t.hero.minutes, value: left ? pad(left.minutes) : '──' },
    { unit: t.hero.seconds, value: left ? pad(left.seconds) : '──' },
  ]

  return (
    <header className="hero" id="top">
      <div className="hero-langs">
        <LangSwitch />
      </div>

      <div className="hero-kicker">TOKYO · {wedding.date.year}</div>
      <div className="hero-stroke" />

      <div className="hero-names">
        <h1>
          {names.groom}
          <span className="amp">{names.separator}</span>
          {names.bride}
        </h1>
        <div className="hero-romaji">{wedding.couple.romaji}</div>
      </div>

      <div className="hero-figure">
        <div className="hero-photo">
          {photo ? (
            <img src={photo.src} alt={t.hero.photoAlt} />
          ) : (
            <>
              <Torii size={64} />
              <div className="hero-photo-note">{t.hero.photoPlaceholder}</div>
            </>
          )}
        </div>
        {photo?.isPlaceholder && <span className="tag tag-tbd">{t.hero.photoTag}</span>}
        {photo && (
          <a className="credit" href={photo.creditUrl} target="_blank" rel="noreferrer">
            {photo.credit}
          </a>
        )}
      </div>

      <div className="hero-when">
        <div className="hero-shrine">{t.hero.shrineLine}</div>
        <div className="hero-date">{wedding.date.display}</div>
        <div className="countdown" data-live={left !== null}>
          {cells.map((cell) => (
            <div key={cell.unit}>
              <div className="value">{cell.value}</div>
              <div className="unit">{cell.unit}</div>
            </div>
          ))}
        </div>
        {!wedding.date.confirmed && <div className="hero-note">{t.hero.dateNote}</div>}
      </div>

      <a className="hero-scroll" href="#invitation">
        {t.hero.scroll}
        <Chevron />
      </a>
    </header>
  )
}
