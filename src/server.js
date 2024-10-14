const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const v3Routes = require('./api/v3/v3.router')
const config = require('./config')
const Raven = require('raven')
const cors = require('cors')

// Connect to Postgres
require('./db/postgres-db')

const app = express()

if (config['NODE_ENV'] !== 'test' && config['NODE_ENV'] !== 'dev') {
  Raven.config(config['SENTRY_DSN']).install()
  app.use(Raven.requestHandler())
  app.use(Raven.errorHandler())
}

app.set('port', config['PORT'] || 5000)
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

app.use(cors())

app.get('/', (req, res) => res.json({ message: "Everything's okay here, thanks for asking :)" }))
app.use('/docs', express.static(path.join(__dirname, '/docs')))
app.use('/api/v3/', v3Routes)

module.exports = app
