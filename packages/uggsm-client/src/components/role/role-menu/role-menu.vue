<template>
  <v-card class="ug-role-menu" dark width="278">
    <v-list dark nav>
      <v-subheader>Доступные роли</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        active-class="ug-role-menu__item--active"
        mandatory
        @change="roleChange"
      >
        <v-slide-y-transition group>
          <v-list-item v-for="item in roles" :key="item.name" two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip class="ug-role-menu__item-chip" color="secondary" label x-small>{{ item.value }}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu offset-x>
                <template #activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="roleDelete(item.value)">
                    <v-list-item-title class="error--text">Удалить роль</v-list-item-title>
                  </v-list-item>
                  <v-menu :close-on-content-click="false" offset-overwlof offset-y>
                    <template #activator="{ on, attrs }">
                      <v-list-item v-bind="attrs" v-on="on">
                        <v-list-item-title class="primary--text">Назначить роль</v-list-item-title>
                      </v-list-item>
                    </template>
                    <v-card>
                      <v-card-text>
                        <ug-base-autocomplete
                          v-model="user"
                          class="mb-2"
                          dense
                          disallow-free-type
                          endpoint="/master"
                          hide-details
                          label="Пользователь"
                        ></ug-base-autocomplete>
                        <v-btn block class="mt-2" color="secondary" depressed @click="roleAssign(item.value)">
                          Назначить
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                  <v-list-item @click="roleCopyResources(item.value)">
                    <v-list-item-title class="secondary--text">Скопировать ресурсы</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-slide-y-transition>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'

import { copyTextToClipboard } from '@/api/helpers'
import RoleAPI from '@/api/role'
import UserAPI from '@/api/user'
import { compact, find, includes, map } from 'lodash'

export default {
  name: 'ug-role-menu',

  components: { UgBaseAutocomplete },

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
    user: '',
    selectedItem: 0,
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
