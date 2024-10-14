const Client = require('ftp')
const fs = require('fs')
const CONFIG = require('../../config')

const options = {
  host: CONFIG.AD_FTP_HOST,
  user: CONFIG.AD_FTP_USER,
  password: CONFIG.AD_FTP_PASSWORD,
}

let client

const FTPService = {
  connect: connect,
  listFolder: listFolder,
  getDownloadStream: getDownloadStream,
  download: download,
}

module.exports = FTPService

function connect() {
  return new Promise((resolve, reject) => {
    client = new Client()
    client.on('ready', () => resolve(client))
    client.on('error', (error) => reject(error))
    client.connect(options)
  })
}

function listFolder(path) {
  return new Promise((resolve, reject) => {
    client.cwd(path, (error, data) => {
      if (error) {
        return reject(error)
      }

      client.list((error, data) => {
        if (error) {
          return reject(error)
        }

        return resolve(data)
      })
    })
  })
}

function getDownloadStream(file) {
  return new Promise((resolve, reject) => {
    client.get(file.name, (error, stream) => {
      if (error) {
        return reject(error)
      }

      return resolve(stream)
    })
  })
}

function download(file) {
  return new Promise((resolve, reject) => {
    client.get(file.name, (error, stream) => {
      if (error) {
        return reject(error)
      }

      stream.once('close', () => {
        client.end()
        console.log(`${file.name} downloaded!`)
        return resolve()
      })

      console.log(`Downloading ${file.name}...`)
      stream.pipe(fs.createWriteStream(`downloads/${file.name}`))
    })
  })
}
