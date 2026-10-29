import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import BudgetBaller from '../features/budget-baller/BudgetBaller.jsx'

function BudgetBallerPage() {
  useEffect(() => {
    document.title = 'Budget Baller | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="tool-page">
        <a className="back-link" href="/#work">← Back to projects</a>
        <p className="project-label">PERSONAL FINANCE</p>
        <h1>Budget<br /><em>Baller.</em></h1>
        <p className="tool-page-intro">Track income and expenses, see where your money goes, and set simple monthly spending limits.</p>
        <BudgetBaller />
      </section>
      <SiteFooter />
    </main>
  )
}

export default BudgetBallerPage
