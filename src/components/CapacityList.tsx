import { wedding } from '../content/wedding'
import { useLang } from '../i18n'

export type CapacityRow = { label: string; count: number; sub?: boolean }

/** 人數一覽：總數在上，分區（sub）縮排在下；inline 版給披露宴視窗那種窄欄用 */
export function CapacityList({ rows, inline = false }: { rows: CapacityRow[]; inline?: boolean }) {
  const { t } = useLang()
  return (
    <dl className={inline ? 'capacity capacity--inline' : 'capacity'}>
      {rows.map((row) => (
        <div className={row.sub ? 'capacity-row capacity-row--sub' : 'capacity-row'} key={row.label}>
          <dt>{row.label}</dt>
          <dd>{t.ceremony.people(row.count)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** 社殿的三列：總數＋上排＋下排，神社區塊與神前式視窗共用 */
export function useShrineCapacityRows(): CapacityRow[] {
  const { t } = useLang()
  const { total, upper, lower } = wedding.ceremonySeats
  return [
    { label: t.ceremony.capacityLimit, count: total },
    { label: t.ceremony.upperSeats, count: upper, sub: true },
    { label: t.ceremony.lowerSeats, count: lower, sub: true },
  ]
}
