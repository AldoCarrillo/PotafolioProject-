import { useEffect, useRef, useState } from 'react'
import './WeatherDashboard.css'

const HISTORY_KEY = 'portfolio-weather-cities'
const HISTORY_LIMIT = 5

const weatherTypes = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  56: { label: 'Freezing drizzle', icon: '🌧️' },
  57: { label: 'Heavy freezing drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Freezing rain', icon: '🌧️' },
  67: { label: 'Heavy freezing rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Light rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Heavy rain showers', icon: '🌧️' },
  85: { label: 'Snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️' },
  99: { label: 'Heavy thunderstorm with hail', icon: '⛈️' },
}

function getWeatherType(code) {
  return weatherTypes[code] ?? { label: 'Conditions unavailable', icon: '🌡️' }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function getUVLevel(value) {
  if (value < 3) return { label: 'Low', className: 'uv-low' }
  if (value < 6) return { label: 'Moderate', className: 'uv-moderate' }
  if (value < 8) return { label: 'High', className: 'uv-high' }
  if (value < 11) return { label: 'Very high', className: 'uv-very-high' }
  return { label: 'Extreme', className: 'uv-extreme' }
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('The weather service could not complete the request. Try again in a moment.')
  }
  return response.json()
}

async function fetchCityWeather(query, signal) {
  const geocodingUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
  geocodingUrl.search = new URLSearchParams({ name: query, count: '1', language: 'en', format: 'json' })
  const locations = await fetchJson(geocodingUrl, signal)

  if (!locations.results?.length) {
    throw new Error(`No city found for “${query}”. Check the spelling and try again.`)
  }

  const location = locations.results[0]
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast')
  forecastUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '6',
  })
  const forecast = await fetchJson(forecastUrl, signal)

  return { location, forecast }
}

function loadRecentCities() {
  try {
    const savedSearches = localStorage.getItem(HISTORY_KEY)
    if (!savedSearches) return []
    const savedCities = JSON.parse(savedSearches)
    return Array.isArray(savedCities)
      ? savedCities.filter((city) => typeof city === 'string').slice(0, HISTORY_LIMIT)
      : []
  } catch (error) {
    throw new Error('Saved recent searches could not be read.', { cause: error })
  }
}

function WeatherDashboard() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [recentCities, setRecentCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const requestController = useRef(null)

  useEffect(() => {
    try {
      setRecentCities(loadRecentCities())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Saved recent searches could not be read.')
    }
    return () => requestController.current?.abort()
  }, [])

  async function searchCity(cityName = query) {
    const searchTerm = cityName.trim()
    if (!searchTerm) {
      setMessage('Enter a city name to see its weather.')
      return
    }

    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setIsLoading(true)
    setMessage('')
    setWeather(null)
    try {
      const result = await fetchCityWeather(searchTerm, controller.signal)
      setWeather(result)
      setQuery('')

      const updatedCities = [
        result.location.name,
        ...recentCities.filter((city) => city.toLowerCase() !== result.location.name.toLowerCase()),
      ].slice(0, HISTORY_LIMIT)
      setRecentCities(updatedCities)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedCities))
      } catch {
        setMessage('Weather loaded, but recent searches could not be saved in this browser.')
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setMessage(error.message)
      } else if (!(error instanceof Error)) {
        setMessage('Could not load weather. Try again.')
      }
    } finally {
      if (requestController.current === controller) setIsLoading(false)
    }
  }

  function clearDashboard() {
    requestController.current?.abort()
    requestController.current = null
    setIsLoading(false)
    setWeather(null)
    setMessage('')
    setQuery('')
    setRecentCities([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      setMessage('Dashboard cleared, but saved searches could not be removed from this browser.')
    }
  }

  const current = weather?.forecast.current
  const daily = weather?.forecast.daily
  const currentWeather = current ? getWeatherType(current.weather_code) : null
  const uvLevel = current ? getUVLevel(current.uv_index) : null
  const locationLabel = weather
    ? [weather.location.name, weather.location.admin1, weather.location.country].filter(Boolean).join(', ')
    : ''

  return (
    <section className="weather-dashboard" aria-label="Weather dashboard">
      <aside className="weather-search">
        <h2>Find a city</h2>
        <form
          className="weather-search-form"
          onSubmit={(event) => {
            event.preventDefault()
            searchCity()
          }}
        >
          <label htmlFor="weather-city">City name</label>
          <input
            id="weather-city"
            autoComplete="off"
            placeholder="e.g. San Diego"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="weather-search-actions">
            <button className="weather-search-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Searching…' : 'Search'}
            </button>
            <button className="weather-clear-button" type="button" onClick={clearDashboard}>Clear</button>
          </div>
        </form>
        {recentCities.length > 0 && (
          <div className="recent-cities">
            <h3>Recent searches</h3>
            <ul>
              {recentCities.map((city) => (
                <li key={city}>
                  <button type="button" onClick={() => searchCity(city)} disabled={isLoading}>{city}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div className="weather-content" aria-live="polite" aria-busy={isLoading}>
        {message && <p className="weather-message" role="status">{message}</p>}
        {!weather && !isLoading && !message && (
          <div className="weather-empty">
            <span aria-hidden="true">☁️</span>
            <h2>Your forecast, at a glance.</h2>
            <p>Search for a city to see current conditions and a five-day outlook.</p>
          </div>
        )}
        {weather && current && daily && (
          <>
            <section className="current-weather">
              <div className="current-weather-heading">
                <div>
                  <p className="weather-kicker">CURRENT WEATHER</p>
                  <h2>{locationLabel}</h2>
                  <p className="local-time">
                    {formatDate(current.time.slice(0, 10))} · {current.time.slice(11, 16)} local time
                  </p>
                </div>
                <span className="current-weather-icon" role="img" aria-label={currentWeather.label}>{currentWeather.icon}</span>
              </div>
              <p className="current-temperature">{Math.round(current.temperature_2m)}<span>°F</span></p>
              <p className="current-description">{currentWeather.label}</p>
              <div className="weather-metrics">
                <div><span>Feels like</span><strong>{Math.round(current.apparent_temperature)}°F</strong></div>
                <div><span>Humidity</span><strong>{current.relative_humidity_2m}%</strong></div>
                <div><span>Wind</span><strong>{Math.round(current.wind_speed_10m)} mph</strong></div>
                <div className={`uv-metric ${uvLevel.className}`}><span>UV index · {uvLevel.label}</span><strong>{Math.round(current.uv_index)}</strong></div>
              </div>
            </section>

            <section className="forecast-section">
              <div className="forecast-heading">
                <h2>5-day forecast</h2>
                <span>High / low · °F</span>
              </div>
              <div className="forecast-list">
                {daily.time.slice(1, 6).map((date, index) => {
                  const dayWeather = getWeatherType(daily.weather_code[index + 1])
                  return (
                    <article className="forecast-day" key={date}>
                      <h3>{formatDate(date)}</h3>
                      <span className="forecast-icon" role="img" aria-label={dayWeather.label}>{dayWeather.icon}</span>
                      <p>{dayWeather.label}</p>
                      <div className="forecast-temperatures">
                        <strong>{Math.round(daily.temperature_2m_max[index + 1])}°</strong>
                        <span>{Math.round(daily.temperature_2m_min[index + 1])}°</span>
                      </div>
                      <span className="precipitation">{daily.precipitation_probability_max[index + 1] ?? 0}% rain</span>
                    </article>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  )
}

export default WeatherDashboard
