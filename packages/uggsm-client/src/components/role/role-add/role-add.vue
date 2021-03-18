<template>
  <form @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="5">
        <ug-base-input v-model="name" :hint="nameHint" label="Название роли" :rules="validators.name"></ug-base-input>
      </v-col>
      <v-col cols="5">
        <ug-base-input
          v-model="value"
          :hint="valueHint"
          label="Переменная роли"
          :rules="validators.value"
        ></ug-base-input>
      </v-col>
      <v-col cols="2">
        <v-btn block color="primary" depressed height="40" type="submit">
          <v-icon left>mdi-content-save</v-icon>
          <span>Добавить</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="description"
          height="2"
          hide-details
          label="Опциональный комментарий описывающий роль в системе"
          outlined
        ></v-textarea>
      </v-col>
    </v-row>
  </form>
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input'

import RoleAPI from '@/api/role'

export default {
  name: 'ug-role-add',

  components: {
    UgBaseInput,
  },

  data: () => ({
    validators: {
      name: [(v) => (v || '').length > 0 || 'Обязательное поле для заполнения'],
      value: [(v) => (v || '').length > 0 || 'Обязательное поле для заполнения'],
    },

    value: '',

    name: '',

    description: '',

    showForm: false,

    nameHint: `#### Рекомендации к заполнению \n - Должно быть написано на русском, отображается в интерфейсе \n - Должно отражать краткое значение роли в системе`,

    valueHint: `#### Рекомендации к заполнению \n - Должно быть написано на английском, используется в коде`,
  }),

  methods: {
    clearModel() {
      this.value = ''
      this.name = ''
      this.description = ''
    },

    async handleSubmit() {
      const apiResponse = await RoleAPI.create({
        value: this.value,
        name: this.name,
        description: this.description,
      })

      if (!(apiResponse.status === 200)) {
        this.$notification.error(`Произошла ошибка при создании роли ${this.name} <${this.value}>`)
        return
      }

      this.$notification.success(`Роль ${this.name} <${this.value}> успешно создана`)

      this.clearModel()
      this.$emit('deactivate')
    },
  },
}
</script>
