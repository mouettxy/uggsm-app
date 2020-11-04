<template lang="pug">
#print-repair-contract-i-market(:style='{ width: "100%", height: "100%" }')
  // header
  table(style='width: 100%; border-collapse: collapse; margin-top: 16px')
    tbody
      tr
        td(:style='{ "text-align": "left", color: "#757575", "vertical-align": "top", "font-size": "12px" }')
          div(:style='{ "text-decoration": "underline" }') Уточнить статус ремонта
          ul
            li +7 (918) 35-111-39 ул. Октябрьская 12
            li +7 (918) 35-111-26 ул. О.Кошевого 194А
            li Режим работы пн-вс с 10-19:00
        td(:style='{ "text-align": "right" }')
          img(
            width='170',
            src='@/assets/repair-contract-i-market.jpg',
            heigh='170'
          )
  div(:style='{ "font-size": "14px", "text-align": "center" }') Акт приема-передачи оборудования на диагностику
  div(:style='{ "font-size": "16px", "text-align": "center", "margin-top": "16px" }')
    span Дата приема:&nbsp;
    span «
    span(
      :style='{ "margin-left": "2px", "margin-right": "2px", width: "32px", "border-bottom": "2px solid", display: "inline-block" }'
    )
    span »
    span(
      :style='{ "margin-left": "2px", "margin-right": "2px", width: "128px", "border-bottom": "2px solid", display: "inline-block" }'
    )
    span {{ year }}г.
  table(:style='{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }')
    thead
      tr
        th(
          :style='{ textAlign: "center", border: "1px solid black" }',
          colspan='2'
        ) Данные об оборудовании
        th(
          :style='{ textAlign: "center", border: "1px solid black" }',
          colspan='2'
        ) Данные о клиенте
    tbody
      tr
        td(:style='{ textAlign: "center", border: "1px solid black" }') Тип:
        td(:style='{ textAlign: "center", border: "1px solid black" }') Диагностика
        td(:style='{ textAlign: "center", border: "1px solid black" }') Клиент
        td(:style='{ textAlign: "center", border: "1px solid black" }') {{ clientName }}
      tr
        td(:style='{ textAlign: "center", border: "1px solid black" }') Устройство:
        td(:style='{ textAlign: "center", border: "1px solid black" }') {{ model }}
        td(:style='{ textAlign: "center", border: "1px solid black" }') Телефон
        td(:style='{ textAlign: "center", border: "1px solid black" }') {{ clientPhone }}
      tr
        td(:style='{ padding: "2px", textAlign: "center", border: "1px solid black" }') Серийный номер:
        td(
          :style='{ padding: "2px", border: "1px solid black" }',
          colspan='3'
        ) {{ serialNumber }}
      tr
        td(:style='{ padding: "2px", textAlign: "center", border: "1px solid black" }') Внешний вид:
        td(
          :style='{ padding: "2px", border: "1px solid black" }',
          colspan='3'
        ) {{ appearance }}
      tr
        td(:style='{ padding: "2px", textAlign: "center", border: "1px solid black" }') Комплектация:
        td(
          :style='{ padding: "2px", border: "1px solid black" }',
          colspan='3'
        ) {{ kit }}
      tr
        td(:style='{ padding: "2px", textAlign: "center", border: "1px solid black" }') Неисправность со слов клиента:
        td(
          :style='{ padding: "2px", border: "1px solid black" }',
          colspan='3'
        ) {{ declaredDefect }}
      tr
        td(:style='{ padding: "2px", textAlign: "center", border: "1px solid black" }') Пароль устройства:
        td(
          :style='{ padding: "2px", border: "1px solid black" }',
          colspan='3'
        ) {{ password }}
  div(:style='{ fontSize: "12px", marginTop: "16px" }')
    p
      strong Обращаем ваше внимание, что будет произведен только тот ремонт, симптомы которого описывал клиент или что клиент конкретно указал. Диагностика и ремонт других неисправностей не производится, гарантийные обязательства на подобные неисправности не распространяются.
    p Оборудование, с согласия клиента, принято без разборки и проверки неисправностей, без проверки внутренних повреждений. Клиент согласен, что все неисправности, внешние и внутренние повреждения, которые могут быть обнаружены в оборудовании при его диагностике и ремонте, возникли до приема по данному Акту. Клиент уведомлен и согласен с тем, что срок негарантийной диагностики, а так же негарантийного ремонта зависит от сложности устранения неисправности и согласовывается индивидуально с клиентом.
    p
      | В случаях, если в аппарате&nbsp;
      strong при вскрытии&nbsp;
      | будут обнаружены следы&nbsp;
      strong попадания воды&nbsp;
      | ( или других токопроводящих жидкостей ), а также в случаях&nbsp;
      strong обнаружения деформации платы аппарата&nbsp;
      | (обычно в следствии механических воздействий), фирма не несет никакой ответственности за состояние аппарата при выдаче (в случае невозможности ремонта), т.к. в таких случаях в аппарате происходят необратимые процессы (коррозии и обрывов токопроводящих проводников), и частично работающий аппарат при незначительных воздействиях вскрытия или пайки может потерять свою работоспособность. В таких случаях,&nbsp;
      strong владелец не вправе требовать восстановления данного аппарата до состояния, в котором он был при приеме.&nbsp;
      | Для таких аппаратов фирмой может выдаваться заключение о невозможности (нецелесообразности) их ремонта.
    p Клиент уведомлен и согласен с тем, что в случае замены/пропаивания микросхем технический центр не несет ответственности за возможные и существующие риски выхода из строя как меняемых/пропаиваемых компонентов, так и связанных и/или расположенных рядом узлов и деталей.
    p Технический центр вправе отказать в гарантийном обслуживании оборудования при выявлении ненадлежащих условий хранения и/или эксплуатации оборудования (сколы, царапины, вмятины корпуса, а также окисления разъемов, потеки дисплея, следы попадания жидкости и т.п.), в случае отказа/невозможности потребителя отключить функцию «Найти iPhone»/ «Найти iPad, а также при выходе оборудования из строя по вине клиента. Возможность осуществления гарантийного ремонта определяется только на остовании результатов диагностики специалистом.
    p В случае утраты/потери данного Акта сданное оборудование может быть выдано только лично лицу, указанному в графе «Данные о клиенте», при предъявлении паспорта и написании соответствующего заявления
    p(:style='{ marginBottom: 0 }') Аппарат сдан на ремонт в комплектации, указанной в данном талоне, правильность заполнения серийных номеров, идентификационного номера аппарата ,а так же информация Ф.И.О сдающего в ремонт, мною проверена,
    strong с вышеперечисленными условиями приема в ремонт ОЗНАКОМЛЕН и СОГЛАСЕН.
  div(:style='{ display: "flex", justifyContent: "space-between" }')
    div
      strong(:style='{ fontSize: "16px" }') Клиент:
      div
        span(
          :style='{ marginLeft: "2px", marginRight: "4px", width: "64px", borderBottom: "2px solid", display: "inline-block" }'
        )
        strong(:style='{ fontSize: "16px" }') /
        span(
          :style='{ marginLeft: "2px", marginRight: "2px", width: "128px", borderBottom: "2px solid", display: "inline-block" }'
        )
        div(:style='{ display: "flex", justifyContent: "space-between", fontSize: "10px" }')
          div(:style='{ paddingLeft: "2px" }')
            strong подпись
          div
            strong расшифровка
    div
      strong(:style='{ fontSize: "16px" }') Приемщик:
      div
        span(
          :style='{ marginLeft: "2px", marginRight: "4px", width: "64px", borderBottom: "2px solid", display: "inline-block" }'
        )
        strong(:style='{ fontSize: "16px" }') /
        span(
          :style='{ marginLeft: "2px", marginRight: "2px", width: "128px", borderBottom: "2px solid", display: "inline-block" }'
        )
        div(:style='{ display: "flex", justifyContent: "space-between", fontSize: "10px" }')
          div(:style='{ paddingLeft: "2px" }')
            strong подпись
          div
            strong расшифровка
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class MPrintRepairContractIMarket extends Vue {
  public year = moment().format('YYYY')

  @Prop(String) clientName!: string
  @Prop(String) clientPhone!: string
  @Prop(String) model!: string
  @Prop(String) serialNumber!: string
  @Prop(String) appearance!: string
  @Prop(String) kit!: string
  @Prop(String) declaredDefect!: string
  @Prop(String) password!: string
}
</script>

<style lang="sass"></style>
