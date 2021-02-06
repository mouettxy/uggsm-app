<template lang="pug">
form.role__add-resource(@submit.prevent='addNewAbility')
  a-input(
    v-model='newAbility.description',
    label='Добавить новую способность'
  )
  v-slide-y-transition
    .role__add-resource-hidden.pt-2(v-if='newAbility.description.length > 0')
      v-row(no-gutters)
        v-col(cols='8')
          a-input(
            v-model='newAbility.name',
            label='Кодовое название способности'
          )
        v-col.pl-2(cols='4')
          v-btn(
            type='submit',
            height='40',
            depressed,
            color='secondary',
            block
          ) Добавить
</template>

<script lang="ts">
import { rolesModule } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MRoleAddAbility extends Vue {
  @Prop() resource!: string

  public newAbility = {
    description: '',
    name: '',
  }

  async addNewAbility() {
    if (this.newAbility.description.length > 0 && this.newAbility.name.length > 0) {
      await rolesModule.createAbility({ resource: this.resource, ability: this.newAbility })

      this.$notification.success(`Способность ${this.newAbility.description} успешно добавлена`)

      this.newAbility.description = ''
      this.newAbility.name = ''
    } else {
      this.$notification.error('Не заполнено одно из обязательных полей')
    }
  }
}
</script>

<style lang="sass"></style>
