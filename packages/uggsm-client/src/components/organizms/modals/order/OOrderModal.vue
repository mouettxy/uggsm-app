<template lang="pug">
.order-modal
  a-fullscreen-modal-2(v-model='modal')
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
        v-btn(
          v-on='on',
          v-bind='attrs',
          color='primary'
        )
          span {{ orderid }}

    template(#content)
      v-container.order-modal__container(
        :class='{ "order-modal__container--payed": order ? order.payed : false }',
        fluid
      )
        v-row(no-gutters)
          v-col.order-modal__container-item(cols='8')
            o-order-modal-content(
              :order='order',
              :new-order='newOrder',
              :model='model'
            )
          v-col.order-modal__container-item(cols='4')
            o-order-modal-workflow(
              :order='order',
              :new-order='newOrder'
            )
      v-footer.order-modal-footer
        template(v-if='newOrder')
          v-btn.mr-2(
            @click='createOrder(close)',
            color='primary'
          )
            v-icon(left) mdi-content-save
            span Создать
          v-btn(
            @click='close',
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
            @click='close',
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { ordersModule, settingsModule, cashModule } from '@/store'
import { cloneDeep } from 'lodash'
import { User } from '@/typings/api/auth'
import { Office } from '@/typings/api/office'
import { Client } from '@/typings/api/client'
import { Order } from '@/typings/api/order'
import { Socket } from 'vue-socket.io-extended'
import { Cash } from '@/typings/api/cash'

@Component
export default class OOrderModal extends Vue {
  @Prop({ default: true }) newOrder!: boolean
  @Prop({}) orderid!: number | string

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
    appearance: 'царапины и потёртости',
    kit: 'устройство без сим карты, чехла, карты памяти',
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

  async createOrder() {
    if (this.checkOrder(this.model)) {
      if (settingsModule.office) {
        const sendedOrder = await ordersModule.createOrder({ ...this.model, office: settingsModule.office.code })

        if (sendedOrder) {
          this.$notification.success('Заявка успешно создана')

          await ordersModule.sendSmsOnCreated({
            id: sendedOrder.id,
            phone: '8' + sendedOrder.customerPhone || '',
            model: `${sendedOrder.phoneBrand} ${sendedOrder.phoneModel}`,
          })
          this.close()
        } else {
          this.$notification.error('Ошибка при создании заказа')
        }
      } else {
        this.$notification.error('Выберите офис')
      }
    }
  }

  async updateOrder() {
    if (this.order) {
      if (settingsModule.office) {
        const copyOfOrder = cloneDeep(this.order)

        delete copyOfOrder._id
        delete copyOfOrder.__v

        copyOfOrder.master = (copyOfOrder.master._id as unknown) as User
        copyOfOrder.manager = (copyOfOrder.manager._id as unknown) as User
        copyOfOrder.office = (copyOfOrder.office._id as unknown) as Office
        copyOfOrder.customer = (copyOfOrder.customer._id as unknown) as Client

        const sendedOrder = await ordersModule.updateOrder({ id: this.order._id, order: copyOfOrder })

        if (sendedOrder) {
          this.$notification.success('Заявка обновлена успешно')
          this.close()
        } else {
          this.$notification.error('Ошибка при обновлении заявки')
        }
      } else {
        this.$notification.error('Выберите офис')
      }
    }
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

  close() {
    this.order = null
    this.modal = false
  }

  @Socket('update order')
  async onSocketUpdateOrder(model: number) {
    console.log(model)
    if (model === this.order?.id && this.modal) {
      this.order = await ordersModule.getOrder(model)
    }
  }

  mounted() {
    this.getOrder()
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
