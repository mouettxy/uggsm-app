<template lang="pug">
v-select.office-switcher(
  v-model='model',
  :items='items',
  outlined,
  no-data-text='Похоже нет доступных офисов...',
  menu-props='auto',
  label='Офис',
  hide-details,
  dense
)
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { officesModule } from '@/store'
import { map } from 'lodash'

/**
 * Atom that switch offices
 *
 * @emits change
 *
 */
@Component
export default class MOfficeSwitcher extends Vue {
  @Prop(String) value: any

  get model() {
    return this.value
  }

  set model(value) {
    /**
     * Fires when office changes
     *
     * @property {string} value - current office
     */
    this.$emit('input', value)
  }

  get items() {
    return map(officesModule.offices, (el) => `${el.code}|${el.name}`)
  }

  mounted() {
    officesModule.fetch()
  }
}
</script>
