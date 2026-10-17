import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import WeatherDashboard from '../features/weather-dashboard/WeatherDashboard.jsx'

function WeatherDashboardPage() {
  useEffect(() => {
    document.title = 'Weather Dashboard | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page weather-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">INTERACTIVE TOOL</p>
        <h1>Weather<br /><em>Dashboard.</em></h1>
        <p className="tool-page-intro">Search a city to explore current conditions, UV levels, and the five-day forecast.</p>
        <WeatherDashboard />
      </section>
      <SiteFooter />
    </main>
  )
}

export default WeatherDashboardPage
