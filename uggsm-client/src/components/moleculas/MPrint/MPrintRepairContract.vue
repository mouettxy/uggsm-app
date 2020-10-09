<template lang="pug">
#print-repair-contract(style='width: 100%')
  div(style='font-size: 14px; text-align: right')
    p(style='margin: 0') ИП Гергишан Андрей Владимирович. ИНН: 262410115637 ОГРНИП: 314231108300081
    p(style='margin: 0') г.Краснодар, ул. Гаврилова 100. Пн.-вс.:с 9 до 19 ч. Без выходных.
  div(style='font-size: 14px; text-align: center; text-decoration: underline')
    span Договор приема на ремонт электроники
      strong &nbsp;№{{ orderId }}&nbsp;
      span от {{ createdAtFormatted }}
  div(style='font-size: 14px;')
    span(style='text-indent: 20px') Я, {{ customerName }}, {{ customerPhoneFormatted }}, сдал на ремонт {{ phoneModel }},sn {{ serialNumber }}, пароль {{ password }}. Имеющий {{ appearance }}. Комплектация: {{ kit }}. С моих слов неисправность: {{ declaredDeffect }}. Ориентировочно дата ремонта {{ estimatedCloseAt }}, стоимость {{ declaredPrice }} руб. Аванс {{ avance }}.
  div(style='font-size: 14px')
    span(style='font-weight: bold; text-decoration: underline') УЗНАТЬ, ЧТО С ЗАКАЗОМ, ВОПРОСЫ по номеру +7 (996) 407 61 78
  div(style='font-size: 14px')
    p(style='margin: 0; text-indent: 20px') Я прочитал(а) и согласен(а), что в процессе ремонта устройство может прийти в негодность (скрытые последствия падений, попадания влаги, прошивки, неисправной микросхемы памяти). Даю своё согласие на смс уведомления. Влагостойкости после ремонта НЕТ.
      strong &nbsp;Оплата за наличный расчёт по факту выполнения ремонта.
    p(style='margin: 0') В случае утери квитанции, устройство выдается по предъявлению паспорта. Договор составлен в 2х одинаковых экземплярах.
      strong &nbsp;Срок бесплатного хранения аппарата 30 дней с ориентировочной даты готовности. По окончании этого срокасумма хранения 50р. сутки. По истечении 50 дней устройство выставляется на аукцион ст.897ст.899 ГК РФ.Все споры урегулируются в претензионном или ином досудебном порядке, что предусмотрено: ч. 5 ст.4 АПК РФ, абз. 7 ст. 132 ГПК РФ, ч. 3 ст. 4 КАС РФ. Телефон руководителя: +7 (989) 265-88-28. Роспись клиента это согласие с условиями и данными в договоре!
  br
  table(style='width: 100%; font-size: 14px')
    tr
      td
        span Забрал(а) из ремонта {{ customerName }}
        span(style='margin-left: 5px; width: 60px; border-bottom: 2px solid; display: inline-block')
      td
        span Телефон выдал(а)
        span(style='margin-left: 5px; margin-right:5px; width: 60px; border-bottom: 2px solid; display: inline-block')
        span (роспись)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import moment from 'moment'

@Component
export default class MPrintRepairContract extends Vue {
  @Prop({ type: [String, Number] }) orderId!: string | number
  @Prop({ type: [String, Number] }) createdAt!: string
  @Prop({ type: [String, Number] }) customerName!: string
  @Prop({ type: [String, Number] }) customerPhone!: string
  @Prop({ type: [String, Number] }) phoneModel!: string
  @Prop({ type: [String, Number] }) serialNumber!: string
  @Prop({ type: [String, Number] }) declaredDeffect!: string
  @Prop({ type: [String, Number] }) password!: string
  @Prop({ type: [String, Number] }) appearance!: string
  @Prop({ type: [String, Number] }) kit!: string
  @Prop({ type: [String, Number] }) estimatedCloseAt!: string
  @Prop({ type: [String, Number] }) declaredPrice!: string
  @Prop({ type: [String, Number] }) avance!: string

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
