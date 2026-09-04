/**
 * 神田明神婚禮 RSVP 後端（Google Apps Script，綁在回覆試算表上）
 * 部署為網頁應用程式：執行身分「我」、存取權「所有人」。改完程式要「管理部署作業 → 新版本」才生效。
 * GET  ?action=list                                   → { attendees: [{id, name(遮名), relation, ceremony, reception, diet}] }（所有回覆）
 * GET  ?action=check&payload=[{name,relation}]        → { duplicates: [...] }
 * GET  ?action=verify&id=&birthday=MMDD               → { ok, person:{name,relation,birthday,ceremony,reception,diet} }
 * POST { lang, people:[{name,relation,birthday,ceremony,reception,diet}] }        → 新增（披露宴＝yes 時 diet 必填）
 * POST { action:'update', id, birthday, person:{name,relation,ceremony,reception,diet} } → 生日相符才更新
 * 同一個人的定義：姓名＋關係都相同（2026-09-04 新人裁定）。生日只用來驗證身分，不可修改。
 */
const SHEET_NAME = 'RSVP'
const HEADERS = ['ID', '送出時間', '姓名', '關係', '生日', '神前式 11:00', '披露宴 12:30', '飲食', '語言', '群組', '關係代碼', '飲食代碼', '更新時間']
const C = { id: 0, submitted: 1, name: 2, relation: 3, birthday: 4, ceremony: 5, reception: 6, diet: 7, lang: 8, group: 9, relCode: 10, dietCode: 11, updated: 12 }
const RELATION_LABEL = {
  'groom-family': '新郎親人',
  'groom-friend': '新郎朋友',
  'bride-family': '新娘親人',
  'bride-friend': '新娘朋友',
}
const DIET_LABEL = {
  'no-meal': '嬰兒或不食用餐點',
  omnivore: '無忌口',
  vegan: '全素',
  ovo: '蛋素',
  lacto: '奶素',
  'lacto-ovo': '蛋奶素',
  flexi: '鍋邊素',
}

// 2026-09-05 第 3 版換了欄位配置；只在表內還沒有資料時才會重寫標題列
function sheet_() {
  const ss = SpreadsheetApp.getActive()
  let sh = ss.getSheetByName(SHEET_NAME)
  if (!sh) sh = ss.insertSheet(SHEET_NAME)
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS)
    sh.setFrozenRows(1)
  } else if (sh.getLastRow() === 1) {
    sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), HEADERS.length)).clearContent()
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
  }
  return sh
}

function rows_() {
  const sh = sheet_()
  const n = sh.getLastRow()
  if (n < 2) return []
  return sh.getRange(2, 1, n - 1, HEADERS.length).getValues()
}

// 與前端 personKey 完全相同：全形轉半形、去所有空白、小寫
function key_(name, relation) {
  return String(name || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase() + '|' + relation
}

const yesNo_ = (v) => v === 'yes' || v === 'no'
const birthdayOk_ = (b) => /^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(String(b || ''))
const norm4_ = (v) => String(v || '').replace(/^'/, '').padStart(4, '0')

function validPerson_(p, needBirthday) {
  return Boolean(
    p && p.name && String(p.name).trim() && RELATION_LABEL[p.relation] && yesNo_(p.ceremony) && yesNo_(p.reception) &&
      (p.reception !== 'yes' || DIET_LABEL[p.diet]) && (!needBirthday || birthdayOk_(p.birthday)),
  )
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

// 公開名單只給遮過的名字：中日文留頭尾字、中間 O；拉丁字母只留各字首
function mask_(name) {
  const s = String(name || '').trim()
  if (/^[\x20-\x7e]+$/.test(s)) {
    return s.split(/\s+/).map((w) => w[0].toUpperCase() + '.').join(' ')
  }
  const chars = Array.from(s.replace(/\s+/g, ''))
  if (chars.length <= 1) return chars.join('')
  if (chars.length === 2) return chars[0] + 'O'
  return chars[0] + 'O'.repeat(chars.length - 2) + chars[chars.length - 1]
}

function entry_(r) {
  const reception = r[C.reception] === '是' ? 'yes' : 'no'
  return { id: String(r[C.id]), name: mask_(r[C.name]), relation: r[C.relCode], ceremony: r[C.ceremony] === '是' ? 'yes' : 'no', reception, diet: reception === 'yes' ? r[C.dietCode] : '' }
}

function doGet(e) {
  const action = e.parameter.action
  if (action === 'list') return json_({ attendees: rows_().map(entry_) })
  if (action === 'check') {
    const list = JSON.parse(e.parameter.payload || '[]')
    const keys = new Set(rows_().map((r) => key_(r[C.name], r[C.relCode])))
    return json_({ duplicates: list.filter((p) => keys.has(key_(p.name, p.relation))) })
  }
  if (action === 'verify') {
    const r = rows_().find((row) => String(row[C.id]) === String(e.parameter.id))
    if (!r || norm4_(r[C.birthday]) !== norm4_(e.parameter.birthday)) return json_({ ok: false, error: 'mismatch' })
    const reception = r[C.reception] === '是' ? 'yes' : 'no'
    return json_({ ok: true, person: { name: r[C.name], relation: r[C.relCode], birthday: norm4_(r[C.birthday]), ceremony: r[C.ceremony] === '是' ? 'yes' : 'no', reception, diet: reception === 'yes' ? r[C.dietCode] : '' } })
  }
  return json_({ ok: true, service: 'kanda-rsvp', version: 3 })
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents)
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    return body.action === 'update' ? update_(body) : submit_(body)
  } finally {
    lock.releaseLock()
  }
}

function submit_(body) {
  const people = Array.isArray(body.people) ? body.people : []
  if (!people.length || !people.every((p) => validPerson_(p, true))) return json_({ ok: false, error: 'invalid' })
  const keys = new Set(rows_().map((r) => key_(r[C.name], r[C.relCode])))
  const seen = new Set()
  const duplicates = people.filter((p) => {
    const k = key_(p.name, p.relation)
    const dup = keys.has(k) || seen.has(k)
    seen.add(k)
    return dup
  })
  if (duplicates.length) return json_({ ok: false, duplicates })
  const sh = sheet_()
  const now = new Date()
  const group = Utilities.formatDate(now, 'Asia/Taipei', 'yyyyMMdd-HHmmss')
  const rows = people.map((p) => [
    Utilities.getUuid().slice(0, 8),
    now,
    String(p.name).trim(),
    RELATION_LABEL[p.relation],
    "'" + p.birthday,
    p.ceremony === 'yes' ? '是' : '否',
    p.reception === 'yes' ? '是' : '否',
    p.reception === 'yes' ? DIET_LABEL[p.diet] : '',
    body.lang || '',
    group,
    p.relation,
    p.reception === 'yes' ? p.diet : '',
    '',
  ])
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows)
  return json_({ ok: true, saved: rows.length })
}

function update_(body) {
  const p = body.person
  if (!validPerson_(p, false)) return json_({ ok: false, error: 'invalid' })
  const rows = rows_()
  const idx = rows.findIndex((r) => String(r[C.id]) === String(body.id))
  if (idx < 0 || norm4_(rows[idx][C.birthday]) !== norm4_(body.birthday)) return json_({ ok: false, error: 'mismatch' })
  const k = key_(p.name, p.relation)
  const clash = rows.some((r, i) => i !== idx && key_(r[C.name], r[C.relCode]) === k)
  if (clash) return json_({ ok: false, duplicates: [{ name: p.name, relation: p.relation }] })
  const sh = sheet_()
  const rowNo = idx + 2
  sh.getRange(rowNo, C.name + 1, 1, 2).setValues([[String(p.name).trim(), RELATION_LABEL[p.relation]]])
  sh.getRange(rowNo, C.ceremony + 1, 1, 3).setValues([[p.ceremony === 'yes' ? '是' : '否', p.reception === 'yes' ? '是' : '否', p.reception === 'yes' ? DIET_LABEL[p.diet] : '']])
  sh.getRange(rowNo, C.relCode + 1, 1, 3).setValues([[p.relation, p.reception === 'yes' ? p.diet : '', new Date()]])
  return json_({ ok: true })
}
