<template lang="pug">
.ug-cash-receipt
  .ug-cash-receipt__wrapper
    v-row
      v-col(cols='6')
        span.text-subtitle-1 Наименование
      v-col(cols='6')
        span.text-subtitle-1 Сумма, ₽
    v-row(align='center')
      v-col(cols='6')
        span.text-subtitle-2(v-if='type === "income"') Внесение денег в кассу
        span.text-subtitle-2(v-else) Выплата денег из кассы
      v-col(cols='6')
        ug-base-input(
          v-model='model',
          :rules='[(v) => v > 0 || "Сумма должна быть больше нуля"]',
          type='number',
          suffix='₽',
          label='Сумма',
          hide-details,
          dense
        )
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

export default {
  name: 'ug-cash-receipt',

  components: {
    UgBaseInput,
  },

  props: {
    value: {
      required: true,
      type: [String, Number],
    },

    type: {
      required: true,
      type: [String],
      validator: (v) => ['income', 'consumption'].includes(v),
    },
  },

  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="sass">
.ug-cash-receipt
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
  .ug-cash-receipt__wrapper
    position: relative
    background-image: linear-gradient(-180deg,#ECECEC 0%,#fff 4%,#eeefef 100%)
    border-radius: 4px 4px 0 0
    border: 1px solid rgba(151,151,151,.3)
    border-bottom: none
    z-index: 100
    padding: 16px
</style>
