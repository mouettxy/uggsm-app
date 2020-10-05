<template lang="pug">
.order-modal
  a-right-modal(title='Новая заявка', :active='active')
    template(#activator='{click}')
      template(v-if='!btnHided')
        v-btn(@click='click', color='primary')
          v-icon(left) mdi-plus
          span Новый

    template(#content='{close}')
      v-container.order-modal__container
        v-row(no-gutters)
          v-col.order-modal__container-item(cols='9')
            m-order-modal-content(v-model='model', :new-order='newOrder')
          v-col.order-modal__container-item(cols='3')
            m-order-modal-workflow(:new-order='newOrder')
      v-footer.order-modal-footer
        template(v-if='newOrder')
          v-btn.mr-2(color='primary', @click='createOrder(close)')
            v-icon(left) mdi-content-save
            span Создать
          v-btn(text, :to='{ name: "orders" }')
            v-icon(left) mdi-close
            span Закрыть
        template(v-else)
          v-btn.mr-2(color='primary', @click='updateOrder(close)')
            v-icon(left) mdi-content-save-edit
            span Обновить
          v-btn(text, :to='{ name: "orders" }')
            v-icon(left) mdi-close
            span Закрыть
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import { ordersModule, settingsModule } from '@/store'

@Component
export default class MOrderModal extends Vue {
  @Prop({ default: true, type: Boolean }) newOrder: any
  @Prop({ default: null, type: Number }) orderid: any
  @Prop(Boolean) active: any
  @Prop(Boolean) btnHided: any

  get order() {
    return ordersModule.currentOrder
  }

  public model = {
    orderType: 'Платный',
    estimatedCloseAt: '',
    customerName: '',
    customerPhone: '',
    password: '',
    serialNumber: '',
    declaredDefect: '',
    declaredPrice: '',
    phoneBrand: '',
    phoneModel: '',
    appearance: '',
    kit: '',
    quick: false,
    master: '',
    manager: '',
  }

  checkOrder(model: any) {
    if (!model.orderType) {
      this.$notification.error('Заполните поле "Тип Заказа"')
      return false
    } else if (!model.customerName) {
      this.$notification.error('Заполните поле "Имя клиента"')
      return false
    } else if (!model.customerPhone) {
      this.$notification.error('Заполните поле "Номер телефона"')
      return false
    } else if (!model.declaredDefect) {
      this.$notification.error('Заполните поле "Первичная неисправность"')
      return false
    } else if (!model.phoneBrand) {
      this.$notification.error('Заполните поле "Бренд телефона"')
      return false
    } else if (!model.phoneModel) {
      this.$notification.error('Заполните поле "Модель телефона"')
      return false
    } else if (!model.appearance) {
      this.$notification.error('Заполните поле "Внешний вид"')
      return false
    } else if (!model.kit) {
      this.$notification.error('Заполните поле "Комплектация"')
      return false
    } else if (!model.master) {
      this.$notification.error('Заполните поле "Мастер"')
      return false
    } else if (!model.manager) {
      this.$notification.error('Заполните поле "Менеджер"')
      return false
    }

    return true
  }

  async createOrder(close: Function) {
    if (this.checkOrder(this.model)) {
      if (settingsModule.office) {
        const sendedOrder = await ordersModule.createOrder({ ...this.model, office: settingsModule.office })

        if (sendedOrder) {
          this.$notification.success('Заказ успешно создана')
          close()
        } else {
          this.$notification.error('Ошибка при создании заказа')
        }
      } else {
        this.$notification.error('Выберите офис')
      }
    }
  }

  async updateOrder() {
    //
  }

  async mounted() {
    if (!this.newOrder && this.$route.params?.id) {
      await ordersModule.getOrder(this.$route.params.id)
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 48px)

.order-modal__container
  height: $height
  overflow: hidden
  .order-modal__container-item
    padding: 0 !important
</style>
