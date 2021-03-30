<template>
  <div id="print-warranty" style="width: 100%">
    <table style="width: 100%; border: 1px solid black; border-collapse: collapse">
      <tr style="border: 1px solid black">
        <td
          style="
            text-align: left;
            font-weight: bold;
            font-size: 20px;
            border: 1px solid black;
            border-collapse: collapse;
          "
        >
          <p style="margin: 0">Заказ №{{ orderId }}</p>
          <p style="margin: 0">Создан: {{ createdAtFormatted }}</p>
          <p style="margin: 0">
            <span>Выдан:</span>
            <span
              style="margin-left: 5px; margin-right: 5px; width: 80px; border-bottom: 2px solid; display: inline-block"
            ></span>
            <span>{{ year }}</span>
          </p>
        </td>
        <td style="text-align: right; border: 1px solid black; border-collapse: collapse">
          <p style="margin: 0">ИП Гергишан Андрей Владимирович.</p>
          <p style="margin: 0">ИНН: 262410115637</p>
          <p style="margin: 0">ОГРНИП:314231108300081.</p>
          <p style="margin: 0">{{ address }}.</p>
          <p style="margin: 0">Моб.: +7 (996) 407-61-78</p>
        </td>
      </tr>
    </table>
    <div style="font-size: 14px">
      <p style="margin: 0">
        Заказчик: {{ customerName }}, {{ customerPhoneFormatted }} Устройство: {{ phoneModel }} Серийный номер:
        {{ serialNumber }}
      </p>
      <p style="margin: 0">Дефект со слов заказчика: {{ declaredDeffect }}</p>
      <p style="margin: 0">Телефон для связи: +7 (996) 407-61-78</p>
      <p style="margin: 0">
        Гарантия 30 дней только на выполненную работу и замененные запчасти. Механические повреждения, царапины, сколы,
        вмятины, стороннее вмешательство и попадание жидкости не являются гарантийным случаем. Все споры урегулируются в
        претензионном или ином досудебном порядке, что предусмотрено: ч. 5 ст. 4 АПК РФ, абз. 7 ст. 132 ГПК РФ, ч. 3 ст.
        4 КАС РФ.
      </p>
      <p style="margin: 0; text-decoration: underline">Телефон руководителя: +7 (989) 265-88-28</p>
    </div>
    <table style="width: 100%; border: 1px solid black; border-collapse: collapse">
      <thead>
        <tr style="border: 1px solid black">
          <td style="border: 1px solid black; border-collapse: collapse; padding: 8px; font-size: 14px">
            Выполненные работы
          </td>
          <td style="border: 1px solid black; border-collapse: collapse; padding: 8px; font-size: 14px">Стоимость</td>
        </tr>
      </thead>
      <tbody>
        <tr style="border: 1px solid black">
          <!-- U+2800 here-->
          <td style="border: 1px solid black; border-collapse: collapse; padding: 8px">⠀</td>
          <!-- U+2800 here-->
          <td style="border: 1px solid black; border-collapse: collapse; padding: 8px">⠀</td>
        </tr>
      </tbody>
    </table>
    <div style="font-size: 14px">
      <p style="margin: 0">
        Работы выполнены в полном объеме, качество проверено. Заказчик к исполнителю претензийне имеет.
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
import { mapState } from 'vuex'

export default {
  name: 'ug-print-warranty',

  props: {
    orderId: {
      required: true,
      type: [String, Number],
    },

    createdAt: {
      required: true,
      type: [String],
    },

    customerName: {
      required: true,
      type: [String],
    },

    customerPhone: {
      required: true,
      type: [String],
    },

    phoneModel: {
      required: true,
      type: [String],
    },

    serialNumber: {
      required: true,
      type: [String],
    },

    declaredDeffect: {
      required: true,
      type: [String],
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
