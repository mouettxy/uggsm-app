<template>
  <div id="print-adversitement" style="width: 100%">
    <div style="font-size: 14px; text-align: center">
      <span>Здравствуйте, {{ customerName }}!</span>
    </div>
    <div style="font-size: 14px">
      <h2>Оставьте 1 отзыв - получите бонус, 100 рублей на телефон.</h2>
      <p>
        1. Вам достаточно оставить один отзыв о нас, на выбор и сообщить об этом на почту:
        <strong>&nbsp;ЯНДЕКС www.ya.ru/maps | ГУГЛ www.google.com/maps | 2GIS www.2gis.ru&nbsp;</strong>
        <span>
          в поиске ввеcти taggsmru, перейти в раздел отзывы, написать Ваше мнение о нас, в конце отзывауказать цифру
        </span>
        <span style="text-decoration: underline">&nbsp;{{ orderId }}&nbsp;</span>
        <span>, чтобы идентифицировать Вас.</span>
      </p>
      <p>
        2. Получить бонус. На почту taggsmotziv@gmail.com необходимо написать: {{ orderId }}, ОТЗЫВ РАЗМЕСТИЛ(А) на ...
        (яндексе, google или 2gis) И НОМЕР МОБИЛЬНОГО ТЕЛЕФОНАДЛЯ ПЕРЕВОДА......
      </p>
      <p>
        Деньги поступят на указанный номер телефона в течении 3 рабочих дней с момента опубликования отзыва. Для
        получения бонуса, использовать номер заказа можно только 1 раз, на любом из указанных онлайн сервисов (Яндексе,
        Google, 2Gis). Благодаря Вашим отзывам, мы сможем:
      </p>
      <p style="margin: 0">— оперативно отреагировать на вашу личную просьбу или проблему;</p>
      <p style="margin: 0">— показать объективные мнения о нашем сервисе другим посетителям;</p>
      <p>— значительно улучшить работу компании благодаря вашим ценным комментариям, отзывам и идеям.</p>
      <p>Спасибо, что воспользовались услугами нашей компании! Ваше мнение нам Важно!!!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ug-print-adversitement',

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },

    createdAt: {
      required: false,
      type: [String, Number],
      default: '',
    },

    customerName: {
      required: false,
      type: [String, Number],
      default: '',
    },

    customerPhone: {
      required: false,
      type: [String, Number],
      default: '',
    },

    phoneModel: {
      required: false,
      type: [String, Number],
      default: '',
    },

    serialNumber: {
      required: false,
      type: [String, Number],
      default: '',
    },

    declaredDeffect: {
      required: false,
      type: [String, Number],
      default: '',
    },

    password: {
      required: false,
      type: [String, Number],
      default: '',
    },

    appearance: {
      required: false,
      type: [String, Number],
      default: '',
    },

    kit: {
      required: false,
      type: [String, Number],
      default: '',
    },

    estimatedCloseAt: {
      required: false,
      type: [String, Number],
      default: '',
    },

    declaredPrice: {
      required: false,
      type: [String, Number],
      default: 0,
    },

    avance: {
      required: false,
      type: [String, Number],
      default: 0,
    },
  },

  computed: {
    year() {
      return new Date().getFullYear()
    },

    customerPhoneFormatted() {
      return this.customerPhone
    },
  },
}
</script>

<style lang="sass"></style>
