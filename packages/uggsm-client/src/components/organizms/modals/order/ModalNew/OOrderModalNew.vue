<template lang="pug">
.order-modal-new
  ug-modal-right(v-model='modal')
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
    v-container.order-modal-content(
      v-if='modal',
      fluid
    )
      .order-modal-header.softgrey
        h5.text-h5 Новый заказ
      .order-modal-content__body
        o-order-modal-new-fields(v-model='model')
    v-footer.order-modal-footer
      v-btn.mr-2(
        @click='create',
        color='primary'
      )
        v-icon(left) mdi-content-save
        span Создать
      v-btn(
        @click='rewind',
        text
      )
        v-icon(left) mdi-close
        span Закрыть
</template>

<script lang="ts">
import UgModalRight from '@/components/base/ui/modal-right/modal-right.vue'
import { ordersModule } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    UgModalRight,
  },
})
export default class OOrderModalNew extends Vue {
  public modal = false

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

  rewind(rewindModel = true) {
    this.modal = false
    if (rewindModel) {
      this.model = {
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
    }
  }

  checkModel(model: any) {
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

  async create() {
    const response = await ordersModule.createOrder({
      model: this.model,
      comparator: this.checkModel(this.model),
    })

    if (response) {
      this.rewind()
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 48px)
$height-body: calc(100vh - 96px)

.order-modal-content
  padding: 0 !important
  height: $height !important
  overflow: hidden
  .order-modal-content__body
    overflow-y: scroll
    height: $height-body

.order-modal-header
  padding: 12px
</style>
