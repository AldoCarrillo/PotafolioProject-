import { useState } from 'react'
import './BudgetBaller.css'

const STORAGE_KEY = 'portfolio-budget-baller'
const ACCOUNTS = ['Bank', 'Card', 'Cash']
const CATEGORIES = ['Food', 'Home', 'Travel', 'Car', 'Entertainment', 'Bills']
const EMPTY_BUDGETS = Object.fromEntries(CATEGORIES.map((category) => [category, 0]))

function readBudgetData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { transactions: [], budgets: EMPTY_BUDGETS, message: '' }

    const data = JSON.parse(saved)
    const validTransactions = Array.isArray(data.transactions) && data.transactions.every((transaction) => (
      transaction
      && typeof transaction.id === 'string'
      && ['income', 'expense'].includes(transaction.type)
      && typeof transaction.name === 'string'
      && Number.isFinite(transaction.amount)
      && transaction.amount > 0
      && ACCOUNTS.includes(transaction.account)
      && typeof transaction.date === 'string'
      && (transaction.type === 'income' || CATEGORIES.includes(transaction.category))
    ))
    const validBudgets = data.budgets
      && typeof data.budgets === 'object'
      && !Array.isArray(data.budgets)
      && CATEGORIES.every((category) => (
        Number.isFinite(data.budgets[category]) && data.budgets[category] >= 0
      ))
    if (!validTransactions || !validBudgets) throw new Error('Saved budget data has an invalid format.')

    return { transactions: data.transactions, budgets: data.budgets, message: '' }
  } catch (error) {
    return {
      transactions: [],
      budgets: EMPTY_BUDGETS,
      message: error instanceof Error
        ? `Budget data could not be loaded: ${error.message}`
        : 'Budget data could not be loaded.',
    }
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function getToday() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function BudgetBaller() {
  const [stored, setStored] = useState(readBudgetData)
  const [type, setType] = useState('expense')
  const [form, setForm] = useState({
    name: '',
    amount: '',
    account: 'Bank',
    category: 'Food',
    date: getToday(),
  })
  const [budgets, setBudgets] = useState(stored.budgets)
  const [isEditingBudgets, setIsEditingBudgets] = useState(false)
  const [message, setMessage] = useState(stored.message)
  const [selectedMonth, setSelectedMonth] = useState(getToday().slice(0, 7))

  const transactions = stored.transactions
  const accountBalances = Object.fromEntries(ACCOUNTS.map((account) => [
    account,
    transactions.reduce((balance, transaction) => {
      if (transaction.account !== account) return balance
      return balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount)
    }, 0),
  ]))
  const totalBalance = Object.values(accountBalances).reduce((total, balance) => total + balance, 0)
  const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(selectedMonth))
  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const monthExpenses = monthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const recentTransactions = [...transactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 8)

  function persistData(nextTransactions, nextBudgets, successMessage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        transactions: nextTransactions,
        budgets: nextBudgets,
      }))
      setStored({ transactions: nextTransactions, budgets: nextBudgets, message: '' })
      setBudgets(nextBudgets)
      setMessage(successMessage)
      return true
    } catch (error) {
      setMessage(error instanceof Error
        ? `Your changes could not be saved: ${error.message}`
        : 'Your changes could not be saved in this browser.')
      return false
    }
  }

  function submitTransaction(event) {
    event.preventDefault()
    const name = form.name.trim()
    const amount = Number(form.amount)

    if (!name || !Number.isFinite(amount) || amount <= 0 || !form.date) {
      setMessage('Enter a description, a positive amount, and a date.')
      return
    }

    const transaction = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      name,
      amount,
      account: form.account,
      date: form.date,
      ...(type === 'expense' ? { category: form.category } : {}),
    }

    if (persistData(
      [transaction, ...transactions],
      stored.budgets,
      `${type === 'income' ? 'Income' : 'Expense'} added.`,
    )) {
      setForm((current) => ({ ...current, name: '', amount: '' }))
    }
  }

  function deleteTransaction(id) {
    persistData(
      transactions.filter((transaction) => transaction.id !== id),
      stored.budgets,
      'Transaction removed.',
    )
  }

  function saveBudgets(event) {
    event.preventDefault()
    const nextBudgets = Object.fromEntries(CATEGORIES.map((category) => [
      category,
      Number(budgets[category]),
    ]))

    if (Object.values(nextBudgets).some((amount) => !Number.isFinite(amount) || amount < 0)) {
      setMessage('Budget amounts must be zero or greater.')
      return
    }

    if (persistData(transactions, nextBudgets, 'Monthly budgets saved.')) {
      setIsEditingBudgets(false)
    }
  }

  function formatDate(date) {
    const parsedDate = new Date(`${date}T12:00:00`)
    return Number.isNaN(parsedDate.getTime())
      ? date
      : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parsedDate)
  }

  return (
    <div className="budget-baller">
      <section className="budget-summary" aria-label="Account balances">
        <div className="budget-summary-heading">
          <div>
            <p className="budget-eyebrow">YOUR MONEY, AT A GLANCE</p>
            <h2>Total balance</h2>
          </div>
          <strong className="budget-total">{formatCurrency(totalBalance)}</strong>
        </div>
        <div className="budget-account-grid">
          {ACCOUNTS.map((account) => (
            <article className="budget-account" key={account}>
              <span className={`budget-account-icon is-${account.toLowerCase()}`} aria-hidden="true">
                {account === 'Bank' ? 'B' : account === 'Card' ? 'C' : '$'}
              </span>
              <span>
                <small>{account}</small>
                <strong>{formatCurrency(accountBalances[account])}</strong>
              </span>
            </article>
          ))}
        </div>
      </section>

      <div className="budget-layout">
        <div className="budget-main-column">
          <section className="budget-panel" aria-labelledby="budget-transaction-title">
            <div className="budget-panel-heading">
              <div>
                <p className="budget-eyebrow">TRACK YOUR MONEY</p>
                <h2 id="budget-transaction-title">Add a transaction</h2>
              </div>
            </div>
            <div className="budget-type-switch" role="group" aria-label="Transaction type">
              <button type="button" className={type === 'expense' ? 'is-selected is-expense' : ''} aria-pressed={type === 'expense'} onClick={() => setType('expense')}>
                Expense
              </button>
              <button type="button" className={type === 'income' ? 'is-selected is-income' : ''} aria-pressed={type === 'income'} onClick={() => setType('income')}>
                Income
              </button>
            </div>
            <form className="budget-transaction-form" onSubmit={submitTransaction}>
              <label className="budget-field budget-field-wide">
                <span>Description</span>
                <input
                  type="text"
                  maxLength={70}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder={type === 'expense' ? 'e.g. Grocery shopping' : 'e.g. Monthly paycheck'}
                  required
                />
              </label>
              <label className="budget-field">
                <span>Amount ($)</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="0.00"
                  required
                />
              </label>
              <label className="budget-field">
                <span>Account</span>
                <select value={form.account} onChange={(event) => setForm({ ...form, account: event.target.value })}>
                  {ACCOUNTS.map((account) => <option key={account}>{account}</option>)}
                </select>
              </label>
              {type === 'expense' && (
                <label className="budget-field">
                  <span>Category</span>
                  <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
              )}
              <label className="budget-field">
                <span>Date</span>
                <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
              </label>
              <button className={`budget-submit-button is-${type}`} type="submit">
                Add {type} <span aria-hidden="true">+</span>
              </button>
            </form>
          </section>

          <section className="budget-panel" aria-labelledby="budget-recent-title">
            <div className="budget-panel-heading budget-transactions-heading">
              <div>
                <p className="budget-eyebrow">YOUR ACTIVITY</p>
                <h2 id="budget-recent-title">Recent transactions</h2>
              </div>
              <span>{transactions.length} total</span>
            </div>
            {recentTransactions.length > 0 ? (
              <ul className="budget-transaction-list">
                {recentTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <span className={`budget-transaction-mark is-${transaction.type}`} aria-hidden="true">
                      {transaction.type === 'income' ? '+' : '−'}
                    </span>
                    <span className="budget-transaction-info">
                      <strong>{transaction.name}</strong>
                      <small>{formatDate(transaction.date)} · {transaction.account}{transaction.category ? ` · ${transaction.category}` : ''}</small>
                    </span>
                    <strong className={`budget-transaction-amount is-${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '−'}{formatCurrency(transaction.amount)}
                    </strong>
                    <button className="budget-delete-button" type="button" onClick={() => deleteTransaction(transaction.id)} aria-label={`Remove ${transaction.name}`}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="budget-empty">No transactions yet. Add an income or expense to get started.</p>
            )}
          </section>
        </div>

        <aside className="budget-side-column">
          <section className="budget-panel budget-month-panel" aria-labelledby="budget-month-title">
            <div className="budget-panel-heading">
              <div>
                <p className="budget-eyebrow">MONTHLY OVERVIEW</p>
                <h2 id="budget-month-title">Cash flow</h2>
              </div>
              <label className="budget-month-picker">
                <span className="visually-hidden">Choose month</span>
                <input type="month" value={selectedMonth} onChange={(event) => {
                  if (event.target.value) setSelectedMonth(event.target.value)
                }} />
              </label>
            </div>
            <div className="budget-cash-flow">
              <div><span>Income</span><strong className="is-income">{formatCurrency(monthIncome)}</strong></div>
              <div><span>Expenses</span><strong className="is-expense">{formatCurrency(monthExpenses)}</strong></div>
            </div>
          </section>

          <section className="budget-panel" aria-labelledby="budget-categories-title">
            <div className="budget-panel-heading">
              <div>
                <p className="budget-eyebrow">SPENDING LIMITS</p>
                <h2 id="budget-categories-title">Monthly budgets</h2>
              </div>
              <button type="button" className="budget-edit-button" onClick={() => setIsEditingBudgets((current) => !current)}>
                {isEditingBudgets ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditingBudgets ? (
              <form className="budget-edit-form" onSubmit={saveBudgets}>
                {CATEGORIES.map((category) => (
                  <label key={category}>
                    <span>{category}</span>
                    <span className="budget-input-wrap">
                      <span>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={budgets[category]}
                        onChange={(event) => setBudgets({ ...budgets, [category]: event.target.value })}
                        aria-label={`${category} monthly budget`}
                      />
                    </span>
                  </label>
                ))}
                <button className="budget-submit-button is-income" type="submit">Save budgets</button>
              </form>
            ) : (
              <ul className="budget-category-list">
                {CATEGORIES.map((category) => {
                  const spent = monthTransactions
                    .filter((transaction) => transaction.type === 'expense' && transaction.category === category)
                    .reduce((total, transaction) => total + transaction.amount, 0)
                  const limit = stored.budgets[category]
                  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                  return (
                    <li key={category}>
                      <div className="budget-category-heading">
                        <strong>{category}</strong>
                        <span>{formatCurrency(spent)} <span className="budget-limit">/ {limit > 0 ? formatCurrency(limit) : 'No limit'}</span></span>
                      </div>
                      <div
                        className="budget-progress"
                        role="progressbar"
                        aria-label={`${category} budget used`}
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <span className={limit > 0 && spent > limit ? 'is-over-budget' : ''} style={{ width: `${progress}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <p className="budget-storage-note">Your entries are kept on this device. No bank or card account is connected.</p>
      {message && <p className="budget-message" role="status">{message}</p>}
    </div>
  )
}

export default BudgetBaller
