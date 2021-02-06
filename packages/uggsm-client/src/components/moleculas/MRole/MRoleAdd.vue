<template lang="pug">
form.role__add(@submit.prevent='addNewRole')
  a-input(
    v-model='newRole.description',
    label='Добавить новую роль'
  )
  v-slide-y-transition
    .role__add-hidden.pt-2(v-if='newRole.description.length > 0')
      v-row(no-gutters)
        v-col(cols='8')
          a-input(
            v-model='newRole.name',
            label='Кодовое название роли'
          )
        v-col.pl-2(cols='2')
          v-btn(
            type='submit',
            height='40',
            depressed,
            color='secondary',
            block
          ) Добавить
        v-col.pl-2(cols='2')
          v-menu(
            :close-on-content-click='false',
            offset-y,
            offset-overwlof
          )
            template(#activator='{ on, attrs }')
              v-btn(
                v-on='on',
                v-bind='attrs',
                height='40',
                depressed,
                color='secondary',
                block
              ) Расширить
            v-card.pa-2
              v-card-text
                a-select(
                  v-model='populatedRole',
                  :items='roleList',
                  label='Выберите роль'
                )
                v-btn.mt-2(
                  @click='addNewPopulatedRole',
                  depressed,
                  color='secondary',
                  block
                ) Добавить
                v-btn.mt-2(
                  @click='addFromClipboard',
                  small,
                  depressed,
                  color='secondary',
                  block
                ) Вставить
</template>

<script lang="ts">
import { rolesModule } from '@/store'
import { find, map } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MRoleAdd extends Vue {
  public newRole = {
    description: '',
    name: '',
  }

  public populatedRole = 'default'

  get roleList() {
    return map(this.roles, (e) => e.name)
  }

  get roles() {
    return rolesModule.items
  }

  async addFromClipboard() {
    if (this.newRole.description.length > 0 && this.newRole.name.length > 0) {
      const resources = await navigator.clipboard.readText()

      await rolesModule.createRole({
        ...this.newRole,
        resources: JSON.parse(resources),
      })

      this.$notification.success(`Роль "${this.newRole.description}" успешно добавлена`)

      this.newRole.description = ''
      this.newRole.name = ''
    } else {
      this.$notification.error('Не заполнено одно из обязательных полей')
    }
  }

  async addNewPopulatedRole() {
    if (this.newRole.description.length > 0 && this.newRole.name.length > 0) {
      await rolesModule.createRole({
        ...this.newRole,
        resources: find(this.roles, { name: this.populatedRole })?.resources,
      })

      this.$notification.success(`Роль "${this.newRole.description}" успешно добавлена`)

      this.newRole.description = ''
      this.newRole.name = ''
    } else {
      this.$notification.error('Не заполнено одно из обязательных полей')
    }
  }

  async addNewRole() {
    if (this.newRole.description.length > 0 && this.newRole.name.length > 0) {
      await rolesModule.createRole(this.newRole)

      this.$notification.success(`Роль "${this.newRole.description}" успешно добавлена`)

      this.newRole.description = ''
      this.newRole.name = ''
    } else {
      this.$notification.error('Не заполнено одно из обязательных полей')
    }
  }
}
</script>

<style lang="sass"></style>
