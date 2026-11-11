import { useEffect } from 'react'
import EmployeeTrackerDashboard from '../features/employee-tracker/EmployeeTrackerDashboard.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

function EmployeeTrackerPage() {
  useEffect(() => {
    document.title = 'Employee Tracker | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">TEAM MANAGEMENT</p>
        <h1>Employee<br /><em>Tracker.</em></h1>
        <p className="tool-page-intro">A clean, modern employee management dashboard for tracking team members, reviewing department health, and keeping hiring priorities visible at a glance.</p>
        <div className="tool-page-card">
          <EmployeeTrackerDashboard />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

export default EmployeeTrackerPage
