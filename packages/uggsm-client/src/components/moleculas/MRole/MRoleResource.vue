<template lang="pug">
v-card
  v-toolbar(
    dense,
    color='secondary'
  )
    v-card-title.light--text {{ item.description }}
    v-chip(
      small,
      label,
      color='#9a9dac'
    ) {{ item.name }}
    v-spacer
    v-btn(
      @click='deleteResource',
      icon,
      color='#9a9dac'
    )
      v-icon mdi-trash-can
  v-card-text
    m-role-add-ability(:resource='item.name')

    v-list(nav)
      v-list-item(
        v-for='ability in item.abilities',
        two-line
      )
        v-list-item-content
          v-list-item-title(:title='ability.description') {{ ability.description }}
          v-list-item-subtitle
            v-menu(offset-x)
              template(#activator='{ on, attrs }')
                v-chip(
                  v-on='on',
                  v-bind='attrs',
                  x-small,
                  label,
                  color='secondary'
                ) {{ ability.name }}
              v-list(dense)
                v-list-item(@click='deleteAbility(ability.name)')
                  v-list-item-title.error--text Удалить способность
        v-list-item-action
          a-switch(
            v-model='ability.value',
            @input='updateAbility(item.name, ability.name, ability.description, ability.value)'
          )
</template>

<script lang="ts">
import { rolesModule } from '@/store'
import { RoleResource } from '@/typings/api/role'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MRoleResource extends Vue {
  @Prop() item!: RoleResource

  async deleteResource() {
    await rolesModule.deleteResource(this.item.name)

    this.$notification.success(`Ресурс "${this.item.name}" удалён успешно"`)
  }

  async deleteAbility(ability: string) {
    await rolesModule.deleteAbility({ resource: this.item.name, ability })

    this.$notification.success(`Способность "${ability}" удалена успешно"`)
  }

  async updateAbility(resource: string, ability: string, description: string, value: boolean) {
    await rolesModule.updateAbility({ resource, ability: { name: ability, description, value } })
  }
}
</script>

<style lang="sass"></style>
