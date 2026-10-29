import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import WorkDayScheduler from '../features/work-day-scheduler/WorkDayScheduler.jsx'

function WorkDaySchedulerPage() {
  useEffect(() => {
    document.title = 'Work Day Scheduler | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page scheduler-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">WORK DAY SCHEDULER</p>
        <h1>Plan your<br /><em>workday.</em></h1>
        <p className="tool-page-intro">Keep your day organized with a simple hourly schedule. Pick a date and save a task for each hour.</p>
        <WorkDayScheduler />
      </section>
      <SiteFooter />
    </main>
  )
}

export default WorkDaySchedulerPage
