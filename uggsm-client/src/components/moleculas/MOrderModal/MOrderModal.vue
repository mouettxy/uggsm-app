<template lang="pug">
.order-modal
  a-right-modal(
    :active='active',
    title='Новая заявка'
  )
    template(#activator='{click}')
      template(v-if='!btnHided')
        v-btn(
          @click='click',
          color='primary'
        )
          v-icon(left) mdi-plus
          span Новый

    template(#content='{close}')
      v-container.order-modal__container(:class='{ "order-modal__container--payed": order ? order.payed : false }')
        v-row(no-gutters)
          v-col.order-modal__container-item(cols='9')
            m-order-modal-content(
              v-model='model',
              :new-order='newOrder'
            )
          v-col.order-modal__container-item(cols='3')
            m-order-modal-workflow(:new-order='newOrder')
      v-footer.order-modal-footer
        template(v-if='newOrder')
          v-btn.mr-2(
            @click='createOrder(close)',
            color='primary'
          )
            v-icon(left) mdi-content-save
            span Создать
          v-btn(
            :to='{ name: "orders" }',
            text
          )
            v-icon(left) mdi-close
            span Закрыть
        template(v-else)
          v-btn.mr-2(
            @click='updateOrder(close)',
            color='primary'
          )
            v-icon(left) mdi-content-save-edit
            span Обновить
          v-btn(
            @click='clearCurrentOrder',
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
import { Component, Vue, Prop } from 'vue-property-decorator'

import { ordersModule, settingsModule, cashModule } from '@/store'
import { cloneDeep } from 'lodash'

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

  clearCurrentOrder() {
    ordersModule.clearOrder()
    cashModule.clearCash()
    this.$router.push({ name: 'orders' })
  }

  async createOrder(close: Function) {
    if (this.checkOrder(this.model)) {
      if (settingsModule.office) {
        const sendedOrder = await ordersModule.createOrder({ ...this.model, office: settingsModule.office.code })

        if (sendedOrder) {
          this.$notification.success('Заявка успешно создана')
          this.clearCurrentOrder()
        } else {
          this.$notification.error('Ошибка при создании заказа')
        }
      } else {
        this.$notification.error('Выберите офис')
      }
    }
  }

  async updateOrder(close: Function) {
    if (this.order) {
      if (settingsModule.office) {
        const copyOfOrder = cloneDeep(this.order)
        delete copyOfOrder._id
        delete copyOfOrder.workflow
        delete copyOfOrder.id
        delete copyOfOrder.__v
        delete copyOfOrder.statusWork
        delete copyOfOrder.statusSms
        delete copyOfOrder.masterComments
        delete copyOfOrder.managerComments
        copyOfOrder.master = copyOfOrder.master._id
        copyOfOrder.manager = copyOfOrder.manager._id
        copyOfOrder.office = copyOfOrder.office._id
        copyOfOrder.customer = copyOfOrder.customer._id

        const sendedOrder = await ordersModule.updateOrder({ id: this.order._id, order: copyOfOrder })

        if (sendedOrder) {
          this.$notification.success('Заявка обновлена успешно')
          this.clearCurrentOrder()
        } else {
          this.$notification.error('Ошибка при обновлении заявки')
        }
      } else {
        this.$notification.error('Выберите офис')
      }
    }
  }

  async mounted() {
    if (!this.newOrder && this.$route.params?.id) {
      await ordersModule.getOrder(this.$route.params.id)
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 50px)
$height-payed: calc(100vh - 70px)

.order-modal__container
  height: $height
  overflow: hidden
  &--payed
    height: $height-payed
  .order-modal__container-item
    padding: 0 !important
</style>
