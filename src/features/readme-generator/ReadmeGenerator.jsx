import { useState } from 'react'
import './ReadmeGenerator.css'

const licenses = {
  MIT: {
    label: 'MIT License',
    url: 'https://opensource.org/licenses/MIT',
    badge: 'https://img.shields.io/badge/License-MIT-blue.svg',
  },
  BSD: {
    label: 'BSD 3-Clause License',
    url: 'https://opensource.org/licenses/BSD-3-Clause',
    badge: 'https://img.shields.io/badge/License-BSD_3--Clause-blue.svg',
  },
  GPL: {
    label: 'GNU GPL v3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0',
    badge: 'https://img.shields.io/badge/License-GPLv3-blue.svg',
  },
}

const initialForm = {
  title: '',
  description: '',
  installation: '',
  usage: '',
  tests: '',
  credits: '',
  license: 'MIT',
  author: '',
  year: String(new Date().getFullYear()),
  github: '',
  email: '',
}

const projectFields = [
  { name: 'title', label: 'Project title', placeholder: 'My project', required: true },
  { name: 'description', label: 'Description', placeholder: 'What does your project do?', multiline: true, required: true },
  { name: 'installation', label: 'Installation', placeholder: 'npm install', multiline: true },
  { name: 'usage', label: 'Usage', placeholder: 'How to use the project', multiline: true },
]

const additionalFields = [
  { name: 'tests', label: 'Tests', placeholder: 'How to run tests', multiline: true },
  { name: 'credits', label: 'Credits', placeholder: 'People or resources to credit', multiline: true },
  { name: 'author', label: 'Author', placeholder: 'Your name' },
  { name: 'year', label: 'Copyright year' },
  { name: 'github', label: 'GitHub username', placeholder: 'username' },
  { name: 'email', label: 'Contact email', placeholder: 'you@example.com', type: 'email' },
]

function buildReadme(form) {
  const license = licenses[form.license]
  const title = form.title.trim()
  const optionalSections = [
    ['Installation', form.installation],
    ['Usage', form.usage],
    ['Tests', form.tests],
    ['Credits', form.credits],
  ].filter(([, content]) => content.trim())
  const hasQuestions = form.github.trim() || form.email.trim()
  const sections = [
    ...optionalSections,
    ['License', `This project is licensed under the [${license.label}](${license.url}).`],
    ...(hasQuestions ? [['Questions', [
      form.email.trim() && `Email: ${form.email.trim()}`,
      form.github.trim() && `GitHub: https://github.com/${form.github.trim().replace(/^@/, '')}`,
    ].filter(Boolean).join('\n\n')]] : []),
  ]

  return [
    `# ${title}`,
    '',
    `[![License](${license.badge})](${license.url})`,
    '',
    '## Description',
    '',
    form.description.trim(),
    '',
    ...(sections.length ? [
      '## Table of Contents',
      '',
      ...sections.map(([heading]) => `- [${heading}](#${heading.toLowerCase()})`),
      '',
    ] : []),
    ...sections.flatMap(([heading, content]) => [
      `## ${heading}`,
      '',
      content,
      '',
    ]),
    ...(form.author.trim() ? [
      `Copyright (c) ${form.year.trim() || new Date().getFullYear()} ${form.author.trim()}`,
      '',
    ] : []),
  ].join('\n').trimEnd() + '\n'
}

function getFilename(title) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug || 'readme'}.md`
}

function ReadmeGenerator() {
  const [form, setForm] = useState(initialForm)
  const [readme, setReadme] = useState('')
  const [message, setMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function generateReadme(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setMessage('Add a project title and description to generate your README.')
      return
    }

    setReadme(buildReadme(form))
    setMessage('README generated. You can copy it or download the Markdown file.')
  }

  async function copyReadme() {
    try {
      await navigator.clipboard.writeText(readme)
      setMessage('README copied to the clipboard.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Could not copy the README: ${error.message}`
        : 'Could not copy the README. Select the Markdown text to copy it.')
    }
  }

  function downloadReadme() {
    try {
      const file = new Blob([readme], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = getFilename(form.title)
      document.body.append(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setMessage('README Markdown file downloaded.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Could not download the README: ${error.message}`
        : 'Could not download the README in this browser.')
    }
  }

  return (
    <div className="readme-tool">
      <form className="readme-form" onSubmit={generateReadme}>
        <div className="readme-fields">
          {projectFields.map(({ name, label, placeholder, multiline, required }) => (
            <label className={`readme-field${multiline ? ' readme-field-wide' : ''}`} htmlFor={`readme-${name}`} key={name}>
              <span>{label}{required && <span aria-hidden="true"> *</span>}</span>
              {multiline
                ? <textarea id={`readme-${name}`} name={name} onChange={updateField} placeholder={placeholder} required={required} rows={3} value={form[name]} />
                : <input id={`readme-${name}`} name={name} onChange={updateField} placeholder={placeholder} required={required} value={form[name]} />}
            </label>
          ))}
          <label className="readme-field" htmlFor="readme-license">
            <span>License</span>
            <select id="readme-license" name="license" onChange={updateField} value={form.license}>
              {Object.entries(licenses).map(([key, license]) => (
                <option key={key} value={key}>{license.label}</option>
              ))}
            </select>
          </label>
        </div>
        <details className="readme-additional">
          <summary>Optional sections and contact details</summary>
          <div className="readme-fields">
            {additionalFields.map(({ name, label, placeholder, multiline, type }) => (
              <label className={`readme-field${multiline ? ' readme-field-wide' : ''}`} htmlFor={`readme-${name}`} key={name}>
                <span>{label}</span>
                {multiline
                  ? <textarea id={`readme-${name}`} name={name} onChange={updateField} placeholder={placeholder} rows={3} value={form[name]} />
                  : <input
                    autoComplete={name === 'email' ? 'email' : undefined}
                    autoCapitalize={name === 'github' ? 'none' : undefined}
                    id={`readme-${name}`}
                    inputMode={name === 'year' ? 'numeric' : undefined}
                    name={name}
                    onChange={updateField}
                    placeholder={placeholder}
                    type={type || 'text'}
                    value={form[name]}
                  />}
              </label>
            ))}
          </div>
        </details>
        <div className="readme-actions">
          <button className="readme-primary" type="submit">Generate README</button>
          <button className="readme-secondary" disabled={!readme} onClick={copyReadme} type="button">Copy Markdown</button>
          <button className="readme-secondary" disabled={!readme} onClick={downloadReadme} type="button">Download .md</button>
        </div>
      </form>
      <div className="readme-preview">
        <div className="readme-preview-heading">
          <div>
            <span className="readme-preview-kicker">MARKDOWN OUTPUT</span>
            <h2>{readme ? 'Your README' : 'Preview'}</h2>
          </div>
          <span className="readme-file-icon" aria-hidden="true">.md</span>
        </div>
        <textarea
          aria-label="Generated README Markdown"
          className="readme-output"
          onFocus={(event) => event.target.select()}
          placeholder="Your README will appear here after you generate it."
          readOnly
          value={readme}
        />
        <p className="readme-message" aria-live="polite">{message}</p>
      </div>
    </div>
  )
}

export default ReadmeGenerator
