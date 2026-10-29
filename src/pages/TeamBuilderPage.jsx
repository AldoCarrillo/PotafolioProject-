import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import TeamBuilder from '../features/team-builder/TeamBuilder.jsx'

function TeamBuilderPage() {
  useEffect(() => {
    document.title = 'Team Builder | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">TEAM MANAGEMENT</p>
        <h1>Team<br /><em>Builder.</em></h1>
        <p className="tool-page-intro">Create a clear team roster, add role-specific details, and download a polished team page to share.</p>
        <TeamBuilder />
      </section>
      <SiteFooter />
    </main>
  )
}

export default TeamBuilderPage
