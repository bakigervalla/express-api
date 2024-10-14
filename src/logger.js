const winston = require('winston')
const CloudWatchTransport = require('winston-aws-cloudwatch')
const { NODE_ENV, LOG_LEVEL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = require('./config')
const { combine, timestamp, prettyPrint } = winston.format

const isTestEnv = NODE_ENV === 'test'
const isDevEnv = NODE_ENV === 'dev'

const logger = winston.createLogger({
  transports: [],
  level: LOG_LEVEL || 'info',
})

const consoleTransport = new winston.transports.Console({
  format: combine(timestamp(), prettyPrint()),
})

const cloudwatchTransport = new CloudWatchTransport({
  logGroupName: 'cars-web-api',
  logStreamName: NODE_ENV,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: 'eu-north-1',
  },
  submissionInterval: 2000,
  submissionRetryCount: 1,
  batchSize: 20,
  formatLog: (item) => `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
})

if (!isTestEnv && !isDevEnv) {
  logger.add(cloudwatchTransport)
}

logger.add(consoleTransport)

module.exports = logger
