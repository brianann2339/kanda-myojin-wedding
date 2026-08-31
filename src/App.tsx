import { useEffect } from 'react'
import { Access } from './components/Access'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Flights } from './components/Flights'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Invitation } from './components/Invitation'
import { Stay } from './components/Stay'
import { Timeline } from './components/Timeline'
import { TopBar } from './components/TopBar'
import { Venue } from './components/Venue'
import { LangProvider } from './i18n'

export default function App() {
  // 區塊進入視窗時淡入；使用者偏好減少動態時不啟用
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sections = document.querySelectorAll('.section')
    sections.forEach((el) => el.classList.add('will-reveal'))
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <LangProvider>
      <TopBar />
      <Hero />
      <main className="page">
        <Invitation />
        <Timeline />
        <Venue />
        <Access />
        <Flights />
        <Stay />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  )
}
