<template lang="pug">
v-card.ug-role-menu.w-100(dark)
  v-list(
    nav,
    dark
  )
    v-subheader Доступные роли
    v-list-item-group(
      v-model='selectedItem',
      @change='roleChange',
      mandatory,
      active-class='ug-role-menu__item--active'
    )
      v-slide-y-transition(group)
        v-list-item(
          v-for='item in roles',
          :key='item.name',
          two-line
        )
          v-list-item-content
            v-list-item-title {{ item.name }}
            v-list-item-subtitle
              v-chip.ug-role-menu__item-chip(
                x-small,
                label,
                color='secondary'
              ) {{ item.value }}
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
                v-list-item(@click='roleDelete(item.value)')
                  v-list-item-title.error--text Удалить роль
                v-menu(
                  :close-on-content-click='false',
                  offset-y,
                  offset-overwlof
                )
                  template(#activator='{ on, attrs }')
                    v-list-item(
                      v-on='on',
                      v-bind='attrs'
                    )
                      v-list-item-title.primary--text Назначить роль
                  v-card
                    v-card-text
                      ug-base-autocomplete.mb-2(
                        v-model='user',
                        label='Пользователь',
                        hide-details,
                        endpoint='/master',
                        disallow-free-type,
                        dense
                      )
                      v-btn.mt-2(
                        @click='roleAssign(item.value)',
                        depressed,
                        color='secondary',
                        block
                      ) Назначить
                v-list-item(@click='roleCopyResources(item.value)')
                  v-list-item-title.secondary--text Скопировать ресурсы
</template>

<script>
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete.vue'

import { copyTextToClipboard } from '@/api/helpers'
import RoleAPI from '@/api/role'
import UserAPI from '@/api/user'
import { compact, find, includes, map } from 'lodash'

export default {
  name: 'ug-role-menu',

  components: {
    UgBaseAutocomplete,
  },

  props: {
    items: {
      required: false,
      type: Array,
      default: () => [],
    },

    rolesToHide: {
      required: false,
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    selectedItem: 0,
    user: '',
  }),

  computed: {
    roles() {
      return compact(map(this.items, (e) => (!includes(this.rolesToHide, e.value) ? e : null)))
    },
  },

  methods: {
    roleChange() {
      if (this.items[this.selectedItem]) {
        this.$emit('select', this.roles[this.selectedItem])
      }
    },

    async roleDelete(role) {
      const apiResponse = await RoleAPI.delete(role)

      if (!(apiResponse.status === 200)) {
        this.$notification.error(`Ошибка при удалении роли <${role}>`)
      }

      this.$notification.success(`Роль <${role}> успешно удалена`)
    },

    async roleAssign(role) {
      if (this.user) {
        const apiResponse = await UserAPI.update(this.user, { role })

        if (!(apiResponse.status === 200)) {
          this.$notification.error('Ошибка сервера при назначении роли')
          return
        }

        this.$notification.success('Пользователю успешно назначена роль')
      } else {
        this.$notification.error('Не выбран пользователь')
      }
    },

    roleCopyResources(role) {
      copyTextToClipboard(JSON.stringify(find(this.items, { value: role })?.abilities))
    },
  },
}
</script>

<style lang="sass">
.ug-role-menu__item--active
  color: var(--v-primary-lighten5) !important

  .ug-role-menu__item-chip
    color: var(--v-primary-lighten3) !important
</style>
