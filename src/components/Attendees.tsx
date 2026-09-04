import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { wedding } from '../content/wedding'
import { useLang } from '../i18n'
import { Modal } from './Modal'
import { BirthdaySelect, DIETS, RELATIONS, validBirthday } from './rsvpShared'
import type { Diet, Relation, YesNo } from './rsvpShared'

type Entry = { id: string; name: string; relation: string; ceremony: YesNo; reception: YesNo; diet: string }
type Side = 'groom' | 'bride'
type Draft = { name: string; relation: Relation | ''; ceremony: YesNo | ''; reception: YesNo | ''; diet: Diet | '' }
type Edit = {
  entry: Entry
  step: 'verify' | 'edit' | 'done'
  bm: string
  bd: string
  busy: boolean
  error: 'wrong' | 'invalid' | 'duplicate' | 'network' | null
  draft: Draft
}

/** 先親人後朋友，再依姓氏（遮名後仍以姓開頭）以繁中排序 */
function order(a: Entry, b: Entry) {
  const rank = (e: Entry) => (e.relation.endsWith('family') ? 0 : 1)
  return rank(a) - rank(b) || a.name.localeCompare(b.name, 'zh-Hant')
}

export function Attendees({ refreshKey = 0 }: { refreshKey?: number }) {
  const { t } = useLang()
  const a = t.contact.attendees
  const f = t.contact.form
  const endpoint = wedding.rsvp.endpoint
  const [list, setList] = useState<Entry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [edit, setEdit] = useState<Edit | null>(null)

  const load = useCallback(() => {
    if (!endpoint) return
    fetch(`${endpoint}?action=list`)
      .then((r) => r.json())
      .then((d: { attendees?: Entry[] }) => setList(d.attendees ?? []))
      .catch(() => setFailed(true))
  }, [endpoint])

  useEffect(load, [load, refreshKey])

  if (!endpoint) return null

  const side = (s: Side) => (list ?? []).filter((e) => e.relation.startsWith(s)).sort(order)
  const yesNo = (v: YesNo) => (v === 'yes' ? f.yes : f.no)
  const dietLabel = (code: string) => (code in f.diets ? f.diets[code as Diet] : code)

  const openEdit = (entry: Entry) =>
    setEdit({ entry, step: 'verify', bm: '', bd: '', busy: false, error: null, draft: { name: '', relation: '', ceremony: '', reception: '', diet: '' } })

  async function verify(e: FormEvent) {
    e.preventDefault()
    if (!endpoint || !edit || !validBirthday(edit.bm, edit.bd)) return
    setEdit({ ...edit, busy: true, error: null })
    try {
      const res = await fetch(`${endpoint}?action=verify&id=${encodeURIComponent(edit.entry.id)}&birthday=${edit.bm}${edit.bd}`)
      const d: { ok?: boolean; person?: Draft } = await res.json()
      if (d.ok && d.person) setEdit({ ...edit, busy: false, step: 'edit', draft: { ...d.person, diet: d.person.reception === 'yes' ? d.person.diet : '' } })
      else setEdit({ ...edit, busy: false, error: 'wrong' })
    } catch {
      setEdit({ ...edit, busy: false, error: 'network' })
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!endpoint || !edit) return
    const p = edit.draft
    const ok =
      p.name.trim() !== '' && p.relation !== '' && p.ceremony !== '' && p.reception !== '' && (p.reception !== 'yes' || p.diet !== '')
    if (!ok) {
      setEdit({ ...edit, error: 'invalid' })
      return
    }
    setEdit({ ...edit, busy: true, error: null })
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'update',
          id: edit.entry.id,
          birthday: edit.bm + edit.bd,
          person: { ...p, diet: p.reception === 'yes' ? p.diet : '' },
        }),
      })
      const d: { ok?: boolean; error?: string; duplicates?: unknown[] } = await res.json()
      if (d.ok) {
        setEdit({ ...edit, busy: false, step: 'done' })
        load()
      } else setEdit({ ...edit, busy: false, error: d.duplicates?.length ? 'duplicate' : d.error === 'mismatch' ? 'wrong' : 'network' })
    } catch {
      setEdit({ ...edit, busy: false, error: 'network' })
    }
  }

  const setDraft = (patch: Partial<Draft>) => edit && setEdit({ ...edit, draft: { ...edit.draft, ...patch } })
  const birthdayLabels = { pick: f.pick, month: f.month, day: f.day }

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
                  <div className="attendee-table-wrap">
                    <table className="attendee-table">
                      <thead>
                        <tr>
                          <th aria-label={a.edit} />
                          <th>{f.colName}</th>
                          <th>{f.colRelation}</th>
                          <th>{a.colCeremony}</th>
                          <th>{a.colReception}</th>
                          <th>{f.colDiet}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((e) => (
                          <tr key={e.id}>
                            <td>
                              <button type="button" className="attendee-edit" onClick={() => openEdit(e)}>
                                {a.edit}
                              </button>
                            </td>
                            <td>{e.name}</td>
                            <td>{f.relations[e.relation as Relation] ?? e.relation}</td>
                            <td>{yesNo(e.ceremony)}</td>
                            <td>{yesNo(e.reception)}</td>
                            <td>{e.reception === 'yes' ? dietLabel(e.diet) : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={edit !== null} onClose={() => setEdit(null)} title={a.editTitle} closeLabel={a.close}>
        {edit && edit.step === 'verify' && (
          <form className="stack" onSubmit={verify} noValidate>
            <p className="body-text">
              {edit.entry.name}・{f.relations[edit.entry.relation as Relation] ?? edit.entry.relation}
            </p>
            <p className="fact-sub">{a.editHint}</p>
            <div className="rsvp-cell">
              <span>{f.colBirthday}</span>
              <BirthdaySelect
                month={edit.bm}
                day={edit.bd}
                labels={birthdayLabels}
                onChange={(next) => setEdit({ ...edit, ...(next.month !== undefined ? { bm: next.month } : {}), ...(next.day !== undefined ? { bd: next.day } : {}) })}
              />
            </div>
            {edit.error === 'wrong' && <div className="rsvp-error">{a.wrong}</div>}
            {edit.error === 'network' && <div className="rsvp-error">{f.errNetwork}</div>}
            <button type="submit" className="btn" disabled={edit.busy || !validBirthday(edit.bm, edit.bd)}>
              {edit.busy ? a.verifying : a.verify}
            </button>
          </form>
        )}

        {edit && edit.step === 'edit' && (
          <form className="stack" onSubmit={save} noValidate>
            <label className="rsvp-cell">
              <span>{f.colName}</span>
              <input value={edit.draft.name} onChange={(e) => setDraft({ name: e.target.value })} />
            </label>
            <label className="rsvp-cell">
              <span>{f.colRelation}</span>
              <select value={edit.draft.relation} onChange={(e) => setDraft({ relation: e.target.value as Relation })}>
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
              <select value={edit.draft.ceremony} onChange={(e) => setDraft({ ceremony: e.target.value as YesNo })}>
                <option value="">{f.pick}</option>
                <option value="yes">{f.yes}</option>
                <option value="no">{f.no}</option>
              </select>
            </label>
            <label className="rsvp-cell">
              <span>{f.colReception}</span>
              <select value={edit.draft.reception} onChange={(e) => setDraft({ reception: e.target.value as YesNo })}>
                <option value="">{f.pick}</option>
                <option value="yes">{f.yes}</option>
                <option value="no">{f.no}</option>
              </select>
            </label>
            {edit.draft.reception === 'yes' && (
              <label className="rsvp-cell">
                <span>{f.colDiet}</span>
                <select value={edit.draft.diet} onChange={(e) => setDraft({ diet: e.target.value as Diet })}>
                  <option value="">{f.pick}</option>
                  {DIETS.map((d) => (
                    <option key={d} value={d}>
                      {f.diets[d]}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {edit.error === 'invalid' && <div className="rsvp-error">{f.errRequired}</div>}
            {edit.error === 'duplicate' && <div className="rsvp-error">{f.duplicate}</div>}
            {edit.error === 'wrong' && <div className="rsvp-error">{a.wrong}</div>}
            {edit.error === 'network' && <div className="rsvp-error">{f.errNetwork}</div>}
            <button type="submit" className="btn" disabled={edit.busy}>
              {edit.busy ? a.saving : a.save}
            </button>
          </form>
        )}

        {edit && edit.step === 'done' && <div className="rsvp-done">{a.saved}</div>}
      </Modal>
    </div>
  )
}
