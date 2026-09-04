export const RELATIONS = ['groom-family', 'groom-friend', 'bride-family', 'bride-friend'] as const
export const DIETS = ['no-meal', 'omnivore', 'vegan', 'ovo', 'lacto', 'lacto-ovo', 'flexi'] as const
export type Relation = (typeof RELATIONS)[number]
export type Diet = (typeof DIETS)[number]
export type YesNo = 'yes' | 'no'

export const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
export const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

/** 生日只到月／日，二月放寬到 29 */
export function validBirthday(mm: string, dd: string) {
  const m = Number(mm)
  const max = [4, 6, 9, 11].includes(m) ? 30 : m === 2 ? 29 : 31
  return mm !== '' && dd !== '' && Number(dd) <= max
}

/** 與後端 key_ 完全相同：全形轉半形、去所有空白、小寫；同一個人＝姓名＋關係相同 */
export function personKey(name: string, relation: string) {
  return `${name.normalize('NFKC').replace(/\s+/g, '').toLowerCase()}|${relation}`
}

export function BirthdaySelect({
  month,
  day,
  onChange,
  labels,
}: {
  month: string
  day: string
  onChange: (next: { month?: string; day?: string }) => void
  labels: { pick: string; month: string; day: string }
}) {
  return (
    <span className="rsvp-birthday">
      <select value={month} onChange={(e) => onChange({ month: e.target.value })}>
        <option value="">{labels.pick}</option>
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {Number(m)} {labels.month}
          </option>
        ))}
      </select>
      <select value={day} onChange={(e) => onChange({ day: e.target.value })}>
        <option value="">{labels.pick}</option>
        {DAYS.map((d) => (
          <option key={d} value={d}>
            {Number(d)} {labels.day}
          </option>
        ))}
      </select>
    </span>
  )
}
