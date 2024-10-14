const WORKERS = process.env.WEB_CONCURRENCY || 1
const cluster = require('cluster')

if (cluster.isMaster) {
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork()
  }
} else {
  const app = require('./server')
  const server = app.listen(app.get('port'), () => console.log(`Listening on ${app.get('port')}`))
  server.timeout = 300000
}

cluster.on('exit', (worker) => {
  console.log('Worker', worker.id, ' is no more')
  cluster.fork()
})
