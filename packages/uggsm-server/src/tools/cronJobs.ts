import { EmailSubcriptionModel } from '../models/emailSubscriptionModel'
import { each } from 'lodash'
import { sendDailyReport } from './mail/sendReports'
import cron from 'node-cron'

cron.schedule('0 20 * * *', async () => {
  const subscriptions = await EmailSubcriptionModel.find({ type: 'daily-report' })
  if (subscriptions) {
    each(subscriptions, (e) => {
      console.log('send daily report to ' + e.email)
      sendDailyReport(e.email)
    })
  }
})
