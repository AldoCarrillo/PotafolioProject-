import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import CodeQuiz from '../features/code-quiz/CodeQuiz.jsx'

function CodeQuizPage() {
  useEffect(() => {
    document.title = 'Code Quiz | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">INTERACTIVE QUIZ</p>
        <h1>Code<br /><em>Quiz.</em></h1>
        <p className="tool-page-intro">A quick JavaScript knowledge check. Answer five questions before the timer runs out.</p>
        <CodeQuiz />
      </section>
      <SiteFooter />
    </main>
  )
}

export default CodeQuizPage
