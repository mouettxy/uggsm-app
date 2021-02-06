<template lang="pug">
form.role__add-resource(@submit.prevent='addNewResource')
  a-input(
    v-model='newResource.description',
    label='Добавить новый ресурс'
  )
  v-slide-y-transition
    .role__add-resource-hidden.pt-2(v-if='newResource.description.length > 0')
      v-row(no-gutters)
        v-col(cols='10')
          a-input(
            v-model='newResource.name',
            label='Кодовое название ресурса'
          )
        v-col.pl-2(cols='2')
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
import { capitalize } from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class MRoleAddResource extends Vue {
  public newResource = {
    description: '',
    name: '',
  }

  @Watch('newResourceName')
  onNewResourceNameChange() {
    this.newResource.name = capitalize(this.newResource.name)
  }

  get newResourceName() {
    return this.newResource.name
  }

  async addNewResource() {
    if (this.newResource.description.length > 0 && this.newResource.name.length > 0) {
      await rolesModule.createResource(this.newResource)

      this.$notification.success(`Ресурс "${this.newResource.description}" успешно добавлен`)

      this.newResource.description = ''
      this.newResource.name = ''
    } else {
      this.$notification.error('Не заполнено одно из обязательных полей')
    }
  }
}
</script>

<style lang="sass"></style>
