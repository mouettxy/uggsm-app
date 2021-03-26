<template lang="pug">
v-app
  v-main.ug-main(:class='{ "ug-main--mobile": isMobile }')
    v-snackbar(
      v-model='snackWithButtons',
      timeout='-1',
      left,
      bottom
    )
      | {{ snackWithBtnText }}
      template(v-slot:action='{ attrs }')
        v-btn(
          v-bind='attrs',
          @click.stop='refreshApp',
          text,
          color='#00f500'
        )
          | {{ snackBtnText }}
    router-view
</template>

<script>
import { settingsModule } from './store'
import Responsive from '@/mixins/responsive'
import { mapMutations } from 'vuex'

export default {
  name: 'app',

  mixins: [Responsive],

  data: () => ({
    refreshing: false,
    registration: null,
    snackBtnText: '',
    snackWithBtnText: '',
    snackWithButtons: false,
  }),

  computed: {
    header() {
      return this.$route.meta.header || 'UGGSM | Контент загружается ...'
    },
  },

  watch: {
    header: function (header) {
      document.title = header
    },
  },

  created() {
    this.registerNotifications()

    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.refreshing) return
        this.refreshing = true
        window.location.reload()
      })
    }
  },

  mounted: function () {
    settingsModule.setSearch({ search: '', type: this.$route.name })
  },

  methods: {
    ...mapMutations({
      setUserNotifications: 'settings/SET_NOTIFICATIONS',
    }),

    showRefreshUI(e) {
      this.sendUpdateNotification()

      this.registration = e.detail
      this.snackBtnText = 'Обновить'
      this.snackWithBtnText = 'Доступно обновление!'
      this.snackWithButtons = true
    },

    async registerNotifications() {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        this.setUserNotifications(true)
        return true
      }

      this.setUserNotifications(false)
      return false
    },

    async sendUpdateNotification() {
      if (Notification.permission == 'granted') {
        const registration = await navigator.serviceWorker.getRegistration()

        registration.showNotification('Доступно обновление!')
      }
    },

    refreshApp() {
      this.snackWithButtons = false
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return
      }

      this.registration.waiting.postMessage('skipWaiting')
    },
  },
}
</script>

<style lang="sass">
@import '@/sass/global.sass'
.notificationCenter.topRight
  z-index: 999999

.ug-main
  padding-left: 48px !important
  &.ug-main--mobile
    padding-left: 0 !important
    padding-top: 48px !important
</style>
