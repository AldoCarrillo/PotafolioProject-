import { useMemo, useState } from 'react'
import './EmployeeTrackerDashboard.css'

const departmentPalette = {
  Engineering: '#316da8',
  Design: '#8b6fdd',
  Operations: '#2d9d8f',
  Product: '#ff9f43',
  Marketing: '#d66fa3',
}

const initialEmployees = [
  { id: 1, name: 'Maya Chen', role: 'Senior Engineer', department: 'Engineering', status: 'Available' },
  { id: 2, name: 'Alicia Brooks', role: 'Operations Lead', department: 'Operations', status: 'Review' },
  { id: 3, name: 'Leo Martin', role: 'UX Designer', department: 'Design', status: 'Available' },
  { id: 4, name: 'Noah Patel', role: 'Product Manager', department: 'Product', status: 'Review' },
  { id: 5, name: 'Olivia Singh', role: 'Brand Strategist', department: 'Marketing', status: 'Available' },
]

const initialDepartments = [
  { name: 'Engineering', headcount: 12, openRoles: 2 },
  { name: 'Design', headcount: 6, openRoles: 1 },
  { name: 'Operations', headcount: 8, openRoles: 2 },
  { name: 'Product', headcount: 7, openRoles: 3 },
  { name: 'Marketing', headcount: 5, openRoles: 1 },
]

const openRoles = [
  { title: 'Frontend Engineer', team: 'Engineering', level: 'Mid-level' },
  { title: 'Customer Insights Analyst', team: 'Marketing', level: 'Junior' },
  { title: 'Partnership Manager', team: 'Operations', level: 'Senior' },
  { title: 'Design Systems Lead', team: 'Design', level: 'Senior' },
]

function EmployeeTrackerDashboard() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [selectedDepartment, setSelectedDepartment] = useState('All departments')
  const [formData, setFormData] = useState({
    name: '',
    role: 'Frontend Engineer',
    department: 'Engineering',
    status: 'Available',
  })

  const totalEmployees = employees.length
  const totalDepartments = initialDepartments.length
  const openPositions = openRoles.length
  const avgTeamSize = Math.round((employees.length + openPositions) / totalDepartments)

  const filteredEmployees = useMemo(() => {
    if (selectedDepartment === 'All departments') return employees
    return employees.filter((employee) => employee.department === selectedDepartment)
  }, [employees, selectedDepartment])

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleAddEmployee(event) {
    event.preventDefault()
    const trimmedName = formData.name.trim()
    if (!trimmedName) return

    setEmployees((current) => [
      ...current,
      {
        id: Date.now(),
        name: trimmedName,
        role: formData.role,
        department: formData.department,
        status: formData.status,
      },
    ])

    setFormData({
      name: '',
      role: 'Frontend Engineer',
      department: 'Engineering',
      status: 'Available',
    })
  }

  return (
    <div className="employee-tracker">
      <div className="tracker-header">
        <div>
          <p>Team Ops</p>
          <h2>Employee tracker</h2>
        </div>
        <button type="button">Sync roster</button>
      </div>

      <div className="tracker-overview">
        <div className="metric-card">
          <span>Total employees</span>
          <strong>{totalEmployees}</strong>
          <small>Across 5 departments</small>
        </div>
        <div className="metric-card">
          <span>Departments</span>
          <strong>{totalDepartments}</strong>
          <small>Stable coverage</small>
        </div>
        <div className="metric-card">
          <span>Open roles</span>
          <strong>{openPositions}</strong>
          <small>Hiring momentum</small>
        </div>
        <div className="metric-card">
          <span>Avg. team size</span>
          <strong>{avgTeamSize}</strong>
          <small>Balanced workloads</small>
        </div>
      </div>

      <div className="tracker-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Team directory</h3>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option value="All departments">All departments</option>
              {initialDepartments.map((department) => (
                <option key={department.name} value={department.name}>{department.name}</option>
              ))}
            </select>
          </div>

          <div className="directory-list">
            {filteredEmployees.map((employee) => (
              <div className="employee-row" key={employee.id}>
                <div className="employee-profile">
                  <div className="employee-avatar">
                    {employee.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div className="employee-details">
                    <strong>{employee.name}</strong>
                    <span>{employee.department}</span>
                  </div>
                </div>
                <div className="employee-role">
                  <strong>{employee.role}</strong>
                  <span>{employee.department}</span>
                </div>
                <span className={`employee-status ${employee.status === 'Available' ? 'status-available' : 'status-review'}`}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="panel">
          <h3>Add teammate</h3>
          <form className="employee-form" onSubmit={handleAddEmployee}>
            <div className="form-field">
              <label htmlFor="employee-name">Employee name</label>
              <input
                id="employee-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jordan Lee"
              />
            </div>

            <div className="form-field">
              <label htmlFor="employee-role">Role</label>
              <select id="employee-role" name="role" value={formData.role} onChange={handleInputChange}>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="UX Designer">UX Designer</option>
                <option value="Operations Lead">Operations Lead</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Brand Strategist">Brand Strategist</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="employee-department">Department</label>
              <select id="employee-department" name="department" value={formData.department} onChange={handleInputChange}>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="employee-status">Availability</label>
              <select id="employee-status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="Available">Available</option>
                <option value="Review">Review</option>
              </select>
            </div>

            <button className="form-submit" type="submit">Add to roster</button>
            <p className="form-note">This updated version turns the original command-line tracker into a readable dashboard for quick team planning.</p>
          </form>
        </aside>
      </div>

      <div className="lower-grid">
        <section className="panel">
          <h3>Department health</h3>
          <div className="dept-list">
            {initialDepartments.map((department) => {
              const ratio = Math.min((department.headcount / 15) * 100, 100)
              const color = departmentPalette[department.name] || '#316da8'

              return (
                <div className="dept-row" key={department.name}>
                  <div className="dept-row-header">
                    <div className="dept-meta">
                      <span className="color-dot" style={{ backgroundColor: color }} />
                      <strong>{department.name}</strong>
                    </div>
                    <small>{department.headcount} people</small>
                  </div>
                  <div className="progress-track">
                    <span className="progress-bar" style={{ width: `${ratio}%`, background: `linear-gradient(90deg, ${color}, #8db7de)` }} />
                  </div>
                  <small>{department.openRoles} open roles</small>
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel">
          <h3>Open roles</h3>
          <div className="role-list">
            {openRoles.map((role) => (
              <div className="role-item" key={`${role.title}-${role.team}`}>
                <div className="role-header">
                  <strong>{role.title}</strong>
                  <span className="role-tag">{role.level}</span>
                </div>
                <small>{role.team}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EmployeeTrackerDashboard
