<template lang="pug">
#print-warranty(style='width: 100%')
  table(style='width: 100%; border: 1px solid black; border-collapse: collapse;')
    tr(style='border: 1px solid black')
      td(
        style='text-align: left; font-weight: bold; font-size: 20px; border: 1px solid black; border-collapse: collapse;'
      )
        p(style='margin: 0') Заказ №{{ orderId }}
        p(style='margin: 0') Создан: {{ createdAtFormatted }}
        p(style='margin: 0')
          span Выдан:
          span(
            style='margin-left: 5px; margin-right:5px; width: 80px; border-bottom: 2px solid; display: inline-block'
          )
          span {{ year }}
      td(style='text-align: right; border: 1px solid black; border-collapse: collapse;')
        p(style='margin: 0') ИП Гергишан Андрей Владимирович.
        p(style='margin: 0') ИНН: 262410115637
        p(style='margin: 0') ОГРНИП:314231108300081.
        p(style='margin: 0') ул. Гаврилова 100.
        p(style='margin: 0') Моб.: +7 (996) 407-61-78
  div(style='font-size: 14px')
    p(style='margin: 0') Заказчик: {{ customerName }}, {{ customerPhoneFormatted }} Устройство: {{ phoneModel }} Серийный номер: {{ serialNumber }}
    p(style='margin: 0') Дефект со слов заказчика: {{ declaredDeffect }}
    p(style='margin: 0') Телефон для связи: +7 (996) 407-61-78
    p(style='margin: 0') Гарантия 30 дней только на выполненную работу и замененные запчасти. Механические повреждения, царапины, сколы, вмятины, стороннее вмешательство и попадание жидкости не являются гарантийным случаем. Все споры урегулируются в претензионном или ином досудебном порядке, что предусмотрено: ч. 5 ст. 4 АПК РФ, абз. 7 ст. 132 ГПК РФ, ч. 3 ст. 4 КАС РФ.
    p(style='margin: 0; text-decoration: underline') Телефон руководителя: +7 (989) 265-88-28
  table(style='width: 100%; border: 1px solid black; border-collapse: collapse;')
    thead
      tr(style='border: 1px solid black')
        td(style='border: 1px solid black; border-collapse: collapse; padding: 8px; font-size: 14px') Выполненные работы
        td(style='border: 1px solid black; border-collapse: collapse; padding: 8px; font-size: 14px') Стоимость
    tbody
      tr(style='border: 1px solid black')
        // U+2800 here
        td(style='border: 1px solid black; border-collapse: collapse; padding: 8px') ⠀
        // U+2800 here
        td(style='border: 1px solid black; border-collapse: collapse; padding: 8px') ⠀
  div(style='font-size: 14px')
    p(style='margin: 0') Работы выполнены в полном объеме, качество проверено. Заказчик к исполнителю претензийне имеет.
  br
  table(style='width: 100%; font-size: 14px')
    tr
      td
        span Забрал(а) из ремонта {{ customerName }}
        span(style='margin-left: 5px; width: 60px; border-bottom: 2px solid; display: inline-block')
      td
        span Выдал(а)
        span(style='margin-left: 5px; margin-right:5px; width: 60px; border-bottom: 2px solid; display: inline-block')
        span (роспись)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import moment from 'moment'

@Component
export default class MPrintWarranty extends Vue {
  @Prop({ required: true, type: [String, Number] }) orderId!: string | number
  @Prop({ required: true, type: [String] }) createdAt!: string
  @Prop({ required: true, type: [String] }) customerName!: string
  @Prop({ required: true, type: [String] }) customerPhone!: string
  @Prop({ required: true, type: [String] }) phoneModel!: string
  @Prop({ required: true, type: [String] }) serialNumber!: string
  @Prop({ required: true, type: [String] }) declaredDeffect!: string

  get year() {
    return new Date().getFullYear()
  }

  get customerPhoneFormatted() {
    return this.customerPhone
  }

  get createdAtFormatted() {
    return moment(this.createdAt).locale('ru').format('DD MMMM YYYY')
  }
}
</script>

<style lang="sass"></style>
