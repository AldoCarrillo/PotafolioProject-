import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import NoteTaker from '../features/note-taker/NoteTaker.jsx'

function NoteTakerPage() {
  useEffect(() => {
    document.title = 'Note Taker | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page note-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">INTERACTIVE TOOL</p>
        <h1>Note<br /><em>Taker.</em></h1>
        <p className="tool-page-intro">A calm space to capture ideas, keep them organized, and find them again when you need them.</p>
        <NoteTaker />
      </section>
      <SiteFooter />
    </main>
  )
}

export default NoteTakerPage
