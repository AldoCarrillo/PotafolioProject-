import { useEffect, useState } from 'react'
import './WorkDayScheduler.css'

const STORAGE_KEY = 'portfolio-work-day-scheduler'
const WORK_HOURS = Array.from({ length: 24 }, (_, index) => index)

function getLocalDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatSelectedDate(value) {
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatHour(hour) {
  const displayHour = hour % 12 || 12
  const period = hour < 12 ? 'AM' : 'PM'
  return `${displayHour}:00 ${period}`
}

function readSchedules() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { schedules: {}, message: '' }

    const schedules = JSON.parse(saved)
    const valid = schedules
      && typeof schedules === 'object'
      && !Array.isArray(schedules)
      && Object.values(schedules).every((day) => (
        day
        && typeof day === 'object'
        && !Array.isArray(day)
        && Object.entries(day).every(([hour, task]) => (
          WORK_HOURS.includes(Number(hour)) && typeof task === 'string'
        ))
      ))
    if (!valid) throw new Error('Saved schedule data has an invalid format.')
    return { schedules, message: '' }
  } catch (error) {
    return {
      schedules: {},
      message: error instanceof Error
        ? `Saved schedule could not be loaded: ${error.message}`
        : 'Saved schedule could not be loaded.',
    }
  }
}

function WorkDayScheduler() {
  const [stored, setStored] = useState(readSchedules)
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey(new Date()))
  const [drafts, setDrafts] = useState({})
  const [message, setMessage] = useState(stored.message)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  const tasks = stored.schedules[selectedDate] ?? {}
  const todayKey = getLocalDateKey(now)
  const isToday = selectedDate === todayKey
  const savedTaskCount = Object.values(tasks).filter((task) => task.trim()).length

  function saveTask(hour) {
    if (getHourStatus(hour) === 'is-past') return

    const task = (drafts[hour] ?? tasks[hour] ?? '').trim()
    const nextDay = { ...tasks }
    if (task) nextDay[hour] = task
    else delete nextDay[hour]

    const nextSchedules = { ...stored.schedules }
    if (Object.keys(nextDay).length) nextSchedules[selectedDate] = nextDay
    else delete nextSchedules[selectedDate]

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedules))
      setStored({ schedules: nextSchedules, message: '' })
      setDrafts((current) => {
        const nextDrafts = { ...current }
        delete nextDrafts[hour]
        return nextDrafts
      })
      setMessage(task ? `Task saved for ${formatHour(hour)}.` : `Task cleared for ${formatHour(hour)}.`)
    } catch (error) {
      setMessage(error instanceof Error
        ? `Your task could not be saved: ${error.message}`
        : 'Your task could not be saved in this browser.')
    }
  }

  function clearDay() {
    if (!tasks || Object.keys(tasks).length === 0) return

    const nextSchedules = { ...stored.schedules }
    delete nextSchedules[selectedDate]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedules))
      setStored({ schedules: nextSchedules, message: '' })
      setDrafts({})
      setMessage('All tasks for this day were cleared.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Tasks could not be cleared: ${error.message}`
        : 'Tasks could not be cleared in this browser.')
    }
  }

  function getHourStatus(hour) {
    if (selectedDate < todayKey) return 'is-past'
    if (!isToday) return 'is-upcoming'
    const currentHour = now.getHours()
    if (hour < currentHour) return 'is-past'
    if (hour === currentHour) return 'is-current'
    return 'is-upcoming'
  }

  return (
    <div className="workday-scheduler">
      <section className="scheduler-toolbar" aria-label="Schedule date">
        <div>
          <p className="scheduler-eyebrow">{isToday ? 'TODAY' : 'SELECTED DAY'}</p>
          <h2>{formatSelectedDate(selectedDate)}</h2>
        </div>
        <div className="scheduler-date-controls">
          <label htmlFor="scheduler-date">Choose date</label>
          <input
            id="scheduler-date"
            type="date"
            value={selectedDate}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedDate(event.target.value)
                setDrafts({})
                setMessage('')
              }
            }}
          />
          {!isToday && (
            <button type="button" className="scheduler-today-button" onClick={() => {
              setSelectedDate(todayKey)
              setDrafts({})
              setMessage('')
            }}>
              Today
            </button>
          )}
        </div>
      </section>

      <section className="scheduler-list-section" aria-label="Hourly schedule">
        <div className="scheduler-list-heading">
          <div>
            <h2>Your workday</h2>
            <p>{savedTaskCount} {savedTaskCount === 1 ? 'task' : 'tasks'} planned</p>
          </div>
          {savedTaskCount > 0 && (
            <button type="button" className="scheduler-clear-button" onClick={clearDay}>Clear day</button>
          )}
        </div>

        <div className="scheduler-slots">
          {WORK_HOURS.map((hour) => {
            const task = drafts[hour] ?? tasks[hour] ?? ''
            const status = getHourStatus(hour)
            const isPast = status === 'is-past'

            return (
              <form
                className={`scheduler-slot ${status}`}
                key={hour}
                onSubmit={(event) => {
                  event.preventDefault()
                  saveTask(hour)
                }}
              >
                <label className="scheduler-hour" htmlFor={`scheduler-task-${hour}`}>
                  <span className="scheduler-hour-dot" aria-hidden="true" />
                  {formatHour(hour)}
                  {status === 'is-current' && <span className="scheduler-now-label">NOW</span>}
                </label>
                <input
                  id={`scheduler-task-${hour}`}
                  type="text"
                  maxLength={120}
                  value={task}
                  disabled={isPast}
                  onChange={(event) => setDrafts((current) => ({ ...current, [hour]: event.target.value }))}
                  placeholder={isPast ? 'Past time' : 'Add a task...'}
                />
                <button className="scheduler-save-button" type="submit" disabled={isPast}>
                  {tasks[hour] ? 'Update' : 'Save'}
                </button>
              </form>
            )
          })}
        </div>
      </section>

      <p className="scheduler-note">Your schedule is saved in this browser, separately for each day.</p>
      {message && <p className="scheduler-message" role="status">{message}</p>}
    </div>
  )
}

export default WorkDayScheduler
