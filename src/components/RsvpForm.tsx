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
type Status = 'idle' | 'sending' | 'done' | 'invalid' | 'birthday' | 'duplicate' | 'error'

const blank = (id: number): Person => ({ id, name: '', relation: '', bm: '', bd: '', ceremony: '', reception: '', diet: '' })

const complete = (p: Person) =>
  p.name.trim() !== '' && p.relation !== '' && p.bm !== '' && p.bd !== '' && p.ceremony !== '' && p.reception !== '' &&
  (p.reception !== 'yes' || p.diet !== '')

export function RsvpForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { t, lang } = useLang()
  const f = t.contact.form
  const endpoint = wedding.rsvp.endpoint
  const nextId = useRef(1)
  const [people, setPeople] = useState<Person[]>([blank(0)])
  const [dupes, setDupes] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<Status>('idle')

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

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!endpoint) return
    if (!people.every(complete)) {
      setStatus('invalid')
      return
    }
    if (!people.every((p) => validBirthday(p.bm, p.bd))) {
      setStatus('birthday')
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

  return (
    <form className="rsvp-form stack" onSubmit={submit} noValidate>
      <div className="body-text">{f.intro}</div>

      <div className="rsvp-rows">
        {people.map((p, i) => {
          const dup = p.relation !== '' && dupes.has(personKey(p.name, p.relation))
          return (
            <div className="rsvp-row" key={p.id} data-dup={dup}>
              <span className="rsvp-idx">{i + 1}</span>
              <label className="rsvp-cell">
                <span>{f.colName}</span>
                <input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} onBlur={() => check(p)} />
              </label>
              <label className="rsvp-cell">
                <span>{f.colRelation}</span>
                <select
                  value={p.relation}
                  onChange={(e) => update(p.id, { relation: e.target.value as Relation })}
                  onBlur={() => check(p)}
                >
                  <option value="">{f.pick}</option>
                  {RELATIONS.map((r) => (
                    <option key={r} value={r}>
                      {f.relations[r]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rsvp-cell">
                <span>{f.colBirthday}</span>
                <BirthdaySelect
                  month={p.bm}
                  day={p.bd}
                  labels={birthdayLabels}
                  onChange={(next) => update(p.id, { ...(next.month !== undefined ? { bm: next.month } : {}), ...(next.day !== undefined ? { bd: next.day } : {}) })}
                />
              </div>
              <label className="rsvp-cell">
                <span>{f.colCeremony}</span>
                <select value={p.ceremony} onChange={(e) => update(p.id, { ceremony: e.target.value as YesNo })}>
                  <option value="">{f.pick}</option>
                  <option value="yes">{f.yes}</option>
                  <option value="no">{f.no}</option>
                </select>
              </label>
              <label className="rsvp-cell">
                <span>{f.colReception}</span>
                <select value={p.reception} onChange={(e) => update(p.id, { reception: e.target.value as YesNo })}>
                  <option value="">{f.pick}</option>
                  <option value="yes">{f.yes}</option>
                  <option value="no">{f.no}</option>
                </select>
              </label>
              {p.reception === 'yes' && (
                <label className="rsvp-cell rsvp-cell--diet">
                  <span>{f.colDiet}</span>
                  <select value={p.diet} onChange={(e) => update(p.id, { diet: e.target.value as Diet })}>
                    <option value="">{f.pick}</option>
                    {DIETS.map((d) => (
                      <option key={d} value={d}>
                        {f.diets[d]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {people.length > 1 && (
                <button
                  type="button"
                  className="rsvp-remove"
                  aria-label={f.removePerson}
                  onClick={() => setPeople((ps) => ps.filter((q) => q.id !== p.id))}
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

      {status === 'invalid' && <div className="rsvp-error">{f.errRequired}</div>}
      {status === 'birthday' && <div className="rsvp-error">{f.errBirthday}</div>}
      {status === 'duplicate' && <div className="rsvp-error">{f.errDuplicate}</div>}
      {status === 'error' && <div className="rsvp-error">{f.errNetwork}</div>}

      <button type="submit" className="btn" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  )
}
