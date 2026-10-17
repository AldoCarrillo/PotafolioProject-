import './styles/App.css'
import HomePage from './pages/HomePage.jsx'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage.jsx'
import WeatherDashboardPage from './pages/WeatherDashboardPage.jsx'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '')

  if (path === '/projects/password-generator') {
    return <PasswordGeneratorPage />
  }

  if (path === '/projects/weather-dashboard') {
    return <WeatherDashboardPage />
  }

  return <HomePage />
}

export default App
