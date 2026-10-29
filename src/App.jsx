import './styles/App.css'
import BudgetBallerPage from './pages/BudgetBallerPage.jsx'
import CodeQuizPage from './pages/CodeQuizPage.jsx'
import FitnessTrackerPage from './pages/FitnessTrackerPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NoteTakerPage from './pages/NoteTakerPage.jsx'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage.jsx'
import ReadmeGeneratorPage from './pages/ReadmeGeneratorPage.jsx'
import TeamBuilderPage from './pages/TeamBuilderPage.jsx'
import WeatherDashboardPage from './pages/WeatherDashboardPage.jsx'
import WorkDaySchedulerPage from './pages/WorkDaySchedulerPage.jsx'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '')

  if (path === '/projects/password-generator') {
    return <PasswordGeneratorPage />
  }

  if (path === '/projects/readme-generator') {
    return <ReadmeGeneratorPage />
  }

  if (path === '/projects/team-builder') {
    return <TeamBuilderPage />
  }

  if (path === '/projects/budget-baller') {
    return <BudgetBallerPage />
  }

  if (path === '/projects/code-quiz') {
    return <CodeQuizPage />
  }

  if (path === '/projects/work-day-scheduler') {
    return <WorkDaySchedulerPage />
  }

  if (path === '/projects/note-taker') {
    return <NoteTakerPage />
  }

  if (path === '/projects/weather-dashboard') {
    return <WeatherDashboardPage />
  }

  if (path === '/projects/fitness-tracker') {
    return <FitnessTrackerPage />
  }

  return <HomePage />
}

export default App
