export const UPDATE_APP_EVENT = 'ugSwUpdate'
export const UPDATE_APP_INTERVAL = 1000 * 60 * 5 // 5 minutes

export const getNotificationAccess = () => {
  return Notification.permission == 'granted'
}

export const requestNotificationAccess = async () => {
  await Notification.requestPermission()

  return getNotificationAccess()
}

export const sendNotification = async (title, options, reg = null) => {
  const tryToSend = async (notificationAccess, title, options) => {
    if (notificationAccess) {
      if (!reg) {
        reg = await navigator.serviceWorker.getRegistration()
      }

      reg.showNotification(title, options)
      return true
    }

    return false
  }

  const notificationAccess = getNotificationAccess()

  if (tryToSend(notificationAccess, title, options)) {
    return true
  }

  const requestedAccess = await requestNotificationAccess()

  if (tryToSend(requestedAccess, title, options)) {
    return true
  }

  return false
}
