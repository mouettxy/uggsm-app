import Agenda from 'agenda'
import { EmailSubcriptionModel } from '../../models/emailSubscriptionModel'
import { each } from 'lodash'
import { sendDailyReport } from '../mail/dailyOrdersReport'

const { MONGO_USER, MONGO_PASSWORD, DB_CONNECTION_STRING, DB_SERVER } = process.env
const DB_URL = `${DB_CONNECTION_STRING}${MONGO_USER}:${MONGO_PASSWORD}${DB_SERVER}?connectTimeoutMS=1000&bufferCommands=false&authSource=admin`

const agenda = new Agenda({ db: { address: DB_URL } })

agenda.define('send daily order reports', async (job) => {
  const subscriptions = await EmailSubcriptionModel.find({ type: 'daily-report' })
  console.log('we here')
  if (subscriptions) {
    each(subscriptions, (e) => {
      console.log(e)
      sendDailyReport(e.email)
    })
  }
})
;(async function () {
  // IIFE to give access to async/await
  await agenda.start()

  await agenda.every('00 20 * * *', 'send daily order reports')
})()
