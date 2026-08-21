import { Access } from './components/Access'
import { Ceremony } from './components/Ceremony'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Flights } from './components/Flights'
import { Footer } from './components/Footer'
import { Gift } from './components/Gift'
import { Hero } from './components/Hero'
import { Invitation } from './components/Invitation'
import { Stay } from './components/Stay'
import { Timeline } from './components/Timeline'
import { TopBar } from './components/TopBar'
import { Venue } from './components/Venue'
import { LangProvider } from './i18n'

export default function App() {
  return (
    <LangProvider>
      <TopBar />
      <Hero />
      <main className="page">
        <Invitation />
        <Ceremony />
        <Timeline />
        <Venue />
        <Access />
        <Flights />
        <Stay />
        <FAQ />
        <Gift />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  )
}
