import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'

const RELATIONS = ['groom-family', 'groom-friend', 'bride-family', 'bride-friend'] as const
const DIETS = ['no-meal', 'omnivore', 'vegan', 'ovo', 'lacto', 'lacto-ovo', 'flexi'] as const
type Relation = (typeof RELATIONS)[number]
type Diet = (typeof DIETS)[number]
type YesNo = 'yes' | 'no'
type Person = { id: number; name: string; relation: Relation | ''; ceremony: YesNo | ''; reception: YesNo | ''; diet: Diet | '' }
type Status = 'idle' | 'sending' | 'done' | 'invalid' | 'duplicate' | 'error'

/** 與後端 key_ 完全相同：全形轉半形、去所有空白、小寫；同一個人＝姓名＋關係相同 */
function personKey(name: string, relation: string) {
  return `${name.normalize('NFKC').replace(/\s+/g, '').toLowerCase()}|${relation}`
}

const complete = (p: Person) =>
  p.name.trim() !== '' && p.relation !== '' && p.ceremony !== '' && p.reception !== '' && (p.reception !== 'yes' || p.diet !== '')

export function RsvpForm() {
  const { t, lang } = useLang()
  const f = t.contact.form
  const endpoint = wedding.rsvp.endpoint
  const nextId = useRef(1)
  const [people, setPeople] = useState<Person[]>([{ id: 0, name: '', relation: '', ceremony: '', reception: '', diet: '' }])
  const [email, setEmail] = useState('')
  const [diet, setDiet] = useState('')
  const [message, setMessage] = useState('')
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
    if (!people.every(complete) || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('invalid')
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
          email,
          lang,
          diet,
          message,
          people: people.map(({ id: _id, ...p }) => ({ ...p, diet: p.reception === 'yes' ? p.diet : '' })),
        }),
      })
      const data: { ok?: boolean; duplicates?: { name: string; relation: string }[] } = await res.json()
      if (data.ok) setStatus('done')
      else if (data.duplicates?.length) {
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

      <button
        type="button"
        className="btn-ghost"
        onClick={() =>
          setPeople((ps) => [...ps, { id: nextId.current++, name: '', relation: '', ceremony: '', reception: '', diet: '' }])
        }
      >
        {f.addPerson}
      </button>

      <label className="rsvp-cell">
        <span>{f.email}</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <div className="small-note">{f.emailHint}</div>

      <label className="rsvp-cell">
        <span>{f.diet}</span>
        <textarea rows={2} value={diet} onChange={(e) => setDiet(e.target.value)} />
      </label>
      <label className="rsvp-cell">
        <span>{f.message}</span>
        <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>

      {status === 'invalid' && <div className="rsvp-error">{f.errRequired}</div>}
      {status === 'duplicate' && <div className="rsvp-error">{f.errDuplicate}</div>}
      {status === 'error' && <div className="rsvp-error">{f.errNetwork}</div>}

      <button type="submit" className="btn" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  )
}
