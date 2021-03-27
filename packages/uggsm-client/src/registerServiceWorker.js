import { register } from 'register-service-worker'
import { sendNotification, UPDATE_APP_EVENT, UPDATE_APP_INTERVAL } from './services/notificationService'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('Service worker is active.')
    },
    registered(registration) {
      console.log('Service worker has been registered.')

      setInterval(() => {
        registration.update()
      }, UPDATE_APP_INTERVAL)
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available; please refresh.')

      document.dispatchEvent(new CustomEvent(UPDATE_APP_EVENT, { detail: registration }))

      sendNotification('Доступно обновление!', {
        body: 'У приложения UGGSM появилось обновление. Для установки нажмите на уведомление.',
        icon: '/img/icons/android-chrome-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      })
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
