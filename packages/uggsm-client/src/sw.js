/* eslint-disable no-undef */
self.addEventListener('message', (e) => {
  if (!e.data) {
    return
  }

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      // NOOP
      break
  }
})

self.addEventListener('notificationclick', function (e) {
  let notification = e.notification
  let action = e.action

  if (action === 'close') {
    notification.close()
  } else {
    clients.openWindow('https://app.uggsm.ru')
    notification.close()
  }
})

workbox.core.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
