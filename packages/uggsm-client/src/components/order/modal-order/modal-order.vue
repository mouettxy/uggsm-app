<template>
  <ug-modal-fullscreen v-model="modal" content-class="ug-modal-order-new">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content v-if="modal" sidebar main-no-padding main-no-scroll>
      <template #header>
        <h5 class="text-h5">Заказ №{{ orderId }}</h5>
        <template v-if="!isMobile">
          <v-tooltip v-if="order" bottom>
            <template #activator="{ on, attrs }">
              <ug-base-chip
                class="d-inline-block"
                :style="{ height: '32px' }"
                v-bind="attrs"
                small
                color="primary"
                v-on="on"
              >
                {{ order.office.code }}
              </ug-base-chip>
            </template>
            <span>{{ order.office.name }}</span>
          </v-tooltip>
          <v-tooltip v-if="order" bottom>
            <template #activator="{ on, attrs }">
              <ug-base-chip
                class="d-inline-block"
                :style="{ height: '32px' }"
                v-bind="attrs"
                small
                color="secondary"
                v-on="on"
              >
                {{ order.password }}
              </ug-base-chip>
            </template>
            <span>Пароль {{ order.password }}</span>
          </v-tooltip>
          <ug-order-status
            v-if="order"
            :style="{ height: '32px' }"
            :status="order.status"
            :orderid="order.id"
          ></ug-order-status>
          <ug-order-edit-time
            v-if="order"
            class="d-inline-block"
            :time="order.estimatedCloseAt"
            :orderid="order.id"
            :order-status="order.status"
            path="estimatedCloseAt"
            editable
          ></ug-order-edit-time>
        </template>
      </template>

      <template #main>
        <v-tabs v-model="currentTab">
          <v-tab v-for="tab in tabs" :key="tab.key">
            <span>{{ tab.title }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab" class="ug-modal-order__tabs ug-scrollbar" touchless>
          <v-tab-item v-for="tab in tabs" :key="tab.key">
            <div class="ug-modal-order__tab">
              <component :is="tab.component" :order.sync="order"></component>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </template>

      <template #sidebar>
        <ug-modal-order-sidebar
          :order-workflow="order ? order.workflow : []"
          :order-calls="order ? order.statusCalls : []"
        ></ug-modal-order-sidebar>
      </template>

      <template #sidebar-toolbar>
        <ug-order-print :order="order">
          <template #activator="{ on, attrs }">
            <ug-base-btn v-bind="attrs" icon="mdi-printer" color="dark" v-on="on"></ug-base-btn>
          </template>
        </ug-order-print>
        <ug-order-swap-office :order-id="orderId">
          <template #activator="{ on, attrs }">
            <ug-base-btn v-bind="attrs" icon="mdi-swap-horizontal-bold" color="dark" v-on="on"></ug-base-btn>
          </template>
        </ug-order-swap-office>
        <ug-order-add-comment :order-id="orderId">
          <template #activator="{ on, attrs }">
            <ug-base-btn v-bind="attrs" icon="mdi-comment-plus" color="dark" v-on="on"></ug-base-btn>
          </template>
        </ug-order-add-comment>
      </template>

      <template #footer>
        <ug-base-btn
          icon-left="mdi-content-save"
          label="Обновить"
          color="primary"
          @click="handleUpdateClick"
        ></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" color="light" @click="handleCloseClick"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-fullscreen>
</template>

<script>
import UgModalFullscreen from '@/components/base/ui/modal-fullscreen/modal-fullscreen'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn.vue'
import UgOrderAddComment from '@/components/order/order-add-comment/order-add-comment'
import UgOrderPrint from '@/components/order/order-print/order-print'
import UgOrderSwapOffice from '@/components/order/order-swap-office/order-swap-office'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgOrderStatus from '@/components/order/order-status/order-status'
import UgModalOrderSidebar from '@/components/order/modal-order/modal-order-sidebar/modal-order-sidebar'
import UgOrderEditTime from '@/components/order/order-edit-time/order-edit-time'
import UgModalOrderInfo from '@/components/order/modal-order/modal-order-info/modal-order-info'
import UgModalOrderWork from '@/components/order/modal-order/modal-order-work/modal-order-work'
import UgModalOrderCash from '@/components/order/modal-order/modal-order-cash/modal-order-cash'

import Responsive from '@/mixins/responsive'
import { mapState } from 'vuex'
import OrderAPI from '@/api/order'

export default {
  name: 'ug-modal-order',

  sockets: {
    ['update order'](id) {
      if (id === this.order?.id && this.modal) {
        this.getOrder()
      }
    },
  },

  components: {
    UgModalFullscreen,
    UgModalContent,
    UgBaseBtn,
    UgModalOrderSidebar,
    UgModalOrderInfo,
    UgModalOrderWork,
    UgModalOrderCash,
    UgOrderAddComment,
    UgOrderPrint,
    UgOrderSwapOffice,
    UgBaseChip,
    UgOrderStatus,
    UgOrderEditTime,
  },

  mixins: [Responsive],

  props: {
    orderId: {
      required: true,
      type: [String, Number],
    },
  },

  data: () => ({
    modal: false,

    order: null,

    currentTab: 0,
    tabs: [
      {
        key: 'info',
        title: 'Заказ',
        component: 'ug-modal-order-info',
      },
      {
        key: 'work',
        title: 'Работы',
        component: 'ug-modal-order-work',
      },
      {
        key: 'cash',
        title: 'Платежи',
        component: 'ug-modal-order-cash',
      },
    ],
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  watch: {
    modal(value) {
      if (value) {
        this.getOrder()
        return
      }

      this.order = null
    },
  },

  methods: {
    rewindModal() {
      this.modal = false
    },

    async getOrder() {
      const response = await OrderAPI.getById(this.orderId)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить заказ')
        this.rewindModal()
        return
      }

      this.order = response.data
    },

    checkOrderModel() {
      if (!this.order.master) {
        this.$notification.error('Заполните поле "Мастер"')
        return false
      } else if (!this.order.manager) {
        this.$notification.error('Заполните поле "Менеджер"')
        return false
      }

      return true
    },

    async updateOrder() {
      const response = await OrderAPI.updateById(this.order._id, {
        ...this.order,
        userid: this.user.id,
      })

      if (response.status !== 200) {
        this.$notification.error('Не удалось обновить заказ')
        return
      }

      this.$notification.success('Заказ успешно обновлён')
    },

    async handleUpdateClick() {
      if (this.checkOrderModel()) {
        this.updateOrder()
      }
    },

    handleCloseClick() {
      this.rewindModal()
    },
  },
}
</script>

<style lang="sass">
.ug-modal-order__tabs
  height: calc(100% - 60px)
  overflow-y: auto
  margin-right: 8px
.ug-modal-order__tab
  padding: 12px
</style>
