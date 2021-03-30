<template>
  <div id="print-repair-contract" style="width: 100%">
    <div style="font-size: 14px; text-align: right">
      <p style="margin: 0">ИП Гергишан Андрей Владимирович. ИНН: 262410115637 ОГРНИП: 314231108300081</p>
      <p style="margin: 0">{{ address }}. Пн.-вс.:с 9 до 19 ч. Без выходных.</p>
    </div>
    <div style="font-size: 14px; text-align: center; text-decoration: underline">
      <span>
        Договор приема на ремонт электроники
        <strong>&nbsp;№{{ orderId }}&nbsp;</strong>
        <span>от {{ createdAtFormatted }}</span>
      </span>
    </div>
    <div style="font-size: 14px">
      <span style="text-indent: 20px">
        Я, {{ customerName }}, {{ customerPhoneFormatted }}, сдал на ремонт {{ phoneModel }},sn {{ serialNumber }},
        пароль {{ password }}. Имеющий {{ appearance }}. Комплектация: {{ kit }}. С моих слов неисправность:
        {{ declaredDeffect }}. Ориентировочно дата ремонта {{ estimatedCloseAt }}, стоимость {{ declaredPrice }} руб.
        Аванс {{ avance }}.
      </span>
    </div>
    <div style="font-size: 14px">
      <span style="font-weight: bold; text-decoration: underline">
        УЗНАТЬ, ЧТО С ЗАКАЗОМ, ВОПРОСЫ по номеру +7 (996) 407 61 78
      </span>
    </div>
    <div style="font-size: 14px">
      <p style="margin: 0; text-indent: 20px">
        Я прочитал(а) и согласен(а), что в процессе ремонта устройство может прийти в негодность (скрытые последствия
        падений, попадания влаги, прошивки, неисправной микросхемы памяти). Даю своё согласие на смс уведомления.
        Влагостойкости после ремонта НЕТ.
        <strong>&nbsp;Оплата за наличный расчёт по факту выполнения ремонта.</strong>
      </p>
      <p style="margin: 0">
        В случае утери квитанции, устройство выдается по предъявлению паспорта. Договор составлен в 2х одинаковых
        экземплярах.
        <strong>
          &nbsp;Срок бесплатного хранения аппарата 30 дней с ориентировочной даты готовности. По окончании этого
          срокасумма хранения 50р. сутки. По истечении 50 дней устройство выставляется на аукцион ст.897ст.899 ГК РФ.Все
          споры урегулируются в претензионном или ином досудебном порядке, что предусмотрено: ч. 5 ст.4 АПК РФ, абз. 7
          ст. 132 ГПК РФ, ч. 3 ст. 4 КАС РФ. Телефон руководителя: +7 (989) 265-88-28. Роспись клиента это согласие с
          условиями и данными в договоре!
        </strong>
      </p>
    </div>
    <br />
    <table style="width: 100%; font-size: 14px">
      <tr>
        <td>
          <span>Сдал(а) в ремонт {{ customerName }}</span>
          <span style="margin-left: 5px; width: 60px; border-bottom: 2px solid; display: inline-block"></span>
        </td>
        <td>
          <span>Принял(а)</span>
          <span
            style="margin-left: 5px; margin-right: 5px; width: 60px; border-bottom: 2px solid; display: inline-block"
          ></span>
          <span>(роспись)</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { settingsModule } from '@/store'
import { mapState } from 'vuex'

export default {
  name: 'ug-print-repair-contract',

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
    ...mapState({
      address: (state) => state.settings.office.address,
    }),

    year() {
      return new Date().getFullYear()
    },

    customerPhoneFormatted() {
      return this.customerPhone
    },

    createdAtFormatted() {
      return moment(this.createdAt).locale('ru').format('DD MMMM YYYY')
    },
  },
}
</script>
