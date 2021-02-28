<template lang="pug">
.cash-check
  .cash-check-wrapper
    table.cash-check__table
      thead.cash-check__table-header
        td.cash-check__table-header__item Наименование
        td.cash-check__table-header__item Сумма, руб.
      tbody.cash-check__table-body
        tr.cash-check__table-body-row
          template(v-if='type === "income"')
            td.cash-check__table-body-row__item Внесение денег в кассу
          template(v-else)
            td.cash-check__table-body-row__item Выплата денег из кассы
          td.cash-check__table-body-row__item
            ug-base-input(
              v-model='model',
              type='number',
              suffix='руб.',
              label='Сумма',
              hide-details,
              dense
            )
        tr.cash-check__table-body-row
          td.cash-check__table-body-row__item.text-right Итого:
          td.cash-check__table-body-row__item.text-right {{ model }} руб.
</template>

<script lang="ts">
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    UgBaseInput,
  },
})
export default class Name extends Vue {
  @Prop({ required: true, type: [String, Number] }) value!: string | number
  @Prop({ required: true, type: String }) type!: 'income' | 'consumption'

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="sass">
.cash-check
  position: relative
  &::before
    content: ""
    background: url('~@/assets/zub.png') repeat-x
    background-size: auto
    background-size: 8px 10px
    position: absolute
    left: 0
    bottom: -11px
    height: 12px
    width: 100%
  &::after
    content: ""
    position: absolute
    top: -2px
    left: -2px
    width: calc(100% + 4px)
    height: 8px
    border-radius: 4px
    z-index: 2
    background: #303030
  &-wrapper
    position: relative
    background-image: linear-gradient(-180deg,#ECECEC 0%,#fff 4%,#eeefef 100%)
    border-radius: 4px 4px 0 0
    border: 1px solid rgba(151,151,151,.3)
    border-bottom: none
    z-index: 100
    padding: 16px
    &__table
      width: 100%
      padding: 4px
      &-header
        &__item
          font-size: 1.1rem
          font-weight: 500
          padding: 12px
          background: #eee
      &-body
        &-row
          &__item
            font-size: 1.1rem
            padding: 12px
</style>
