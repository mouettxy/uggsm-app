<template lang="pug">
#print-adversitement(style='width: 100%')
  div(style='font-size: 14px; text-align: center')
    span Здравствуйте, {{ customerName }}!
  div(style='font-size: 14px;')
    h2 Оставьте 1 отзыв - получите бонус, 100 рублей на телефон.
    p 1. Вам достаточно оставить один отзыв о нас, на выбор и сообщить об этом на {{ bonusType }}:
      strong &nbsp;ЯНДЕКС www.ya.ru/maps | ГУГЛ www.google.com/maps | 2GIS www.2gis.ru&nbsp;
      span в поиске ввеcти {{ bonusTarget }}, перейти в раздел отзывы, написать Ваше мнение о нас, в конце отзыва указать цифру
      span(style='text-decoration: underline') &nbsp;{{ orderId }}&nbsp;
      span , чтобы идентифицировать Вас.
    p 2. Получить бонус. На {{ bonusText }} необходимо написать: {{ orderId }}, ОТЗЫВ РАЗМЕСТИЛ(А) на ... (яндексе, google или 2gis) И НОМЕР МОБИЛЬНОГО ТЕЛЕФОНАДЛЯ ПЕРЕВОДА......
    p Деньги поступят на указанный номер телефона в течении 3 рабочих дней с момента опубликования отзыва. Для получения бонуса, использовать номер заказа можно только 1 раз, на любом из указанных онлайн сервисов (Яндексе, Google, 2Gis). Благодаря Вашим отзывам, мы сможем:
    p(style='margin: 0') — оперативно отреагировать на вашу личную просьбу или проблему;
    p(style='margin: 0') — показать объективные мнения о нашем сервисе другим посетителям;
    p — значительно улучшить работу компании благодаря вашим ценным комментариям, отзывам и идеям.
    p Спасибо, что воспользовались услугами нашей компании! Ваше мнение нам Важно!!!
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class MPrintAdversitement extends Vue {
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

  @Prop({ type: [String], default: 'почту taggsmotziv@gmail.com' }) bonusText!: string

  @Prop({ type: [String], default: 'почту' }) bonusType!: string

  @Prop({ type: [String], default: 'taggsmru' }) bonusTarget!: string

  get year() {
    return new Date().getFullYear()
  }

  get customerPhoneFormatted() {
    return this.customerPhone
  }
}
</script>

<style lang="sass"></style>
