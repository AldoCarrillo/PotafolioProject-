import { useState } from 'react'
import './FitnessTracker.css'

const STORAGE_KEY = 'portfolio-fitness-workouts'

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function readWorkouts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { workouts: [], message: '' }

    const workouts = JSON.parse(saved)
    const valid = Array.isArray(workouts) && workouts.every((workout) => (
      workout
      && typeof workout.id === 'string'
      && typeof workout.startedAt === 'string'
      && Array.isArray(workout.exercises)
      && workout.exercises.every((exercise) => (
        exercise
        && typeof exercise.id === 'string'
        && typeof exercise.name === 'string'
        && ['cardio', 'resistance'].includes(exercise.type)
        && Number.isFinite(exercise.duration)
      ))
    ))
    if (!valid) throw new Error('Saved workout data has an invalid format.')
    return { workouts, message: '' }
  } catch (error) {
    return {
      workouts: [],
      message: error instanceof Error
        ? `Saved workouts could not be loaded: ${error.message}`
        : 'Saved workouts could not be loaded.',
    }
  }
}

function formatDate(value, options = { month: 'short', day: 'numeric' }) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return new Intl.DateTimeFormat('en', options).format(date)
}

function getExerciseSummary(exercise) {
  if (exercise.type === 'cardio') {
    return `${exercise.distance} mi · ${exercise.duration} min`
  }
  return `${exercise.sets} sets × ${exercise.reps} reps · ${exercise.weight} lb · ${exercise.duration} min`
}

function FitnessTracker() {
  const [stored, setStored] = useState(readWorkouts)
  const [exerciseType, setExerciseType] = useState('resistance')
  const [message, setMessage] = useState(stored.message)
  const [form, setForm] = useState({
    name: '',
    weight: '',
    sets: '',
    reps: '',
    duration: '',
    distance: '',
  })

  const workouts = stored.workouts
  const activeWorkout = workouts.find((workout) => !workout.completedAt)

  function persistWorkouts(nextWorkouts, successMessage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWorkouts))
      setStored({ workouts: nextWorkouts, message: '' })
      setMessage(successMessage)
      return true
    } catch (error) {
      setMessage(error instanceof Error
        ? `Your workout could not be saved: ${error.message}`
        : 'Your workout could not be saved in this browser.')
      return false
    }
  }

  function startWorkout() {
    if (activeWorkout) {
      setMessage('You already have a workout in progress. Finish it before starting another.')
      return
    }

    const workout = { id: createId(), startedAt: new Date().toISOString(), exercises: [] }
    if (persistWorkouts([...workouts, workout], 'Workout started. Add your first exercise below.')) {
      setMessage('')
    }
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function addExercise(event) {
    event.preventDefault()
    if (!activeWorkout) {
      setMessage('Start a workout before adding an exercise.')
      return
    }

    const name = form.name.trim()
    const duration = Number(form.duration)
    const isResistance = exerciseType === 'resistance'
    const isValid = name
      && Number.isFinite(duration)
      && duration > 0
      && (isResistance
        ? Number(form.weight) >= 0
          && Number(form.sets) > 0
          && Number(form.reps) > 0
          && form.weight !== ''
          && form.sets !== ''
          && form.reps !== ''
        : Number(form.distance) > 0 && form.distance !== '')

    if (!isValid) {
      setMessage('Enter an exercise name and valid values for every required field.')
      return
    }

    const exercise = {
      id: createId(),
      type: exerciseType,
      name,
      duration,
      ...(isResistance
        ? { weight: Number(form.weight), sets: Number(form.sets), reps: Number(form.reps) }
        : { distance: Number(form.distance) }),
    }
    const nextWorkouts = workouts.map((workout) => (
      workout.id === activeWorkout.id
        ? { ...workout, exercises: [...workout.exercises, exercise] }
        : workout
    ))

    if (persistWorkouts(nextWorkouts, `${name} added to your workout.`)) {
      setForm({ name: '', weight: '', sets: '', reps: '', duration: '', distance: '' })
    }
  }

  function finishWorkout() {
    if (!activeWorkout?.exercises.length) {
      setMessage('Add at least one exercise before finishing your workout.')
      return
    }

    const nextWorkouts = workouts.map((workout) => (
      workout.id === activeWorkout.id
        ? { ...workout, completedAt: new Date().toISOString() }
        : workout
    ))
    persistWorkouts(nextWorkouts, 'Workout completed. Nice work!')
  }

  const recentWorkouts = [...workouts]
    .sort((first, second) => second.startedAt.localeCompare(first.startedAt))
    .slice(0, 5)

  return (
    <div className="fitness-tracker">
      <section className="fitness-overview" aria-label="Start or finish a workout">
        <div className="fitness-overview-heading">
          <div>
            <p className="fitness-eyebrow">YOUR WORKOUT</p>
            <h2>{activeWorkout ? 'Workout in progress' : 'Ready to get moving?'}</h2>
          </div>
          {!activeWorkout ? (
            <button className="fitness-primary-button" type="button" onClick={startWorkout}>
              <span aria-hidden="true">+</span> Start workout
            </button>
          ) : (
            <button className="fitness-primary-button" type="button" onClick={finishWorkout}>
              Finish workout <span aria-hidden="true">✓</span>
            </button>
          )}
        </div>
      </section>

      <div className="fitness-columns">
        <section className="fitness-panel fitness-workout-panel" aria-labelledby="fitness-workout-title">
          <div className="fitness-panel-heading">
            <div>
              <p className="fitness-eyebrow">{activeWorkout ? 'IN PROGRESS' : 'READY WHEN YOU ARE'}</p>
              <h2 id="fitness-workout-title">{activeWorkout ? 'Current workout' : 'Your next workout'}</h2>
            </div>
            {activeWorkout && (
              <span className="fitness-session-date">{formatDate(activeWorkout.startedAt)}</span>
            )}
          </div>

          {!activeWorkout ? (
            <div className="fitness-empty">
              <p>Start a workout to add your exercises.</p>
            </div>
          ) : (
            <>
              {activeWorkout.exercises.length > 0 && (
                <ul className="fitness-exercise-list">
                  {activeWorkout.exercises.map((exercise) => (
                    <li key={exercise.id}>
                      <span className="fitness-exercise-icon" aria-hidden="true">
                        {exercise.type === 'cardio' ? '↗' : '↟'}
                      </span>
                      <span className="fitness-exercise-details">
                        <strong>{exercise.name}</strong>
                        <small>{getExerciseSummary(exercise)}</small>
                      </span>
                      <span className="fitness-type-tag">{exercise.type}</span>
                    </li>
                  ))}
                </ul>
              )}

              <form className="fitness-exercise-form" onSubmit={addExercise}>
                <div className="fitness-form-heading">
                  <h3>Add an exercise</h3>
                  <div className="fitness-type-switch" role="group" aria-label="Exercise type">
                    <button
                      type="button"
                      className={exerciseType === 'resistance' ? 'is-selected' : ''}
                      aria-pressed={exerciseType === 'resistance'}
                      onClick={() => setExerciseType('resistance')}
                    >
                      Strength
                    </button>
                    <button
                      type="button"
                      className={exerciseType === 'cardio' ? 'is-selected' : ''}
                      aria-pressed={exerciseType === 'cardio'}
                      onClick={() => setExerciseType('cardio')}
                    >
                      Cardio
                    </button>
                  </div>
                </div>

                <label className="fitness-field">
                  <span>{exerciseType === 'cardio' ? 'Activity' : 'Exercise'}</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder={exerciseType === 'cardio' ? 'e.g. Outdoor run' : 'e.g. Bench press'}
                    required
                    maxLength={70}
                  />
                </label>

                {exerciseType === 'resistance' ? (
                  <div className="fitness-field-grid">
                    <label className="fitness-field">
                      <span>Weight (lb)</span>
                      <input name="weight" type="number" min="0" step="any" value={form.weight} onChange={updateForm} placeholder="0" required />
                    </label>
                    <label className="fitness-field">
                      <span>Sets</span>
                      <input name="sets" type="number" min="1" step="1" value={form.sets} onChange={updateForm} placeholder="3" required />
                    </label>
                    <label className="fitness-field">
                      <span>Reps</span>
                      <input name="reps" type="number" min="1" step="1" value={form.reps} onChange={updateForm} placeholder="10" required />
                    </label>
                    <label className="fitness-field">
                      <span>Duration (min)</span>
                      <input name="duration" type="number" min="1" step="1" value={form.duration} onChange={updateForm} placeholder="15" required />
                    </label>
                  </div>
                ) : (
                  <div className="fitness-field-grid">
                    <label className="fitness-field">
                      <span>Distance (mi)</span>
                      <input name="distance" type="number" min="0.1" step="any" value={form.distance} onChange={updateForm} placeholder="2.5" required />
                    </label>
                    <label className="fitness-field">
                      <span>Duration (min)</span>
                      <input name="duration" type="number" min="1" step="1" value={form.duration} onChange={updateForm} placeholder="25" required />
                    </label>
                  </div>
                )}
                <button className="fitness-add-button" type="submit">Add exercise <span aria-hidden="true">+</span></button>
              </form>
            </>
          )}
        </section>

        <section className="fitness-panel fitness-history-panel" aria-labelledby="fitness-history-title">
          <div className="fitness-panel-heading">
            <div>
              <p className="fitness-eyebrow">PAST SESSIONS</p>
              <h2 id="fitness-history-title">Recent workouts</h2>
            </div>
          </div>
          {recentWorkouts.length > 0 ? (
            <ul className="fitness-history-list">
              {recentWorkouts.map((workout) => {
                const minutes = workout.exercises.reduce((total, exercise) => total + exercise.duration, 0)
                return (
                  <li key={workout.id}>
                    <span className={`fitness-history-mark${workout.completedAt ? ' is-complete' : ''}`} aria-hidden="true">
                      {workout.completedAt ? '✓' : '…'}
                    </span>
                    <span>
                      <strong>{formatDate(workout.startedAt, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      <small>{workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'} · {minutes} min</small>
                    </span>
                    <span className="fitness-history-status">{workout.completedAt ? 'Done' : 'Active'}</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="fitness-history-empty">Your finished workouts will show up here.</p>
          )}
        </section>
      </div>

      <p className="fitness-storage-note">Workouts are saved in this browser.</p>
      {message && <p className="fitness-status" role="status">{message}</p>}
    </div>
  )
}

export default FitnessTracker
