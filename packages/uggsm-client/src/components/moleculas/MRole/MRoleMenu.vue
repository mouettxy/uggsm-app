<template lang="pug">
v-card.role__menu(
  width='278',
  dark
)
  v-list(
    nav,
    dark
  )
    v-subheader Доступные роли
    v-list-item-group(
      v-model='selectedItem',
      @change='roleChange',
      mandatory,
      active-class='role__menu__item--active'
    )
      v-slide-y-transition(group)
        v-list-item(
          v-for='item in items',
          :key='item.name',
          two-line
        )
          v-list-item-content
            v-list-item-title {{ item.description }}
            v-list-item-subtitle
              v-chip.role__menu__item-chip(
                x-small,
                label,
                color='secondary'
              ) {{ item.name }}
          v-list-item-action
            v-menu(offset-x)
              template(#activator='{ on, attrs }')
                v-btn(
                  v-on='on',
                  v-bind='attrs',
                  icon
                )
                  v-icon mdi-dots-horizontal
              v-list(dense)
                v-list-item(@click='roleDelete(item.name)')
                  v-list-item-title.error--text Удалить роль
                v-menu(
                  :close-on-content-click='false',
                  offset-y,
                  offset-overwlof
                )
                  template(#activator='{ on, attrs }')
                    v-list-item(
                      v-on='on',
                      v-bind='attrs',
                      @click='roleAssign(item.name)'
                    )
                      v-list-item-title.primary--text Назначить роль
                  v-card
                    v-card-text
                      a-autocomplete.mb-2(
                        v-model='user',
                        label='Пользователь',
                        hide-details,
                        endpoint='/master',
                        disallow-free-type,
                        dense
                      )
                      v-btn.mt-2(
                        @click='roleAssign(item.name)',
                        depressed,
                        color='secondary',
                        block
                      ) Назначить
                v-list-item(@click='roleCopyResources(item.name)')
                  v-list-item-title.secondary--text Скопировать ресурсы
</template>

<script lang="ts">
import { copyTextToClipboard } from '@/api/helpers'
import { rolesModule, usersModule } from '@/store'
import { find, toString } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MRoleMenu extends Vue {
  get items() {
    return rolesModule.items
  }

  public user = ''

  public selectedItem = 0

  roleChange() {
    if (this.items[this.selectedItem]) {
      rolesModule.setRole(this.items[this.selectedItem].name)
    }
  }

  roleDelete(role: string) {
    rolesModule.deleteRole(role)
  }

  async roleAssign(role: string) {
    if (this.user) {
      await usersModule.updateById({ id: this.user, payload: { role } })

      this.$notification.success('Пользователю успешно назначена роль')
    } else {
      this.$notification.error('Не выбран пользователь')
    }
  }

  roleCopyResources(role: string) {
    copyTextToClipboard(JSON.stringify(find(this.items, { name: role })?.resources))
  }
}
</script>

<style lang="sass">
.role__menu__item--active
  color: var(--v-primary-lighten5) !important

  .role__menu__item-chip
    color: var(--v-primary-lighten3) !important
</style>
