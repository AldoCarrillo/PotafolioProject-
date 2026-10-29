import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import FitnessTracker from '../features/fitness-tracker/FitnessTracker.jsx'

function FitnessTrackerPage() {
  useEffect(() => {
    document.title = 'Fitness Tracker | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page fitness-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">FITNESS TRACKER</p>
        <h1>Fitness<br /><em>Tracker.</em></h1>
        <p className="tool-page-intro">Start a workout, add exercises, and keep a simple log of your sessions.</p>
        <FitnessTracker />
      </section>
      <SiteFooter />
    </main>
  )
}

export default FitnessTrackerPage
