<template>
  <div class="modal-order-info">
    <v-slide-x-transition appear>
      <v-row v-if="hasMasterField">
        <v-col cols="12">
          <ug-base-alert class="mb-0" persistent type="error">
            Не заполнено поле "Мастер", назначьте мастера для корректной работы с заявкой
          </ug-base-alert>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-slide-x-transition appear>
      <v-row v-if="hasManagerField">
        <v-col cols="12">
          <ug-base-alert class="mb-0" persistent type="error">
            Не заполнено поле "Менеджер", назначьте менеджера для корректной работы с заявкой
          </ug-base-alert>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-expand-transition>
      <v-row v-if="!modelLoaded" key="loading">
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-skeleton-loader min-height="36" type="list-item"></v-skeleton-loader>
        </v-col>
      </v-row>
      <div v-else key="loaded">
        <ug-modal-order-info-fields :order.sync="orderModel"></ug-modal-order-info-fields>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import UgModalOrderInfoFields from '@/components/order/modal-order/modal-order-info/modal-order-info-fields/modal-order-info-fields'
import UgBaseAlert from '@/components/base/ui/base-alert/base-alert'

export default {
  name: 'ug-modal-order-info',

  components: {
    UgBaseAlert,
    UgModalOrderInfoFields,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    modelLoaded() {
      return this.order && !!Object.keys(this.order).length
    },

    hasMasterField() {
      // while order is loading we dont show anything
      if (!this.modelLoaded) {
        return false
      }

      // but if we have loaded model and incoreect field we return truthy value
      if (!(this.modelLoaded && this.orderModel.master?._id)) {
        return true
      }

      return false
    },

    hasManagerField() {
      // while order is loading we dont show anything
      if (!this.modelLoaded) {
        return false
      }

      // but if we have loaded model and incoreect field we return truthy value
      if (!(this.modelLoaded && this.orderModel.manager?._id)) {
        return true
      }

      return false
    },

    orderModel: {
      get() {
        return this.order
      },

      set(value) {
        this.$emit('update:order', value)
      },
    },
  },
}
</script>
