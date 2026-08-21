import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dict, langs } from './content/copy'
import { wedding, type Lang, type Localized } from './content/wedding'

const STORAGE_KEY = 'kanda-wedding-lang'
const HTML_LANG: Record<Lang, string> = { zh: 'zh-Hant', ja: 'ja', en: 'en' }

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && langs.includes(saved as Lang)) return saved as Lang
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('zh')) return 'zh'
  if (nav.startsWith('en')) return 'en'
  return 'zh'
}

type Ctx = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (typeof dict)[Lang]
  l: (value: Localized) => string
}

const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: dict[lang], l: (value: Localized) => value[lang] }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}

/** 中日文用間隔號連接姓名，英文用 & */
export function useCoupleNames() {
  const { l, lang } = useLang()
  const groom = l(wedding.couple.groom)
  const bride = l(wedding.couple.bride)
  const separator = lang === 'en' ? ' & ' : '・'
  return { groom, bride, separator, full: `${groom}${separator}${bride}` }
}
