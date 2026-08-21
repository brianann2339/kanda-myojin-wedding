export function SectionHead({ num, kicker, title }: { num: string; kicker: string; title: string }) {
  return (
    <div className="sec-head">
      <div className="sec-rule" />
      <div className="sec-num">{num}</div>
      <div className="sec-titles">
        <div className="sec-kicker">{kicker}</div>
        <h2>{title}</h2>
      </div>
    </div>
  )
}
