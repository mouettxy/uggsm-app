<template>
  <v-snackbar v-model="notification" timeout="-1" top centered>
    <span>Доступно обновление!</span>
    <template #action="{ attrs }">
      <ug-base-btn v-bind="attrs" text color="#00f500" label="Обновить" @click.stop="handleClick"></ug-base-btn>
    </template>
  </v-snackbar>
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import { UPDATE_APP_EVENT } from '@/services/notificationService'

export default {
  name: 'ug-notification-app-update',

  components: {
    UgBaseBtn,
  },

  data: () => ({
    registration: null,
    refreshing: false,
    notification: false,
  }),

  created() {
    document.addEventListener(UPDATE_APP_EVENT, this.showNotification)

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.refreshing) {
          return
        }

        this.refreshing = true
        window.location.reload()
      })
    }
  },

  methods: {
    handleClick() {
      this.refreshApplication()
    },

    refreshApplication() {
      this.notification = false
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return
      }

      this.registration.waiting.postMessage('skipWaiting')
    },

    showNotification(e) {
      this.registration = e.detail
      this.notification = true
    },
  },
}
</script>
