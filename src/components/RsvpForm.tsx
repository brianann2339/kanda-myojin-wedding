import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { BirthdaySelect, DIETS, RELATIONS, personKey, validBirthday } from './rsvpShared'
import type { Diet, Relation, YesNo } from './rsvpShared'

type Person = {
  id: number
  name: string
  relation: Relation | ''
  bm: string
  bd: string
  ceremony: YesNo | ''
  reception: YesNo | ''
  diet: Diet | ''
}
type Field = 'name' | 'relation' | 'birthday' | 'ceremony' | 'reception' | 'diet'
type Status = 'idle' | 'sending' | 'done' | 'duplicate' | 'error'

const blank = (id: number): Person => ({ id, name: '', relation: '', bm: '', bd: '', ceremony: '', reception: '', diet: '' })

/** 這一位還缺哪幾格（依畫面由上而下的順序）；飲食只有參加披露宴才要填 */
const problems = (p: Person): Field[] => {
  const out: Field[] = []
  if (p.name.trim() === '') out.push('name')
  if (p.relation === '') out.push('relation')
  if (!validBirthday(p.bm, p.bd)) out.push('birthday')
  if (p.ceremony === '') out.push('ceremony')
  if (p.reception === '') out.push('reception')
  if (p.reception === 'yes' && p.diet === '') out.push('diet')
  return out
}

export function RsvpForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { t, lang } = useLang()
  const f = t.contact.form
  const endpoint = wedding.rsvp.endpoint
  const nextId = useRef(1)
  const formRef = useRef<HTMLFormElement>(null)
  const [people, setPeople] = useState<Person[]>([blank(0)])
  const [dupes, setDupes] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<Status>('idle')
  /* 按過送出的那幾位才標紅框；之後才按「新增一位」的空白卡片不會一出現就整片紅 */
  const [flagged, setFlagged] = useState<Set<number>>(new Set())

  const update = (id: number, patch: Partial<Person>) =>
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  const markDupes = (list: { name: string; relation: string }[], on: boolean, keep = true) =>
    setDupes((prev) => {
      const next = keep ? new Set(prev) : new Set<string>()
      list.forEach((p) => (on ? next.add(personKey(p.name, p.relation)) : next.delete(personKey(p.name, p.relation))))
      return next
    })

  async function check(p: Person) {
    if (!endpoint || !p.name.trim() || !p.relation) return
    const payload = encodeURIComponent(JSON.stringify([{ name: p.name, relation: p.relation }]))
    try {
      const res = await fetch(`${endpoint}?action=check&payload=${payload}`)
      const data: { duplicates?: { name: string; relation: string }[] } = await res.json()
      markDupes([{ name: p.name, relation: p.relation }], (data.duplicates?.length ?? 0) > 0)
    } catch {
      // 即時查重只是提示；送出時後端一定會再查一次
    }
  }

  /* 移除一位時，重複標記要跟著更新：原本兩張卡同名同關係被後端擋下，刪掉一張後另一張不該一直被卡住 */
  function remove(id: number) {
    const gone = people.find((q) => q.id === id)
    setPeople((ps) => ps.filter((q) => q.id !== id))
    if (!gone || !gone.relation) return
    const twin = people.find((q) => q.id !== id && personKey(q.name, q.relation) === personKey(gone.name, gone.relation))
    if (twin) check(twin)
    else markDupes([gone], false)
  }

  /* 捲到第一個沒填的格子並停在那裡：紅框若在畫面外，長輩只會看到送出鈕沒反應 */
  function focusFirst(id: number, field: Field) {
    const cell = formRef.current?.querySelector<HTMLElement>(`[data-pid="${id}"][data-field="${field}"]`)
    if (!cell) return
    const controls = [...cell.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')]
    const target = controls.find((c) => c.value === '') ?? controls[0]
    cell.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target?.focus({ preventScroll: true })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!endpoint) return
    const firstBad = people.find((p) => problems(p).length > 0)
    if (firstBad) {
      setFlagged(new Set(people.map((p) => p.id)))
      setStatus('idle')
      focusFirst(firstBad.id, problems(firstBad)[0])
      return
    }
    if (people.some((p) => dupes.has(personKey(p.name, p.relation)))) {
      setStatus('duplicate')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          lang,
          people: people.map((p) => ({
            name: p.name,
            relation: p.relation,
            birthday: p.bm + p.bd,
            ceremony: p.ceremony,
            reception: p.reception,
            diet: p.reception === 'yes' ? p.diet : '',
          })),
        }),
      })
      const data: { ok?: boolean; duplicates?: { name: string; relation: string }[] } = await res.json()
      if (data.ok) {
        setStatus('done')
        onSubmitted?.()
      } else if (data.duplicates?.length) {
        markDupes(data.duplicates, true, false)
        setStatus('duplicate')
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (!endpoint) {
    return (
      <span className="tag tag-tbd" style={{ alignSelf: 'center' }}>
        {f.closed}
      </span>
    )
  }

  if (status === 'done') return <div className="rsvp-done">{f.done}</div>

  const birthdayLabels = { pick: f.pick, month: f.month, day: f.day }
  /* 送出鈕上方逐位列出還缺哪幾格；填好一格就即時少一項，全部填好就消失 */
  const lines = people.flatMap((p, i) => {
    if (!flagged.has(p.id)) return []
    const name = p.name.trim()
    const wrongDate = p.bm !== '' && p.bd !== '' && !validBirthday(p.bm, p.bd)
    const empty = problems(p).filter((k) => !(k === 'birthday' && wrongDate))
    return [
      ...(empty.length ? [f.missingSummary(i + 1, name, empty.map((k) => f.fieldNames[k]))] : []),
      ...(wrongDate ? [f.birthdayWrong(i + 1, name)] : []),
    ]
  })

  return (
    <form className="rsvp-form stack" onSubmit={submit} noValidate ref={formRef}>
      <div className="body-text">{f.intro}</div>

      <div className="rsvp-rows">
        {people.map((p, i) => {
          const dup = p.relation !== '' && dupes.has(personKey(p.name, p.relation))
          const bad = flagged.has(p.id) ? problems(p) : []
          const miss = (field: Field) => bad.includes(field)
          const errId = (field: Field) => `rsvp-${p.id}-${field}-missing`
          const cell = (field: Field, extra = '') => ({
            className: `rsvp-cell${extra}${miss(field) ? ' is-missing' : ''}`,
            'data-pid': p.id,
            'data-field': field,
          })
          const labelId = (field: Field) => `rsvp-${p.id}-${field}-label`
          /* 名稱只取題目文字：紅字雖然放在 <label> 裡，但要當「說明」念，不能併進欄位名稱 */
          const aria = (field: Field) => ({
            'aria-labelledby': labelId(field),
            ...(miss(field) ? { 'aria-invalid': true as const, 'aria-describedby': errId(field) } : {}),
          })
          const note = (field: Field, text: string = f.fieldMissing) =>
            miss(field) && (
              <span className="rsvp-missing" id={errId(field)}>
                {text}
              </span>
            )
          return (
            <div className="rsvp-row" key={p.id} data-dup={dup}>
              <span className="rsvp-idx">{i + 1}</span>
              <label {...cell('name')}>
                <span id={labelId('name')}>{f.colName}</span>
                <input
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                  onBlur={() => check(p)}
                  {...aria('name')}
                />
                {note('name')}
              </label>
              <label {...cell('relation')}>
                <span id={labelId('relation')}>{f.colRelation}</span>
                <select
                  value={p.relation}
                  onChange={(e) => update(p.id, { relation: e.target.value as Relation })}
                  onBlur={() => check(p)}
                  {...aria('relation')}
                >
                  <option value="">{f.pick}</option>
                  {RELATIONS.map((r) => (
                    <option key={r} value={r}>
                      {f.relations[r]}
                    </option>
                  ))}
                </select>
                {note('relation')}
              </label>
              <div {...cell('birthday')}>
                <span>{f.colBirthday}</span>
                <BirthdaySelect
                  month={p.bm}
                  day={p.bd}
                  labels={birthdayLabels}
                  onChange={(next) => update(p.id, { ...(next.month !== undefined ? { bm: next.month } : {}), ...(next.day !== undefined ? { bd: next.day } : {}) })}
                  invalid={miss('birthday')}
                  describedBy={errId('birthday')}
                />
                {/* 月、日都選了卻組不成日期（例如 4 月 31 日）時，說清楚是日期不存在，而不是沒填 */}
                {note('birthday', p.bm && p.bd ? f.errBirthday : f.fieldMissing)}
              </div>
              <label {...cell('ceremony')}>
                <span id={labelId('ceremony')}>{f.colCeremony}</span>
                <select value={p.ceremony} onChange={(e) => update(p.id, { ceremony: e.target.value as YesNo })} {...aria('ceremony')}>
                  <option value="">{f.pick}</option>
                  <option value="yes">{f.yes}</option>
                  <option value="no">{f.no}</option>
                </select>
                {note('ceremony')}
              </label>
              <label {...cell('reception')}>
                <span id={labelId('reception')}>{f.colReception}</span>
                <select value={p.reception} onChange={(e) => update(p.id, { reception: e.target.value as YesNo })} {...aria('reception')}>
                  <option value="">{f.pick}</option>
                  <option value="yes">{f.yes}</option>
                  <option value="no">{f.no}</option>
                </select>
                {note('reception')}
              </label>
              {p.reception === 'yes' && (
                <label {...cell('diet', ' rsvp-cell--diet')}>
                  <span id={labelId('diet')}>{f.colDiet}</span>
                  <select value={p.diet} onChange={(e) => update(p.id, { diet: e.target.value as Diet })} {...aria('diet')}>
                    <option value="">{f.pick}</option>
                    {DIETS.map((d) => (
                      <option key={d} value={d}>
                        {f.diets[d]}
                      </option>
                    ))}
                  </select>
                  {note('diet')}
                </label>
              )}
              {people.length > 1 && (
                <button
                  type="button"
                  className="rsvp-remove"
                  aria-label={f.removePerson}
                  onClick={() => remove(p.id)}
                >
                  ×
                </button>
              )}
              {dup && <div className="rsvp-dup">{f.duplicate}</div>}
            </div>
          )
        })}
      </div>

      <button type="button" className="btn-ghost" onClick={() => setPeople((ps) => [...ps, blank(nextId.current++)])}>
        {f.addPerson}
      </button>

      {/* 播報區先放著（空的），內容之後才填進去，螢幕閱讀器才會念出第一次的提示 */}
      <div className="rsvp-live" aria-live="polite">
        {lines.length > 0 && (
          <div className="rsvp-error">
            {lines.map((line) => (
              <div key={line} className="rsvp-error-line">
                {line}
              </div>
            ))}
            <div>{f.missingHint(f.submit)}</div>
          </div>
        )}
      </div>
      {status === 'duplicate' && <div className="rsvp-error">{f.errDuplicate}</div>}
      {status === 'error' && <div className="rsvp-error">{f.errNetwork}</div>}

      <button type="submit" className="btn" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  )
}
