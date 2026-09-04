/**
 * 神田明神婚禮 RSVP 後端（Google Apps Script，綁在回覆試算表上）
 * 部署為網頁應用程式：執行身分「我」、存取權「所有人」。
 * GET  ?action=check&payload=[{name,relation}]  → { duplicates: [...] }
 * GET  ?action=list                              → { attendees: [{name(遮名), relation}] }
 * POST { email, lang, diet, message, people:[{name,relation,ceremony,reception,diet}] }（披露宴＝yes 時 diet 必填）
 *      → { ok:true, saved:n } 或 { ok:false, duplicates:[...] } 或 { ok:false, error }
 * 同一個人的定義：姓名＋關係都相同（2026-09-04 新人裁定）。
 */
const SHEET_NAME = 'RSVP'
const HEADERS = ['送出時間', '填表人 Email', '姓名', '關係', '神前式 11:00', '披露宴 12:30', '飲食禁忌與過敏', '留言', '語言', '群組', '關係代碼', '飲食']
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

function sheet_() {
  const ss = SpreadsheetApp.getActive()
  let sh = ss.getSheetByName(SHEET_NAME)
  if (!sh) sh = ss.insertSheet(SHEET_NAME)
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS)
    sh.setFrozenRows(1)
  } else if (sh.getLastColumn() < HEADERS.length) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
  }
  return sh
}

// 與前端 personKey 完全相同：全形轉半形、去所有空白、小寫
function key_(name, relation) {
  return String(name || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase() + '|' + relation
}

function existingKeys_() {
  const sh = sheet_()
  const n = sh.getLastRow()
  const keys = new Set()
  if (n < 2) return keys
  const rows = sh.getRange(2, 1, n - 1, HEADERS.length).getValues()
  rows.forEach((r) => keys.add(key_(r[2], r[10])))
  return keys
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

// 神前式或披露宴至少一個「是」才算出席
function attendees_() {
  const sh = sheet_()
  const n = sh.getLastRow()
  if (n < 2) return []
  return sh
    .getRange(2, 1, n - 1, HEADERS.length)
    .getValues()
    .filter((r) => r[4] === '是' || r[5] === '是')
    .map((r) => ({ name: mask_(r[2]), relation: r[10] }))
}

function doGet(e) {
  if (e.parameter.action === 'list') return json_({ attendees: attendees_() })
  if (e.parameter.action === 'check') {
    const list = JSON.parse(e.parameter.payload || '[]')
    const keys = existingKeys_()
    return json_({ duplicates: list.filter((p) => keys.has(key_(p.name, p.relation))) })
  }
  return json_({ ok: true, service: 'kanda-rsvp' })
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents)
  const people = Array.isArray(body.people) ? body.people : []
  const yesNo = (v) => v === 'yes' || v === 'no'
  const valid =
    people.length > 0 &&
    people.every(
      (p) =>
        p.name && String(p.name).trim() && RELATION_LABEL[p.relation] && yesNo(p.ceremony) && yesNo(p.reception) &&
        (p.reception !== 'yes' || DIET_LABEL[p.diet]),
    ) &&
    /^\S+@\S+\.\S+$/.test(body.email || '')
  if (!valid) return json_({ ok: false, error: 'invalid' })

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const keys = existingKeys_()
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
      now,
      body.email,
      String(p.name).trim(),
      RELATION_LABEL[p.relation],
      p.ceremony === 'yes' ? '是' : '否',
      p.reception === 'yes' ? '是' : '否',
      body.diet || '',
      body.message || '',
      body.lang || '',
      group,
      p.relation,
      p.reception === 'yes' ? DIET_LABEL[p.diet] : '',
    ])
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows)
    return json_({ ok: true, saved: rows.length })
  } finally {
    lock.releaseLock()
  }
}
