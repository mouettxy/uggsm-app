import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import { authModule } from '@/store'
import axios from 'axios'

// TODO: screenshot attachment

const SENTRY_DSN = 'https://1d65590ad2a146da9db47161cc5d44d9@o566897.ingest.sentry.io/5710264'

export function captureError(message: string, scope?: Sentry.Scope) {
  Sentry.captureException(new Error(message), scope)
}

export async function sendUserReport(report: { name: string; email: string; comments: string }) {
  const eventId = Sentry.captureMessage('User Feedback')

  const request = {
    ...report,
    event_id: eventId,
  }

  const response = await axios.request({
    method: 'post',
    url: 'https://sentry.io/api/0/projects/uggsm/uggsm/user-feedback/',
    headers: {
      Authorization: `DSN ${SENTRY_DSN}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(request),
    validateStatus: (status) => status < 500,
  })

  if (response.status !== 200) {
    return false
  }

  return true
}

export function enrichSentryData() {
  if (authModule.isLoggedIn) {
    Sentry.setUser({
      id: authModule.user?._id,
      username: authModule.user?.username || 'not specified',
    })

    Sentry.setContext('role', {
      role: localStorage.getItem('current-role'),
    })
  }
}

export function initSentry() {
  const isNeedSentryInit = process.env.NODE_ENV === 'production'

  if (isNeedSentryInit) {
    Sentry.init({
      Vue,
      dsn: SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      logErrors: true,
      tracesSampleRate: 0.2,
    })

    enrichSentryData()
  }
}

export default Sentry
