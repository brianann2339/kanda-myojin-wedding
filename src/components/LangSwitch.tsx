import { dict, langs } from '../content/copy'
import { useLang } from '../i18n'

export function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="langs">
      {langs.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {dict[code].langName}
        </button>
      ))}
    </div>
  )
}
