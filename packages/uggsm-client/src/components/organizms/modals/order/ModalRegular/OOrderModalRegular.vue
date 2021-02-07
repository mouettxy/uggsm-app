<template lang="pug">
.order-modal-new
  a-fullscreen-modal-2(v-model='modal')
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
    v-container.order-modal-content(fluid)
      v-row(
        v-if='order',
        no-gutters
      )
        v-col(
          cols='12',
          md='8',
          lg='8'
        )
          o-order-modal-regular-content(:order='order')
        v-col(cols='4')
          o-order-modal-regular-workflow(:order='order')

    v-footer.order-modal-footer
      v-btn.mr-2(
        :disabled='!$can("edit", "Order")',
        @click='update',
        color='primary'
      )
        v-icon(left) mdi-content-save-edit
        span Обновить
      v-btn(
        @click='rewind',
        text
      )
        v-icon(left) mdi-close
        span Закрыть
      template(v-if='order')
        template(v-if='order.payed')
          v-list-item.d-inline-block(style='flex: 0 0 0')
            v-list-item-content
              v-list-item-title {{ order.declaredPrice }} руб.
              v-list-item-subtitle Оплачено
</template>

<script lang="ts">
import { ordersModule } from '@/store'
import { Order } from '@/typings/api/order'
import { Socket } from 'vue-socket.io-extended'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class OOrderModalRegular extends Vue {
  @Prop() orderid!: string | number

  public modal = false
  public order: Order | null = null

  @Watch('modal')
  async onModalStateChange(modal: boolean) {
    if (modal) {
      this.getOrder()
    } else {
      this.order = null
    }
  }

  rewind(rewindModel = true) {
    this.modal = false
    this.order = null
  }

  async getOrder() {
    if (this.orderid && this.modal) {
      this.order = await ordersModule.getOrder(this.orderid)

      if (!this.order) {
        this.$notification.error('Не удалось получить заказ')
        this.modal = false
      }
    }
  }

  @Socket('update order')
  async onSocketUpdateOrder(model: number) {
    if (model === this.order?.id && this.modal) {
      this.order = await ordersModule.getOrder(model)
    }
  }

  async update() {
    if (this.order) {
      const response = await ordersModule.updateOrder({
        model: this.order,
      })

      if (response) {
        this.rewind()
      }
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 48px)
$height-payed: calc(100vh - 70px)

.order-modal-content
  padding: 0 !important
  height: $height !important
  overflow: hidden
  &--payed
    height: $height-payed

.order-modal-header
  padding: 12px
</style>
