<template lang="pug">
.print-volgograd-part
  span Исполнитель:
    strong(:style='{ paddingLeft: "20px" }') {{ master }}

  h2 Квитанция № {{ orderId }} от {{ dateNow }}

  div(:style='{ marginBottom: "20px" }')

  div(:style='{ fontSize: "14px" }')
    div Заказчик:
      strong(:style='{ paddingLeft: "40px" }') {{ customer }}
    div Устройство: {{ model }}
    div Серийный номер / IMEI: {{ serialNumber }}
    div Комплектация: {{ kit }}
    div Внешний вид: {{ appearance }}
    div Неисправность: {{ deffect }}
    div Ориентировочная стоимость: {{ declaredPrice }}
    div Ориентировочная дата готовности: {{ closeTime }}
    div Примечание:

  div(:style='{ marginBottom: "20px" }')

  div(:style='{ fontSize: "12px" }')
    div.
      1.Сервисный центр не несет ответственности, если после разборки при диагностике / ремонте, состояние устройства ухудшится, из-за нарушения пользователем правил эксплуатации устройства (попадания жидкости, механические повреждения и т.д.)
    div.
      2.Технический центр не несет ответственности за возможную потерю данных в индивидуальной памяти устройства, связанную с заменой плат, установкой программного обеспечения, заменой носителя информации.
    div.
      3.Заказчик принимает на себя риск возможной полной или частичной утраты работоспособности аппарата в процессе ремонта (тепловой обработки), в случае грубых нарушений пользователем условий эксплуатации, наличий следов попадания токопроводящей жидкости (коррозии), либо механических повреждений.
    div.
      4.На аппараты восстановленные после сильных механических повреждений, попадания токопроводящей жидкости и программного обеспечения гарантия не распространяется и не продлевается. Гарантия распространяется не на все устройство целиком, а только на тот узел который подвергся ремонту, и указан в гарантийном талоне.
    div.
      5.Срок хранения аппарата в сервисном центре 14 дней с момента сообщения о готовности, либо невозможности ремонта. После данного срока за хранения начисляется пени в размере 50р. за каждый день просрочки. После 2 месяцев аппарат реализуется для покрытия расходов сервисного центра. Выдача оборудования, в этом случае, производится только после уплаты всей суммы стоимости ремонта / диагностики и суммы начисленных пени за хранения.

  div(:style='{ marginBottom: "20px" }')

  div(:style='{ display: "flex", padding: "0 16px" }')
    div(:style='{ display: "flex", flex: "0 0 50%" }')
      div Исполнитель
      div(:style='{ margin: "2px 4px", width: "100%", borderBottom: "2px solid" }')
    div(:style='{ display: "flex", flex: "0 0 50%" }')
      div Заказчик
      div(:style='{ margin: "2px 4px", width: "100%", borderBottom: "2px solid" }')
</template>

<script>
import moment from 'moment'

export default {
  name: 'ug-print-volgograd-part',

  props: {
    master: {
      required: false,
      type: String,
      default: '',
    },

    customer: {
      required: false,
      type: String,
      default: '',
    },

    model: {
      required: false,
      type: String,
      default: '',
    },

    serialNumber: {
      required: false,
      type: [String, Number],
      default: '',
    },

    kit: {
      required: false,
      type: String,
      default: '',
    },

    appearance: {
      required: false,
      type: String,
      default: '',
    },

    deffect: {
      required: false,
      type: String,
      default: '',
    },

    declaredPrice: {
      required: false,
      type: [String, Number],
      default: '',
    },

    estimatedCloseAt: {
      required: false,
      type: String,
      default: '',
    },

    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },

  data: function () {
    return {
      dateNow: moment().format('DD.MM.YYYY'),
    }
  },

  computed: {
    closeTime() {
      if (!this.estimatedCloseAt) {
        return ''
      }

      return moment(this.estimatedCloseAt).format('DD.MM.YYYY')
    },
  },
}
</script>
