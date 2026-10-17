import { useState } from 'react'
import './PasswordGenerator.css'

const characterSets = [
  { id: 'uppercase', label: 'Uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { id: 'lowercase', label: 'Lowercase', characters: 'abcdefghijklmnopqrstuvwxyz' },
  { id: 'numbers', label: 'Numbers', characters: '0123456789' },
  { id: 'symbols', label: 'Symbols', characters: '!@#$%^&*()-_=+[]{};:,.?' },
]

function randomIndex(max) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random generation is unavailable.')
  }

  const range = Math.floor(256 / max) * max
  const value = new Uint8Array(1)

  do {
    globalThis.crypto.getRandomValues(value)
  } while (value[0] >= range)

  return value[0] % max
}

function createPassword(length, enabledSets) {
  const characters = enabledSets.map((set) => set.characters)
  const password = characters.map((set) => set[randomIndex(set.length)])
  const allCharacters = characters.join('')

  while (password.length < length) {
    password.push(allCharacters[randomIndex(allCharacters.length)])
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1)
    ;[password[index], password[swapIndex]] = [password[swapIndex], password[index]]
  }

  return password.join('')
}

function PasswordGenerator() {
  const [length, setLength] = useState('16')
  const [enabledCriteria, setEnabledCriteria] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function generate() {
    const passwordLength = Number(length)
    const selectedSets = characterSets.filter((set) => enabledCriteria[set.id])

    if (!Number.isInteger(passwordLength) || passwordLength < 8 || passwordLength > 64) {
      setPassword('')
      setMessage('Choose a password length between 8 and 64.')
      return
    }

    if (selectedSets.length === 0) {
      setPassword('')
      setMessage('Select at least one character type.')
      return
    }

    try {
      setPassword(createPassword(passwordLength, selectedSets))
      setMessage('Secure password generated.')
    } catch {
      setPassword('')
      setMessage('Secure password generation is unavailable in this browser.')
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password)
      setMessage('Password copied to clipboard.')
    } catch {
      setMessage('Clipboard access is unavailable. Select the password to copy it.')
    }
  }

  return (
    <div className="password-tool">
      <div className="password-options">
        <label className="length-control" htmlFor="password-length">
          Length
          <input
            id="password-length"
            type="number"
            min="8"
            max="64"
            value={length}
            onChange={(event) => setLength(event.target.value)}
          />
        </label>
        <fieldset className="criteria">
          <legend>Include</legend>
          {characterSets.map((set) => (
            <label className="criterion" key={set.id}>
              <input
                type="checkbox"
                checked={enabledCriteria[set.id]}
                onChange={(event) => {
                  setEnabledCriteria({ ...enabledCriteria, [set.id]: event.target.checked })
                }}
              />
              <span>{set.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="password-result">
        <label htmlFor="generated-password">Your password</label>
        <input
          id="generated-password"
          type="text"
          value={password}
          placeholder="Your secure password will appear here"
          readOnly
          onFocus={(event) => event.target.select()}
        />
      </div>
      <div className="password-actions">
        <button className="generate-button" type="button" onClick={generate}>Generate password</button>
        <button className="copy-button" type="button" onClick={copyPassword} disabled={!password}>Copy</button>
      </div>
      <p className="password-message" aria-live="polite">{message}</p>
    </div>
  )
}

export default PasswordGenerator
