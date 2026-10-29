import { useEffect, useState } from 'react'
import './CodeQuiz.css'

const SCORE_KEY = 'portfolio-code-quiz-scores'
const QUIZ_SECONDS = 60

const questions = [
  {
    question: 'Which keyword declares a block-scoped variable that can be reassigned?',
    answers: ['var', 'let', 'const', 'static'],
    correctAnswer: 1,
  },
  {
    question: 'What does Array.map() return?',
    answers: ['A new array', 'A number', 'The original array only', 'A boolean'],
    correctAnswer: 0,
  },
  {
    question: 'Which value represents an intentional absence of any object value?',
    answers: ['0', 'undefined', 'null', 'NaN'],
    correctAnswer: 2,
  },
  {
    question: 'Which method converts a JSON string into a JavaScript value?',
    answers: ['JSON.stringify()', 'JSON.parse()', 'Object.fromJSON()', 'JSON.convert()'],
    correctAnswer: 1,
  },
  {
    question: 'What does === check in JavaScript?',
    answers: ['Value only', 'Type only', 'Value and type', 'Whether a value exists'],
    correctAnswer: 2,
  },
]

function readScores() {
  try {
    const saved = localStorage.getItem(SCORE_KEY)
    if (!saved) return { scores: [], message: '' }

    const scores = JSON.parse(saved)
    const isValid = Array.isArray(scores) && scores.every((score) => (
      score
      && typeof score.name === 'string'
      && Number.isInteger(score.score)
      && typeof score.id === 'string'
    ))
    if (!isValid) throw new Error('Saved scores have an invalid format.')
    return { scores, message: '' }
  } catch (error) {
    return {
      scores: [],
      message: error instanceof Error
        ? `Scores could not be loaded: ${error.message}`
        : 'Scores could not be loaded.',
    }
  }
}

function CodeQuiz() {
  const [stored, setStored] = useState(readScores)
  const [mode, setMode] = useState('ready')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_SECONDS)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState(stored.message)

  const scores = [...stored.scores].sort((first, second) => second.score - first.score).slice(0, 5)

  useEffect(() => {
    if (mode !== 'answering') return undefined

    const timerId = window.setInterval(() => {
      setSecondsLeft((remaining) => Math.max(remaining - 1, 0))
    }, 1000)
    return () => window.clearInterval(timerId)
  }, [mode])

  useEffect(() => {
    if ((mode === 'answering' || mode === 'feedback') && secondsLeft === 0) {
      setMode('results')
    }
  }, [mode, secondsLeft])

  useEffect(() => {
    if (mode !== 'feedback') return undefined

    const timeoutId = window.setTimeout(() => {
      const nextQuestion = questionIndex + 1
      if (nextQuestion >= questions.length) {
        setMode('results')
      } else {
        setQuestionIndex(nextQuestion)
        setSelectedAnswer(null)
        setFeedback('')
        setMode('answering')
      }
    }, 650)

    return () => window.clearTimeout(timeoutId)
  }, [mode, questionIndex])

  function startQuiz() {
    setQuestionIndex(0)
    setScore(0)
    setSecondsLeft(QUIZ_SECONDS)
    setSelectedAnswer(null)
    setFeedback('')
    setName('')
    setMessage('')
    setMode('answering')
  }

  function answerQuestion(answerIndex) {
    if (mode !== 'answering') return

    setSelectedAnswer(answerIndex)
    if (answerIndex === questions[questionIndex].correctAnswer) {
      setScore((current) => current + 1)
      setFeedback('Correct!')
    } else {
      setSecondsLeft((remaining) => Math.max(remaining - 10, 0))
      setFeedback('Not quite — 10 seconds off.')
    }
    setMode('feedback')
  }

  function saveScore(event) {
    event.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) {
      setMessage('Enter your name to save your score.')
      return
    }

    const nextScores = [
      ...stored.scores,
      {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: cleanName.slice(0, 30),
        score,
      },
    ]

    try {
      localStorage.setItem(SCORE_KEY, JSON.stringify(nextScores))
      setStored({ scores: nextScores, message: '' })
      setName('')
      setMessage('Score saved on this device.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Your score could not be saved: ${error.message}`
        : 'Your score could not be saved in this browser.')
    }
  }

  function clearScores() {
    try {
      localStorage.removeItem(SCORE_KEY)
      setStored({ scores: [], message: '' })
      setMessage('Saved scores cleared.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Scores could not be cleared: ${error.message}`
        : 'Scores could not be cleared.')
    }
  }

  const progress = mode === 'results'
    ? 100
    : ((questionIndex + (mode === 'feedback' ? 1 : 0)) / questions.length) * 100

  return (
    <div className="code-quiz">
      {mode === 'ready' && (
        <section className="quiz-welcome">
          <span className="quiz-mark" aria-hidden="true">&lt;/&gt;</span>
          <div>
            <p className="quiz-eyebrow">JAVASCRIPT QUICK QUIZ</p>
            <h2>Five questions.<br />One minute.</h2>
            <p>Test your JavaScript basics. Wrong answers cost 10 seconds.</p>
          </div>
          <button className="quiz-primary-button" type="button" onClick={startQuiz}>Start quiz <span aria-hidden="true">→</span></button>
        </section>
      )}

      {(mode === 'answering' || mode === 'feedback') && (
        <section className="quiz-question-card" aria-labelledby="quiz-question">
          <div className="quiz-topline">
            <span>QUESTION {questionIndex + 1} <span className="quiz-muted">/ {questions.length}</span></span>
            <span className={`quiz-timer${secondsLeft <= 15 ? ' is-low' : ''}`} aria-live="polite">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="quiz-progress" role="progressbar" aria-label="Quiz progress" aria-valuenow={questionIndex + (mode === 'feedback' ? 1 : 0)} aria-valuemin="0" aria-valuemax={questions.length}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <h2 id="quiz-question">{questions[questionIndex].question}</h2>
          <div className="quiz-answers">
            {questions[questionIndex].answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = questions[questionIndex].correctAnswer === index
              let answerClass = ''
              if (mode === 'feedback' && isCorrect) answerClass = 'is-correct'
              else if (mode === 'feedback' && isSelected) answerClass = 'is-incorrect'

              return (
                <button
                  className={`quiz-answer ${answerClass}`}
                  type="button"
                  key={answer}
                  onClick={() => answerQuestion(index)}
                  disabled={mode !== 'answering'}
                >
                  <span>{String.fromCharCode(65 + index)}</span>{answer}
                </button>
              )
            })}
          </div>
          <div className="quiz-question-footer">
            <p className="quiz-feedback" role="status">{feedback}</p>
            <span>Score <strong>{score}/{questions.length}</strong></span>
          </div>
        </section>
      )}

      {mode === 'results' && (
        <section className="quiz-results-card">
          <p className="quiz-eyebrow">QUIZ COMPLETE</p>
          <h2>Your score</h2>
          <p className="quiz-final-score">{score}<span> / {questions.length}</span></p>
          <p className="quiz-result-caption">
            {secondsLeft === 0 ? 'Time is up. Give it another try!' : 'Nice work. Want to save your result?'}
          </p>
          <form className="quiz-save-form" onSubmit={saveScore}>
            <label htmlFor="quiz-player-name">Name</label>
            <div>
              <input
                id="quiz-player-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={30}
                placeholder="Your name"
              />
              <button className="quiz-primary-button" type="submit">Save score</button>
            </div>
          </form>
          <button className="quiz-restart-button" type="button" onClick={startQuiz}>Try again</button>
        </section>
      )}

      <section className="quiz-leaderboard" aria-labelledby="quiz-leaderboard-title">
        <div className="quiz-leaderboard-heading">
          <div>
            <p className="quiz-eyebrow">ON THIS DEVICE</p>
            <h2 id="quiz-leaderboard-title">High scores</h2>
          </div>
          {stored.scores.length > 0 && (
            <button type="button" className="quiz-clear-button" onClick={clearScores}>Clear scores</button>
          )}
        </div>
        {scores.length > 0 ? (
          <ol className="quiz-score-list">
            {scores.map((entry, index) => (
              <li key={entry.id}>
                <span className="quiz-rank">{String(index + 1).padStart(2, '0')}</span>
                <span className="quiz-player">{entry.name}</span>
                <strong>{entry.score}/{questions.length}</strong>
              </li>
            ))}
          </ol>
        ) : (
          <p className="quiz-no-scores">No scores saved yet. Finish a quiz to add yours.</p>
        )}
      </section>

      {message && <p className="quiz-message" role="status">{message}</p>}
    </div>
  )
}

export default CodeQuiz
