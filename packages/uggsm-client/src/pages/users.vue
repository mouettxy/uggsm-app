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
    :fetch-function='fetchFunction',
    socket-event='users updated',
    headers-schema-id='headers-id'
  )
    template(#item.role='{ item }')
      ug-base-select.pa-2(
        v-model='item.role',
        :items='roles',
        @change='handleRoleChange(item)',
        single-line,
        label='Роль',
        item-value='value',
        item-text='text'
      )
    template(#item.actions='{ item }')
      ug-base-btn(
        @click='handleRoleDelete(item)',
        icon='mdi-trash-can',
        color='red'
      )
</template>

<script lang="ts">
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'

import UserAPI from '@/api/user'
import { User } from '@/typings/api/user'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    UgBaseSelect,
  },
})
export default class PageUsers extends Vue {
  public headersSchema = {
    id: 'Идентификатор',
    username: 'Логин',
    role: 'Роль',
    credentials: 'Имя',
    actions: 'Действия',
  }

  public roles: { text: string; value: string }[] = []

  async fetchFunction(data: any) {
    const response = await UserAPI.getPaginated(data)

    if (response.status !== 200) {
      this.$notification.error('Не удалось получить данные')
      return []
    }

    return response.data
  }

  async handleRoleChange(item: User) {
    const apiResponse = await UserAPI.update(item._id, { role: item.role })

    if (!(apiResponse.status === 200)) {
      this.$notification.error('Ошибка сервера при назначении роли')
      return
    }

    this.$notification.success('Пользователю успешно назначена роль')
  }

  async handleRoleDelete(item: User) {
    const apiResponse = await UserAPI.delete(item._id)

    if (!(apiResponse.status === 200)) {
      this.$notification.error('Ошибка сервера при удалении пользователя')
      return
    }

    this.$notification.success('Пользователь удалён')
  }

  async fetchRoles() {
    this.roles = (await this.$axios.get('/autocomplete/roles')).data
  }

  mounted() {
    this.fetchRoles()
  }
}
</script>
