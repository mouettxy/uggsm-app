<route>
{
  "name": "users",
  "meta": {
    "header": "Пользователи"
  }
}
</route>

<template lang="pug">
.page-users
  ug-table-remote(
    :include-search-field='true',
    :include-middle-toolbar='false',
    :headers-schema='headersSchema',
    :filter-tokens='filterTokens',
    :fetch-function='fetchFunction',
    socket-event='users updated',
    headers-schema-id='headers-id',
    filter-name='users'
  )
    template(#item.role='{ item }')
      ug-table-select(
        v-model='item.role',
        :items='roles',
        @change='handleRoleChange(item)',
        label='Выберите роль'
      )
    template(#item.actions='{ item }')
      ug-base-btn(
        @click='handleRoleDelete(item)',
        icon='mdi-trash-can',
        color='red'
      )
</template>

<script>
import UgTableSelect from '@/components/base/table/table-select/table-select'
import UserAPI from '@/api/user'
import { Filters } from '@/helpers/filterHelper'

export default {
  components: {
    UgTableSelect,
  },

  data: () => ({
    headersSchema: {
      id: 'Идентификатор',
      username: 'Логин',
      role: 'Роль',
      credentials: 'Имя',
      actions: 'Действия',
    },

    roles: [],

    filterTokens: Filters.users,
  }),

  mounted() {
    this.fetchRoles()
  },

  methods: {
    async fetchFunction(data) {
      const response = await UserAPI.getPaginated(data)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить данные')
        return []
      }

      return response.data
    },

    async handleRoleChange(item) {
      const apiResponse = await UserAPI.update(item._id, { role: item.role })

      if (!(apiResponse.status === 200)) {
        this.$notification.error('Ошибка сервера при назначении роли')
        return
      }

      this.$notification.success('Пользователю успешно назначена роль')
    },

    async handleRoleDelete(item) {
      const apiResponse = await UserAPI.delete(item._id)

      if (!(apiResponse.status === 200)) {
        this.$notification.error('Ошибка сервера при удалении пользователя')
        return
      }

      this.$notification.success('Пользователь удалён')
    },

    async fetchRoles() {
      this.roles = (await this.$axios.get('/autocomplete/roles')).data
    },
  },
}
</script>
