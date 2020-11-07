<template lang="pug">
.order-modal-content
  header.order-modal-content__header
    template(v-if='order')
      .text-h5.pa-2 Заказ № {{ order.id }}
      v-tooltip(bottom)
        template(#activator='{on, attrs}')
          .text-h5(style='padding: 5px')
            v-btn(
              v-on='on',
              v-bind='attrs',
              small,
              color='primary'
            ) {{ order.office.code }}
        span {{ order.office.name }}
      .text-h5.pa-1
        m-order-status-switcher(
          :status='order.status',
          :orderid='order.id'
        )
      v-tooltip(bottom)
        template(#activator='{on, attrs}')
          .text-h5(style='padding: 5px')
            v-btn(
              v-on='on',
              v-bind='attrs',
              small,
              color='grey'
            ) {{ order.password }}
        span Пароль
      v-tooltip(bottom)
        template(#activator='{on, attrs}')
          .text-h5(style='padding: 5px')
            v-btn(
              v-on='on',
              v-bind='attrs',
              small,
              color='success'
            ) {{ order.orderType }}
        span Тип заказа
      m-order-time-label(
        :time='order.estimatedCloseAt',
        :style='{ paddingTop: "5px" }',
        :orderid='order.id',
        :order-status='order.status',
        path='estimatedCloseAt',
        editable
      )

  template(v-if='order')
    v-tabs(v-model='currentTab')
      v-tab(key='information') Информация о заказе
      v-tab(key='works') Работы и материалы
      v-tab(key='payments') Платежи
    v-tabs-items(
      v-model='currentTab',
      touchless
    )
      v-tab-item.order-modal-content__item(key='information')
        .order-modal-content__item__content(
          :class='{ "order-modal-content__item__content--payed": order ? order.payed : false }'
        )
          o-order-modal-regular-fields(v-model='order')
      v-tab-item.order-modal-content__item(key='works')
        .order-modal-content__item__content(
          :class='{ "order-modal-content__item__content--payed": order ? order.payed : false }'
        )
          o-order-modal-regular-works(:order='order')

      v-tab-item.order-modal-content__item(key='payments')
        .order-modal-content__item__content(
          :class='{ "order-modal-content__item__content--payed": order ? order.payed : false }'
        )
          o-order-modal-regular-cash(:order='order')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ordersModule } from '@/store'
import { Order } from '@/typings/api/order'

@Component
export default class OOrderModalRegularContent extends Vue {
  @Prop({ default: null }) order!: Order | null

  public currentTab = 0
}
</script>

<style lang="sass">
.order-modal-content
  height: 100%
  &__loading
    display: flex
    justify-content: center
    align-items: center
  &__header
    display: flex
  &__item
    padding-left: 0px
    padding-right: 0px

    &__content
      padding: 6px
      overflow-y: scroll
      height: calc(100vh - 140px)
      box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important
      &--payed
        height: calc(100vh - 174px)
</style>
