const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { frontendUrl } = require('./config/env')
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const reportRoutes = require('./routes/reportRoutes')
const controller = require('./controllers/employeeController')
const { authenticate } = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const allowedOrigins = frontendUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOrigin = (origin, callback) => {
  const isLocalDevelopment = origin && /^https?:\/\/localhost:\d+$/.test(origin)

  if (!origin || allowedOrigins.includes(origin) || isLocalDevelopment) {
    return callback(null, true)
  }

  return callback(new Error('Origin is not allowed by CORS'))
}

app.use(helmet())
app.use(cors({ origin: corsOrigin }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) =>
  res.json({
    success: true,
    message: 'EmployeeHub API is healthy',
    data: { timestamp: new Date().toISOString() },
  }),
)

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/reports', reportRoutes)
app.get('/api/dashboard', authenticate, controller.dashboard)

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `${req.method} ${req.originalUrl}`,
  }),
)

app.use(errorHandler)
module.exports = app
