const app = require('./server')
const server = app.listen(app.get('port'), () => console.log(`Listening on ${app.get('port')}`))
server.timeout = 300000
