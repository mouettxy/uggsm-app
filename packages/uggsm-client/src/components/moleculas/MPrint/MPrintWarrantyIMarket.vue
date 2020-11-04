<template lang="pug">
#print-warranty-i-market(:style='{ width: "100%", height: "100%" }')
  // header
  table(style='width: 100%; border-collapse: collapse; margin-top: 16px')
    tbody
      tr
        td(:style='{ "text-align": "left", color: "#757575", "vertical-align": "top", "font-size": "12px" }')
          div +7 (918) 35-111-39 ул. Октябрьская 12
          div +7 (918) 35-111-26 ул. О.Кошевого 194А
          div Режим работы пн-вс с 10-19:00
        td(:style='{ display: "flex", justifyContent: "end" }')
          div(:style='{ display: "flex", flexDirection: "column" }')
            div(:style='{ position: "relative", width: "230px", height: "150px" }')
              div(:style='{ position: "absolute", top: "-30px", whiteSpace: "nowrap", left: "0px" }')
                img(
                  width='230',
                  src='@/assets/warranty-i-market.jpg',
                  height='110'
                )
              div(:style='{ fontSize: "8px", position: "absolute", top: "50px", whiteSpace: "nowrap", left: "8px" }') Продажа,ремонт,сервисное обслуживание техники Apple.
              div(:style='{ position: "absolute", top: "70px", whiteSpace: "nowrap", left: "90px" }')
                img(
                  width='61',
                  src='@/assets/instagram-i-market.jpg',
                  heigh='12'
                )
  div(:style='{ fontSize: "16px", fontWeight: "bold", textAlign: "center" }') Гарантийный талон.
  div(:style='{ "font-size": "16px", "text-align": "center", "margin-top": "16px" }')
    span от&nbsp;
    span «
    span(
      :style='{ "margin-left": "2px", "margin-right": "2px", width: "32px", "border-bottom": "2px solid", display: "inline-block" }'
    )
    span »
    span(
      :style='{ "margin-left": "2px", "margin-right": "2px", width: "128px", "border-bottom": "2px solid", display: "inline-block" }'
    )
    span {{ year }}г.
  div(:style='{ display: "flex" }')
    div Заказчик
    div(:style='{ "margin-left": "8px", "margin-right": "2px", "border-bottom": "1px solid", flexGrow: "1" }')
  table(:style='{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }')
    thead
      tr
        td(:style='{ textAlign: "center", border: "1px solid black" }') №
        td(:style='{ textAlign: "center", border: "1px solid black" }') Наименование работы (услуги)
        td(:style='{ textAlign: "center", border: "1px solid black" }') Серийный номер
        td(:style='{ textAlign: "center", border: "1px solid black" }') цена
    tbody
      tr(v-for='i in 5')
        td(:style='{ textAlign: "center", border: "1px solid black" }') ⠀&nbsp;
        td(:style='{ textAlign: "center", border: "1px solid black" }') ⠀&nbsp;
        td(:style='{ textAlign: "center", border: "1px solid black" }') ⠀&nbsp;
        td(:style='{ textAlign: "center", border: "1px solid black" }') ⠀&nbsp;
  div(:style='{ marginTop: "16px", fontStyle: "italic", fontSize: "14px" }')
    p(:style='{ marginBottom: "2px" }') Гарантийный срок 1 месяц с момента передачи устройства клиенту.
    p(:style='{ marginBottom: "2px" }') Гарантия распространяется ТОЛЬКО на выполненные работы и замененные запчасти.
    p(:style='{ marginBottom: "2px" }') Гарантия не распространяется на аппараты ,которые подвергались воздействию жидкости или механическому повреждению (удар, падение),а так же в случае не квалифицированного ремонта сторонними ремонтными организациями.
    p(:style='{ marginBottom: "2px" }') Гарантия не распространяется на детали вышедшие из строя из за усиленного износа.
    p(:style='{ marginBottom: "2px" }') Гарантийный срок согласно закону о защите прав потребителей увеличивается на время нахождения изделия в ремонте.
  div(:style='{ marginTop: "64px", fontStyle: "italic", fontSize: "14px" }')
    div Всего оказано услуг на сумму:
    div(:style='{ display: "flex" }')
      div(:style='{ "margin-left": "2px", "margin-right": "2px", "border-bottom": "1px solid", flexGrow: "1" }')
      div рублей
    div(:style='{ marginTop: "16px", marginBottom: "16px" }') Вышеперечисленные работы (услуги) выполнены полностью и в срок. Заказчик претензий по объему, качеству и срокам оказания услуг претензий не имеет.
  div(:style='{ display: "flex", justifyContent: "space-between" }')
    div
      span Исполнитель:
      span(
        :style='{ "margin-left": "2px", "margin-right": "2px", width: "128px", "border-bottom": "2px solid", display: "inline-block", textAlign: "center", lineHeight: ".8" }'
      ) iMarket
    div
      span Заказчик:
      span(
        :style='{ "margin-left": "2px", "margin-right": "2px", width: "128px", "border-bottom": "2px solid", display: "inline-block", lineHeight: ".8" }'
      ) ⠀
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
@Component
export default class MPrintWarrantyIMarket extends Vue {
  public year = moment().format('YYYY')
}
</script>

<style lang="sass"></style>
