import { useState } from 'react'
import { wedding } from '../content/wedding'
import { useCoupleNames, useLang } from '../i18n'
import { Modal } from './Modal'
import { SectionHead } from './SectionHead'

/** 神前式與披露宴是當天的重點，時間軸上以實心點標示，且各自有細節彈窗 */
const KEY_STEPS = new Set([3, 5])
const DETAIL: Record<number, 'ceremony' | 'reception'> = { 3: 'ceremony', 5: 'reception' }

/** ICS 的文字欄位要跳脫反斜線、分號與逗號 */
function icsEscape(v: string) {
  return v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
}

/**
 * 產生「加入行事曆」的 .ics 內容。
 * 報到 10:00 JST = 01:00Z、散會 15:00 JST = 06:00Z（2026-09-04 定案）。
 */
function calendarHref(summary: string, description: string, location: string) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//kanda-myojin-wedding//TW',
    'BEGIN:VEVENT',
    'UID:wedding-20270325@brianann2339.github.io',
    'DTSTAMP:20260831T000000Z',
    'DTSTART:20270325T010000Z',
    'DTEND:20270325T060000Z',
    `SUMMARY:${icsEscape(summary)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
}

export function Timeline() {
  const { t, l } = useLang()
  const names = useCoupleNames()
  const [detail, setDetail] = useState<null | 'ceremony' | 'reception'>(null)
  const items = t.timeline.items
  const reception = wedding.reception

  const ics = calendarHref(
    `${names.full}${t.timeline.icsTitleSuffix}`,
    t.timeline.icsDesc,
    `${l(wedding.venue.name)}（${l(wedding.venue.address)}）`,
  )

  return (
    <section className="section" id="timeline">
      <SectionHead num="貳" kicker={t.timeline.kicker} title={t.timeline.title} />

      <div className="card day-facts">
        <div className="stack-sm" style={{ gap: '0.25rem' }}>
          <div className="fact-main">
            {l(wedding.date.main)}（{l(wedding.date.estimate)}）
          </div>
          <div className="fact-sub">
            {l(wedding.venue.name)}　{l(wedding.venue.sub)}
          </div>
        </div>
        <a className="btn-ghost tl-ics" href={ics} download="kanda-myojin-wedding.ics">
          {t.timeline.calendarLabel}
        </a>
      </div>

      <div className="hint" style={{ margin: '20px 0' }}>
        <span aria-hidden />
        <p>{t.timeline.note}</p>
      </div>

      <div className="timeline">
        {items.map((item, i) => (
          <div className="tl-item" key={item.name} data-key={KEY_STEPS.has(i)}>
            <div className="tl-marker">
              <div className="tl-dot" />
              {i < items.length - 1 && <div className="tl-line" />}
            </div>
            <div className="tl-body">
              <div className="tl-time">{wedding.scheduleTimes[i] ?? '──：──'}</div>
              <div className="tl-name">{item.name}</div>
              <div className="tl-desc">{item.desc}</div>
              {DETAIL[i] && (
                <button type="button" className="tl-detail" onClick={() => setDetail(DETAIL[i])}>
                  {t.timeline.detailLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={detail === 'ceremony'}
        onClose={() => setDetail(null)}
        title={t.ceremony.title}
        closeLabel={t.timeline.close}
      >
        <p className="body-text">{t.ceremony.ritualNote}</p>
        <div className="group-title" style={{ fontSize: '0.75rem' }}>
          {t.ceremony.orderTitle}
        </div>
        <ol className="order">
          {t.ceremony.order.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="card stack-sm">
          <div className="fact-sub">{t.ceremony.capacity}</div>
        </div>
        <div className="small-note">{t.ceremony.ritualSource}</div>
      </Modal>

      <Modal
        open={detail === 'reception'}
        onClose={() => setDetail(null)}
        title={t.ceremony.receptionTitle}
        closeLabel={t.timeline.close}
      >
        <p className="body-text">{t.ceremony.receptionDesc}</p>

        <div className="reception-row">
          <span className="reception-label">{t.ceremony.receptionHallLabel}</span>
          <span className="reception-value">
            <span className="reception-hall">
              {l(reception.venueName)} · {l(reception.hall.name)}
            </span>
            <span className="fact-sub">{l(reception.hall.capacity)}</span>
            <span className="fact-sub">{l(reception.hall.feature)}</span>
            <span className="fact-sub">{l(reception.venueNote)}</span>
          </span>
        </div>

        <div className="reception-row">
          <span className="reception-label">{t.ceremony.receptionTimeLabel}</span>
          <span className="reception-value">
            <span className="fact-main-placeholder">{reception.startTime ?? '──：──'}</span>
          </span>
        </div>

        <div className="reception-row">
          <span className="reception-label">{t.ceremony.receptionCuisineLabel}</span>
          <span className="reception-value">
            <span className="fact-sub">{l(reception.cuisine)}</span>
          </span>
        </div>

        <a className="btn-ghost" href={reception.officialUrl} target="_blank" rel="noreferrer">
          {t.ceremony.receptionSiteButton} ↗
        </a>
        <div className="small-note">{l(reception.sourceNote)}</div>
      </Modal>
    </section>
  )
}
