import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import ReadmeGenerator from '../features/readme-generator/ReadmeGenerator.jsx'

function ReadmeGeneratorPage() {
  useEffect(() => {
    document.title = 'README Generator | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">DEVELOPER TOOL</p>
        <h1>README<br /><em>Generator.</em></h1>
        <p className="tool-page-intro">Create a polished project README by filling in a few details, then copy or download the Markdown.</p>
        <ReadmeGenerator />
      </section>
      <SiteFooter />
    </main>
  )
}

export default ReadmeGeneratorPage
