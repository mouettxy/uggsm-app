<template lang="pug">
#ug-office-switcher.ug-office-switcher
  template(v-if='isLoading')
    v-chip(
      label,
      color='warning'
    )
      v-progress-circular(
        small,
        size='16',
        indeterminate,
        color='accent'
      )
      span.pl-2.accent--text Загрузка...
  template(v-else)
    ug-responsive-menu(:menu-props='{ right: true, "min-width": 1, "content-class": "ug-office-switcher__menu" }')
      template(#activator='{on, attrs}')
        template(v-if='!currentOffice')
          v-chip(
            v-on='on',
            v-bind='attrs',
            label,
            color='error'
          )
            span Выберите офис
        template(v-else)
          .ug-office-switcher-item__wrapper(
            v-on='on',
            v-bind='attrs'
          )
            ug-office-switcher-item(
              :name='currentOffice.name',
              :color='nameColor',
              :codeColor='codeColor',
              :code='currentOffice.code',
              rounded
            )
      template(v-if='allowedOffices.length')
        template(v-for='allowedOffice in allowedOffices')
          ug-office-switcher-item(
            v-if='allowedOffice.name !== currentOffice.name',
            :name='allowedOffice.name',
            :color='getOfficeColor(allowedOffice)',
            :codeColor='codeColor',
            :code='allowedOffice.code',
            @click='selectOffice',
            fill-name-width
          )
      template(v-else)
        v-card
          v-card-text
            span.error--text Нет доступных офисов
</template>

<script>
import UgOfficeSwitcherItem from './office-switcher-item/office-switcher-item'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import OfficeAPI from '@/api/office'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ug-office-switcher',

  components: {
    UgOfficeSwitcherItem,
    UgResponsiveMenu,
  },

  props: {
    codeColor: {
      required: false,
      type: String,
      default: 'secondary',
    },

    nameColor: {
      required: false,
      type: String,
      default: 'accent',
    },
  },

  data: function () {
    return {
      offices: [],
      isLoading: true,
      currentOffice: null,
    }
  },

  computed: {
    ...mapState({
      selectedOffice: (state) => state.settings.office,
      user: (state) => state.auth.user,
    }),

    allowedOffices() {
      if (this.offices) {
        return this.offices.filter((e) => this.$can('seeOffices', 'Global', e.name))
      }

      return []
    },

    allowedOfficesLength() {
      return this.allowedOffices.length
    },
  },

  watch: {
    allowedOfficesLength: function () {
      this.checkOfficeAbility()
    },
  },

  mounted: function () {
    this.init()
  },

  methods: {
    ...mapActions({
      setOffice: 'settings/setOffice',
    }),

    async fetchOffices() {
      const response = await OfficeAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error('Ошибка при получении списка офисов')
        return
      }

      this.offices = response.data
    },

    getOfficeColor(office) {
      if (this.user && this.user.office.code === office.code) {
        return 'green'
      }

      if (office.color) {
        return office.color
      }

      return this.nameColor
    },

    setCurrentOffice() {
      this.setOffice(this.currentOffice)
      this.$emit('office-select', this.currentOffice)
    },

    selectOffice(office) {
      const selectedOffice = this.offices.find((e) => e.code === office.code)

      if (selectedOffice) {
        this.currentOffice = selectedOffice

        this.setCurrentOffice()
      } else {
        this.$notification.error('Ошибка при выборе офиса')
      }
    },

    checkOfficeAbility() {
      if (this.currentOffice) {
        if (!this.$can('seeOffices', 'Global', this.currentOffice.name)) {
          if (this.allowedOffices) {
            this.currentOffice = this.allowedOffices[0]

            this.setCurrentOffice()
          } else {
            this.currentOffice = null

            this.setCurrentOffice()
          }
        }
      }
    },

    async searchForDefaultOffice() {
      if (this.selectedOffice) {
        this.currentOffice = this.selectedOffice
      } else if (this.user && this.user.office) {
        this.currentOffice = this.user.office

        this.setCurrentOffice()
      }
    },

    async init() {
      this.isLoading = true

      await this.fetchOffices()

      await this.searchForDefaultOffice()

      this.checkOfficeAbility()

      this.isLoading = false
    },
  },
}
</script>

<style lang="sass">
.ug-office-switcher
  display: inline-block
  position: relative
  .ug-office-switcher__menu
    display: flex
    flex-direction: column
</style>
