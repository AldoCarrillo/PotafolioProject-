import { useEffect } from 'react'
import PasswordGenerator from '../features/password-generator/PasswordGenerator.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

function PasswordGeneratorPage() {
  useEffect(() => {
    document.title = 'Password Generator | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">INTERACTIVE TOOL</p>
        <h1>Password<br /><em>Generator.</em></h1>
        <p className="tool-page-intro">Create a strong password. Choose a length, pick the character types you want, and generate a secure password instantly.</p>
        <div className="tool-page-card">
          <PasswordGenerator />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

export default PasswordGeneratorPage
