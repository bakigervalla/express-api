const Db = require('../../../db/postgres-db')
const CONFIG = require('../../../config')
const nodemailer = require('nodemailer')

const JobService = {
  getJobs,
  addJob,
  updateJob,
  removeJob,
  applyToJob,
}

const transporter = nodemailer.createTransport({
  host: CONFIG.AWS_EMAIL_SMTP,
  port: 465,
  secure: true,
  auth: {
    user: CONFIG.AWS_EMAIL_USERNAME,
    pass: CONFIG.AWS_EMAIL_PASSWORD,
  },
})

module.exports = JobService

// Jobs
async function getJobs() {
  try {
    const query = `SELECT j.id, j.workshop_id , j.email, j.title, j.description, j.create_date, j.status, w.name workshop
                    FROM jobs j 
                    inner join workshops w on j.workshop_id = w.workshop_id 
                    where UPPER(j.status) = 'ACTIVE'`
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function addJob({ workshop_id, email, title, description }) {
  try {
    const query = `INSERT INTO jobs(workshop_id, email, title, description) VALUES ($1, $2, $3, $4) RETURNING *`
    return await Db.query(query, [workshop_id, email, title, description])
  } catch (e) {
    throw e
  }
}

async function updateJob({ workshop_id, email, title, description, status }) {
  try {
    const query = `UPDATE jobs
                   SET email = $1,
                       title = $2,
                       description = $3,
                       status = $4
                  WHERE workshop_id = $5`
    return await Db.query(query, [email, title, description, status, workshop_id])
  } catch (e) {
    throw e
  }
}

async function removeJob(id) {
  try {
    const query = `UPDATE jobs
                   SET status = 'CLOSED' 
                  WHERE id=$1`
    return await Db.query(query, [id])
  } catch (e) {
    throw e
  }
}

async function applyToJob(data) {
  try {
    const { to_email, job_title, full_name, email, mobile_number, cv, coverLetter } = data

    const mailOptions = {
      from: 'jobb@bilxtraverksted.no',
      to: to_email,
      subject: `Det har kommet en ny søknad på stillingen: ${job_title}`,
      html: `Hei,
          <p>
            Det har kommet en ny søknad på stillingen: ${job_title}.
          <p>
            Søker heter ${full_name} og kan kontaktes på mobil: ${mobile_number} eller epost: ${email}.
          </p>
          <p>
            Se vedlegg for søknad og CV.
          </p>
          <p>
            Med vennlig hilsen <br />
            jobb@bilxtraverksted.no <br />
            NB! Denne mailen kan ikke besvares! <br />
          </p>`,
      attachments: [],
    }

    if (cv) {
      mailOptions.attachments.push({
        filename: cv.file_name,
        content: cv.file,
        encoding: 'base64',
      })
    }

    if (coverLetter) {
      mailOptions.attachments.push({
        filename: coverLetter.file_name,
        content: coverLetter.file,
        encoding: 'base64',
      })
    }

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return { message: 'Unable to send e-mail', error: error }
      }

      return 'E-mail was sent'
    })
  } catch (e) {
    throw e
  }
}
