const shu = { color: 'var(--shu)' }
const gold = { color: 'var(--gold)' }
const ink = { color: 'var(--ink)' }

export function Torii({ size = 76, tone = 'shu' }: { size?: number; tone?: 'shu' | 'gold' }) {
  return (
    <svg
      width={size}
      height={(size / 76) * 54}
      viewBox="0 0 76 54"
      fill="none"
      style={tone === 'gold' ? gold : shu}
      aria-hidden="true"
    >
      <path d="M5 11 C 26 4, 50 4, 71 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 20 L 66 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 12 L 20.5 52 M 58 12 L 55.5 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 11 L 38 20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Mizuhiki() {
  return (
    <svg width="96" height="44" viewBox="0 0 96 44" fill="none" aria-hidden="true">
      <path d="M8 22 C 24 2, 40 2, 48 18 C 56 2, 72 2, 88 22" stroke="var(--gold)" strokeWidth="1.6" />
      <path d="M8 26 C 24 42, 40 42, 48 30 C 56 42, 72 42, 88 26" stroke="var(--shu)" strokeWidth="1.6" />
      <path d="M2 24 L 12 24 M 84 24 L 94 24" stroke="var(--gold)" strokeWidth="1.2" />
    </svg>
  )
}




export function TrainJR() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={ink} aria-hidden="true">
      <rect x="4" y="2.5" width="12" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M4 9 L 16 9" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7.4" cy="12.2" r="1" fill="currentColor" />
      <circle cx="12.6" cy="12.2" r="1" fill="currentColor" />
      <path d="M6.5 17.5 L 5 19 M 13.5 17.5 L 15 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TrainMetro() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={ink} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M6.4 13 L 6.4 7 L 10 11 L 13.6 7 L 13.6 13" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

export function Pin() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <path
        d="M7 1 C 3.7 1, 1 3.7, 1 7 C 1 11.4, 7 15, 7 15 C 7 15, 13 11.4, 13 7 C 13 3.7, 10.3 1, 7 1 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
      />
      <circle cx="7" cy="6.8" r="2.1" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

export function RouteArrow() {
  return (
    <svg width="30" height="14" viewBox="0 0 30 14" fill="none" style={gold} aria-hidden="true">
      <path d="M1 7 L24 7 M24 7 L18.5 2 M24 7 L18.5 12" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="28" cy="7" r="1.6" fill="currentColor" />
    </svg>
  )
}

export function Chevron({ className }: { className?: string }) {
  return (
    <svg width="12" height="7" viewBox="0 0 14 8" fill="none" className={className} style={gold} aria-hidden="true">
      <path d="M1 1 L7 7 L13 1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/** 外套：戶外流程的保暖提醒 */
export function Jacket() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={gold} aria-hidden="true">
      <path d="M6.4 2.4 L 9 4.6 L 11.6 2.4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path
        d="M6.4 2.4 L 3 4.2 L 2.2 9 L 4.2 9.4 L 4.2 15.6 L 13.8 15.6 L 13.8 9.4 L 15.8 9 L 15 4.2 L 11.6 2.4"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M9 4.8 L 9 15.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function Crowd() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={gold} aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="12.5" cy="7.5" r="2.4" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path
        d="M2 15.5 C 2.6 12.4, 4.2 10.8, 6 10.8 C 7.8 10.8, 9 12, 9.6 14 M 9.4 15.5 C 9.9 13, 11 11.9, 12.5 11.9 C 14.3 11.9, 15.6 13.2, 16 15.5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

