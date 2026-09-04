import { useEffect, useState } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'

type Entry = { name: string; relation: string }
type Side = 'groom' | 'bride'

/** 先親人後朋友，再依姓氏（遮名後仍以姓開頭）以繁中排序 */
function order(a: Entry, b: Entry) {
  const rank = (e: Entry) => (e.relation.endsWith('family') ? 0 : 1)
  return rank(a) - rank(b) || a.name.localeCompare(b.name, 'zh-Hant')
}

export function Attendees() {
  const { t } = useLang()
  const a = t.contact.attendees
  const f = t.contact.form
  const endpoint = wedding.rsvp.endpoint
  const [list, setList] = useState<Entry[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!endpoint) return
    fetch(`${endpoint}?action=list`)
      .then((r) => r.json())
      .then((d: { attendees?: Entry[] }) => setList(d.attendees ?? []))
      .catch(() => setFailed(true))
  }, [endpoint])

  if (!endpoint) return null

  const side = (s: Side) => (list ?? []).filter((e) => e.relation.startsWith(s)).sort(order)

  return (
    <div className="card stack" style={{ marginTop: 12 }}>
      <div className="group-title">{a.title}</div>
      <div className="fact-sub">{a.intro}</div>

      {failed ? (
        <div className="small-note">{a.failed}</div>
      ) : list === null ? (
        <div className="small-note">{a.loading}</div>
      ) : (
        <div className="attendee-cols">
          {(['groom', 'bride'] as const).map((s) => {
            const rows = side(s)
            return (
              <div className="attendee-col" key={s}>
                <div className="attendee-head">{a[s]}</div>
                {rows.length === 0 ? (
                  <div className="small-note">{a.empty}</div>
                ) : (
                  <table className="attendee-table">
                    <thead>
                      <tr>
                        <th>{f.colName}</th>
                        <th>{f.colRelation}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((e, i) => (
                        <tr key={`${e.name}-${e.relation}-${i}`}>
                          <td>{e.name}</td>
                          <td>{f.relations[e.relation as keyof typeof f.relations] ?? e.relation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
