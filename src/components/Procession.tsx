import { useEffect, useRef, useState } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'

/** 隊伍名單與順序都在 wedding.ts；每個檔案是一條四格的走路循環（跨步／併腳／跨步／併腳） */
const WALKERS = wedding.procession

/** 走一次循環前進的距離，以身高為單位（實測步幅約 0.41 倍身高，一循環兩步） */
const ADVANCE_PER_CYCLE = 0.82
/** 換算速度用的基準身高：取所有人的中位數，日後加減人也不必改這裡 */
const REF_HEIGHT = WALKERS.map((w) => w.h).sort((a, b) => a - b)[Math.floor(WALKERS.length / 2)]
/** 最高的一位（含番傘）決定橫帶高度；圖還沒載入時先用它撐住，版面才不會跳 */
const TALLEST = Math.max(...WALKERS.map((w) => w.h))

function Group() {
  return (
    <div className="proc-group">
      {WALKERS.map((walker, i) => (
        <span
          key={walker.src}
          className="walker"
          style={
            {
              '--fw': `calc(${walker.w} * var(--walk-unit))`,
              '--fh': `calc(${walker.h} * var(--walk-unit))`,
              backgroundImage: `url(${walker.src})`,
              /* 錯開相位，整隊才不會像機器人一起踏步 */
              animationDelay: `${(-0.11 * i).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function Procession() {
  const { t } = useLang()
  const [paused, setPaused] = useState(false)
  /* 捲到附近才開始跑、也才去下載那 15 張圖，不跟首圖搶頻寬 */
  const [live, setLive] = useState(false)
  const [armed, setArmed] = useState(false)
  const bandRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  /* 隊伍要複製幾份才鋪得滿：窄螢幕兩份就夠，寬螢幕得多幾份，否則走到一半右邊會空掉 */
  const [copies, setCopies] = useState(2)

  /* 位移距離＝兩份隊伍的起點間距；速度跟著走路循環算，腳才不會在地上打滑 */
  useEffect(() => {
    const band = bandRef.current
    const track = trackRef.current
    if (!band || !track) return

    const measure = () => {
      const groups = track.children
      if (groups.length < 2) return
      const advance = groups[1].getBoundingClientRect().left - groups[0].getBoundingClientRect().left
      const gap = advance - groups[0].getBoundingClientRect().width
      if (advance > 0) {
        /* 多算 64px 安全邊際，免得次像素進位讓右緣剛好差一點點 */
        const need = Math.max(2, Math.ceil(1 + (band.clientWidth + gap + 64) / advance))
        setCopies((prev) => (prev === need ? prev : need))
      }
      const ref = track.querySelector<HTMLElement>('.walker')
      const unit = ref ? ref.getBoundingClientRect().height / WALKERS[0].h : 0
      const cycle = parseFloat(getComputedStyle(band).getPropertyValue('--walk-cycle')) || 0.8
      const speed = (ADVANCE_PER_CYCLE * REF_HEIGHT * unit) / cycle
      if (!advance || !speed) return
      /* 把整趟時間湊成走路循環的整數倍，兩個動畫才會同週期；速度只差不到一個循環，看不出來 */
      const cycles = Math.max(1, Math.round(advance / speed / cycle))
      band.style.setProperty('--advance', `${advance}px`)
      band.style.setProperty('--duration', `${cycles * cycle}s`)
    }

    measure()
    /* 兩個都要看：橫帶寬度隨視窗變（份數要重算），隊伍寬度隨份數與斷點變（距離要重算） */
    const ro = new ResizeObserver(measure)
    ro.observe(band)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  /* 用 state 而不是直接寫 attribute：React 一重繪就會把手寫的 attribute 蓋掉 */
  useEffect(() => {
    const band = bandRef.current
    if (!band) return
    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true)
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          setLive(entry.isIntersecting)
          /* 訪客比首圖還快捲到這裡的話，就直接載 */
          if (entry.isIntersecting) setArmed(true)
        }),
      /* 橫帶上緣正好貼齊視窗下緣時，瀏覽器會判定為「相交」；把邊界內縮 1px 才算真的看見 */
      { rootMargin: '0px 0px -1px 0px' },
    )
    io.observe(band)
    return () => io.disconnect()
  }, [])

  /* 平常則等首圖載完、頁面閒下來再抓那 15 張圖，不跟 LCP 搶頻寬 */
  useEffect(() => {
    if (armed) return
    const arm = () => setArmed(true)
    if (document.readyState === 'complete') {
      const id = window.setTimeout(arm, 0)
      return () => window.clearTimeout(id)
    }
    window.addEventListener('load', arm, { once: true })
    return () => window.removeEventListener('load', arm)
  }, [armed])

  return (
    <div className="procession" ref={bandRef} data-live={live} data-paused={paused}>
      {/* role="img" 只掛在畫面本身；暫停鈕留在外層，否則會被當成圖的一部分而讀不到 */}
      <div
        className="proc-viewport"
        role="img"
        aria-label={t.procession.alt}
        style={{ '--tallest': TALLEST } as React.CSSProperties}
      >
        <div className="proc-track" ref={trackRef}>
          {armed &&
            Array.from({ length: copies }, (_, i) => (
              <Group key={i} />
            ))}
        </div>
      </div>

      {/* 動畫會一直跑，照 WCAG 2.2.2 要給訪客一個停下來的方法 */}
      <button
        type="button"
        className="proc-pause"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t.procession.play : t.procession.pause}
      >
        <svg viewBox="0 0 10 10" aria-hidden focusable="false">
          {paused ? <path d="M1 0.5 L9 5 L1 9.5 Z" /> : <path d="M1 0.5h3v9H1zM6 0.5h3v9H6z" />}
        </svg>
      </button>
    </div>
  )
}
