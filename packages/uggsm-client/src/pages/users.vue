<route>
{
  "name": "users",
  "meta": {
    "header": "Пользователи"
  }
}
</route>

<template>
  <div class="ug-page-users">
    <ug-table-remote
      :fetch-function="fetchFunction"
      :headers-schema="headersSchema"
      headers-schema-id="headers-id"
      :include-middle-toolbar="false"
      :include-search-field="true"
      socket-event="users updated"
    >
      <template #item.role="{ item }">
        <ug-base-select
          v-model="item.role"
          class="pa-2"
          item-text="text"
          item-value="value"
          :items="roles"
          label="Роль"
          single-line
          @change="handleRoleChange(item)"
        ></ug-base-select>
      </template>
      <template #item.actions="{ item }">
        <ug-base-btn color="red" icon="mdi-trash-can" @click="handleRoleDelete(item)"></ug-base-btn>
      </template>
    </ug-table-remote>
  </div>
</template>

<script>
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'
import UgTableRemote from '@/components/base/table/table-remote/table-remote'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import UserAPI from '@/api/user'

export default {
  name: 'ug-page-users',

  components: {
    UgTableRemote,
    UgBaseSelect,
    UgBaseBtn,
  },

  data: () => ({
    roles: [],
    headersSchema: {
      id: 'Идентификатор',
      username: 'Логин',
      role: 'Роль',
      credentials: 'Имя',
      actions: 'Действия',
    },
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
