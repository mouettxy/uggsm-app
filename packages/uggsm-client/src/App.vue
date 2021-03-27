<template lang="pug">
v-app
  v-main.ug-main(:class='{ "ug-main--mobile": isMobile }')
    ug-notification-app-update
    router-view
</template>

<script>
import UgNotificationAppUpdate from '@/components/notifications/notification-app-update/notification-app-update'
import { settingsModule } from './store'
import Responsive from '@/mixins/responsive'

export default {
  name: 'app',

  components: {
    UgNotificationAppUpdate,
  },

  mixins: [Responsive],

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

  mounted: function () {
    settingsModule.setSearch({ search: '', type: this.$route.name })
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
