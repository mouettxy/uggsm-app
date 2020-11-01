import { reduce } from 'lodash'
import Email from 'email-templates'
import path from 'path'
import generateReport from '../reports'
import moment from 'moment'
import { OrderModel } from '../../models'
import nodemailer from 'nodemailer'

export async function sendDailyReport(to: string) {
  const report: any = await generateReport(
    {
      type: 'daily',
      date: [moment().startOf('day').toISOString(), moment().endOf('day').toISOString()],
    },
    OrderModel
  )

  const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: 'daily@uggsm.ru',
      pass: 'rerlopxe1',
    },
  })

  const template = 'template'
  const opts = {
    message: {
      from: 'daily@uggsm.ru',
      to: to,
    },
    send: true,
    views: { root: __dirname },
    transport: transporter,
    juice: true,
    juiceResources: {
      applyStyleTags: true,
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve('src/services/mail/template'),
      },
    },
    preview: false,
    /* preview: {
      id: 'testEmail',
      dir: __dirname,
      open: false,
    }, */
  }
  const locals = {
    newOrders: report.new,
    closedOrders: report.closed,
    totalNew: reduce(
      report.new,
      (a, e: any) => {
        a += e.ordersTotal
        return a
      },
      0
    ),
    totalClosed: reduce(
      report.closed,
      (a, e: any) => {
        a += e.ordersTotal
        return a
      },
      0
    ),
    totalWorks: reduce(
      report.closed,
      (a, e: any) => {
        a += e.cashSum
        return a
      },
      0
    ),
    totalCash: reduce(
      report.closed,
      (a, e: any) => {
        a += e.worksSum
        return a
      },
      0
    ),
  }
  //@ts-ignore
  const email = new Email(opts)
  //@ts-ignore
  return await email.send({ template, locals })
}
