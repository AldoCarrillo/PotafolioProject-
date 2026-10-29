import { useState } from 'react'
import './TeamBuilder.css'

const roles = ['Manager', 'Engineer', 'Intern']

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function createTeamHtml(team) {
  const cards = team.map((member) => {
    const extra = member.role === 'Manager'
      ? `<span>Office</span><strong>${escapeHtml(member.detail)}</strong>`
      : member.role === 'Engineer'
        ? `<span>GitHub</span><strong>${escapeHtml(member.detail)}</strong>`
        : `<span>School</span><strong>${escapeHtml(member.detail)}</strong>`
    const githubLink = member.role === 'Engineer' && member.detail
      ? `<a href="https://github.com/${encodeURIComponent(member.detail.replace(/^@/, ''))}">View GitHub profile</a>`
      : ''

    return `<article class="card"><span class="role">${escapeHtml(member.role)}</span><h2>${escapeHtml(member.name)}</h2><p class="id">TEAM MEMBER ${member.id}</p><dl><div><span>Email</span><strong><a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a></strong></div><div>${extra}</div></dl>${githubLink}</article>`
  }).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Team directory</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f5f6;color:#202329;font:15px/1.6 Arial,sans-serif}.wrap{margin:auto;max-width:1080px;padding:64px 24px}.eyebrow{color:#316da8;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase}h1{font-size:clamp(36px,7vw,64px);letter-spacing:-.05em;line-height:1.05;margin:12px 0 8px}.intro{color:#626873;margin:0 0 34px}.grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.card{background:#fff;border:1px solid #e1e5e9;border-radius:18px;padding:23px;box-shadow:0 8px 26px #26364a0d}.role{background:#e7eff8;border-radius:999px;color:#316da8;display:inline-block;font-size:11px;font-weight:bold;padding:5px 10px}.card h2{font-size:22px;margin:17px 0 0}.id{color:#7a838c;font-size:10px;letter-spacing:.1em;margin:2px 0 18px}.card dl{margin:0}.card dl div{border-top:1px solid #e9edf0;display:grid;gap:3px;padding:11px 0}.card dl span{color:#747d86;font-size:11px}.card dl strong{font-size:13px;font-weight:600;overflow-wrap:anywhere}.card a{color:#316da8;text-decoration:none}.card>a{display:inline-block;font-size:12px;margin-top:12px}.card a:hover{text-decoration:underline}@media(max-width:480px){.wrap{padding:40px 18px}}
</style>
</head>
<body><main class="wrap"><p class="eyebrow">Team directory</p><h1>Meet the team</h1><p class="intro">${team.length} ${team.length === 1 ? 'person' : 'people'} working together.</p><section class="grid">${cards}</section></main></body>
</html>`
}

function getMemberDetailLabel(role) {
  if (role === 'Manager') return 'Office number'
  if (role === 'Engineer') return 'GitHub username'
  return 'School'
}

function TeamBuilder() {
  const [team, setTeam] = useState([])
  const [role, setRole] = useState('Manager')
  const [form, setForm] = useState({ name: '', email: '', detail: '' })
  const [message, setMessage] = useState('')

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function addMember(event) {
    event.preventDefault()
    if (role === 'Manager' && team.some((member) => member.role === 'Manager')) {
      setMessage('This team already has a manager. Choose Engineer or Intern instead.')
      return
    }

    const nextMember = {
      id: team.reduce((highest, member) => Math.max(highest, member.id), 0) + 1,
      role,
      name: form.name.trim(),
      email: form.email.trim(),
      detail: form.detail.trim(),
    }
    setTeam((current) => [...current, nextMember])
    setForm({ name: '', email: '', detail: '' })
    setMessage(`${nextMember.name} added to the team.`)
  }

  function removeMember(id) {
    const member = team.find((person) => person.id === id)
    setTeam((current) => current.filter((person) => person.id !== id))
    if (member) setMessage(`${member.name} removed from the team.`)
  }

  function downloadTeam() {
    try {
      const file = new Blob([createTeamHtml(team)], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = 'team-directory.html'
      document.body.append(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setMessage('Team directory downloaded.')
    } catch (error) {
      setMessage(error instanceof Error
        ? `Could not download the team page: ${error.message}`
        : 'Could not download the team page in this browser.')
    }
  }

  const managerCount = team.filter((member) => member.role === 'Manager').length
  const engineerCount = team.filter((member) => member.role === 'Engineer').length
  const internCount = team.filter((member) => member.role === 'Intern').length
  const detailLabel = getMemberDetailLabel(role)

  return (
    <div className="team-builder">
      <div className="team-summary" aria-label="Team member totals">
        <div><strong>{team.length}</strong><span>Team members</span></div>
        <div><strong>{managerCount}</strong><span>Manager</span></div>
        <div><strong>{engineerCount}</strong><span>Engineers</span></div>
        <div><strong>{internCount}</strong><span>Interns</span></div>
      </div>

      <form className="team-form" onSubmit={addMember}>
        <div className="team-form-heading">
          <div>
            <p className="team-kicker">GROW YOUR TEAM</p>
            <h2>Add a team member</h2>
          </div>
        </div>
        <div className="team-fields">
          <label className="team-field" htmlFor="team-role">
            <span>Role</span>
            <select id="team-role" onChange={(event) => setRole(event.target.value)} value={role}>
              {roles.map((option) => (
                <option disabled={option === 'Manager' && managerCount > 0} key={option} value={option}>
                  {option}{option === 'Manager' && managerCount > 0 ? ' (already added)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="team-field" htmlFor="team-name">
            <span>Name</span>
            <input autoComplete="name" id="team-name" name="name" onChange={updateForm} placeholder="Jordan Lee" required value={form.name} />
          </label>
          <label className="team-field" htmlFor="team-email">
            <span>Email</span>
            <input autoComplete="email" id="team-email" name="email" onChange={updateForm} placeholder="jordan@example.com" required type="email" value={form.email} />
          </label>
          <label className="team-field" htmlFor="team-detail">
            <span>{detailLabel}</span>
            <input
              autoCapitalize={role === 'Engineer' ? 'none' : undefined}
              id="team-detail"
              name="detail"
              onChange={updateForm}
              placeholder={role === 'Manager' ? 'e.g. 204' : role === 'Engineer' ? 'GitHub username' : 'School name'}
              required
              value={form.detail}
            />
          </label>
        </div>
        <div className="team-form-actions">
          <button className="team-add-button" type="submit">Add {role.toLowerCase()}</button>
          <p>Every member needs a name, valid email, and role detail.</p>
        </div>
      </form>

      <section className="team-roster" aria-labelledby="team-roster-title">
        <div className="team-roster-heading">
          <div>
            <p className="team-kicker">YOUR DIRECTORY</p>
            <h2 id="team-roster-title">Team roster</h2>
          </div>
          <button className="team-download-button" disabled={!team.length} onClick={downloadTeam} type="button">Download team page</button>
        </div>
        {team.length === 0
          ? <div className="team-empty"><span aria-hidden="true">＋</span><p>Your roster is empty.</p><span>Add a manager to get started.</span></div>
          : <div className="team-members">
            {team.map((member) => (
              <article className="team-member" key={member.id}>
                <div className={`team-avatar team-avatar-${member.role.toLowerCase()}`} aria-hidden="true">
                  {member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                </div>
                <div className="team-member-heading">
                  <div>
                    <span className={`team-role team-role-${member.role.toLowerCase()}`}>{member.role}</span>
                    <h3>{member.name}</h3>
                  </div>
                  <button aria-label={`Remove ${member.name}`} className="team-remove-button" onClick={() => removeMember(member.id)} type="button">Remove</button>
                </div>
                <a className="team-member-email" href={`mailto:${member.email}`}>{member.email}</a>
                <div className="team-member-detail"><span>{getMemberDetailLabel(member.role)}</span><strong>{member.detail}</strong></div>
              </article>
            ))}
          </div>}
      </section>
      <p className="team-message" aria-live="polite">{message}</p>
    </div>
  )
}

export default TeamBuilder
