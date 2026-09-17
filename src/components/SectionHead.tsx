export function SectionHead({ num, kicker, title, note }: { num: string; kicker: string; title: string; note?: string }) {
  return (
    <div className="sec-head">
      <div className="sec-rule" />
      <div className="sec-num">{num}</div>
      <div className="sec-titles">
        <div className="sec-kicker">{kicker}</div>
        <h2>
          {title}
          {note && <small className="sec-note">{note}</small>}
        </h2>
      </div>
    </div>
  )
}
