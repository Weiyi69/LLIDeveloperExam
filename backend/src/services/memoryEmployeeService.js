let nextId = 6
let employees = [
  {
    id: 1,
    first_name: 'Maya',
    last_name: 'Chen',
    email: 'maya.chen@employeehub.local',
    contact_number: '555-0101',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'Active',
    created_at: new Date('2026-09-20T09:00:00Z'),
    updated_at: new Date('2026-09-20T09:00:00Z'),
  },
  {
    id: 2,
    first_name: 'Jonah',
    last_name: 'Williams',
    email: 'jonah.williams@employeehub.local',
    contact_number: '555-0102',
    department: 'Operations',
    position: 'Operations Lead',
    status: 'Active',
    created_at: new Date('2026-09-18T09:00:00Z'),
    updated_at: new Date('2026-09-18T09:00:00Z'),
  },
  {
    id: 3,
    first_name: 'Ari',
    last_name: 'Patel',
    email: 'ari.patel@employeehub.local',
    contact_number: '555-0103',
    department: 'People',
    position: 'People Partner',
    status: 'Active',
    created_at: new Date('2026-09-15T09:00:00Z'),
    updated_at: new Date('2026-09-15T09:00:00Z'),
  },
  {
    id: 4,
    first_name: 'Noah',
    last_name: 'Garcia',
    email: 'noah.garcia@employeehub.local',
    contact_number: '555-0104',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'Inactive',
    created_at: new Date('2026-09-10T09:00:00Z'),
    updated_at: new Date('2026-09-10T09:00:00Z'),
  },
  {
    id: 5,
    first_name: 'Lena',
    last_name: 'Brooks',
    email: 'lena.brooks@employeehub.local',
    contact_number: '555-0105',
    department: 'Engineering',
    position: 'QA Engineer',
    status: 'Active',
    created_at: new Date('2026-09-05T09:00:00Z'),
    updated_at: new Date('2026-09-05T09:00:00Z'),
  },
]

const matches = (employee, search, status, department) => {
  const haystack = `${employee.first_name} ${employee.last_name} ${employee.email} ${employee.department}`.toLowerCase()

  return (
    (!search || haystack.includes(search.toLowerCase())) &&
    (!status || employee.status === status) &&
    (!department || employee.department === department)
  )
}

const clone = (employee) => ({ ...employee })

async function list({ search = '', status = '', department = '', page = 1, pageSize = 10 }) {
  const filtered = employees
    .filter((employee) => matches(employee, search, status, department))
    .sort((a, b) => b.created_at - a.created_at)

  const start = (Number(page) - 1) * Number(pageSize)

  return {
    records: filtered.slice(start, start + Number(pageSize)).map(clone),
    total: filtered.length,
    page: Number(page),
    pageSize: Number(pageSize),
  }
}

async function getById(id) {
  const employee = employees.find((item) => item.id === Number(id))
  return employee ? clone(employee) : null
}

async function create(data) {
  const now = new Date()
  const employee = {
    id: nextId++,
    ...data,
    contact_number: data.contact_number || null,
    created_at: now,
    updated_at: now,
  }

  employees.push(employee)
  return clone(employee)
}

async function update(id, data) {
  const employee = employees.find((item) => item.id === Number(id))
  if (!employee) return null

  Object.assign(employee, data, { updated_at: new Date() })
  return clone(employee)
}

async function remove(id) {
  const before = employees.length
  employees = employees.filter((employee) => employee.id !== Number(id))
  return employees.length < before
}

async function dashboard() {
  const active = employees.filter((employee) => employee.status === 'Active').length

  return {
    stats: {
      total: employees.length,
      active,
      inactive: employees.length - active,
    },
    recent: employees
      .slice()
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 5)
      .map(clone),
  }
}

async function report(status) {
  const records = employees
    .filter((employee) => !status || employee.status === status)
    .sort(
      (a, b) =>
        a.department.localeCompare(b.department) || a.last_name.localeCompare(b.last_name),
    )
    .map(clone)

  const active = records.filter((employee) => employee.status === 'Active').length

  return {
    records,
    summary: {
      total: records.length,
      active,
      inactive: records.length - active,
    },
  }
}

module.exports = { list, getById, create, update, remove, dashboard, report }
