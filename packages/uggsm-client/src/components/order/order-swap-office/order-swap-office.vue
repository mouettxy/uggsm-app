<template>
  <ug-responsive-menu
    v-if="$can('editOrderOffice', 'Global')"
    :menu-props="{ 'close-on-content-click': false, bootm: true }"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item v-for="office in offices" :key="office.id" @click="handleOfficeClick(office.code)">
          <v-list-item-content>
            <v-list-item-title>{{ office.code }}|{{ office.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="pa-2 text-subtitle-1">
              <ug-base-switch
                v-model="duplicate"
                class="ug-order-swap-office__duplicate mt-0"
                label="Дублировать"
              ></ug-base-switch>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </ug-responsive-menu>
</template>

<script>
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch'

import OfficeAPI from '@/api/office'
import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-order-swap-office',

  components: {
    UgBaseSwitch,
    UgResponsiveMenu,
  },

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },

  data: () => ({
    duplicate: false,
    offices: [],
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  mounted() {
    this.getOffices()
  },

  methods: {
    async getOffices() {
      const response = await OfficeAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить офисы')
        return
      }

      this.offices = response.data
    },

    async handleOfficeClick(officeCode) {
      const request = {
        office: officeCode,
        duplicate: this.duplicate,
        userid: this.user.id,
      }

      const response = await OrderAPI.setOffice(this.orderId, request)

      if (response.status !== 200) {
        this.$notification.error('Ошибка при изменении офиса')
        return
      }

      this.$notification.success('Офис успешно изменён')
    },
  },
}
</script>

<style lang="sass">
.ug-order-swap-office__duplicate
  .v-label
    font-size: 1rem
</style>
