<template>
  <form @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="4">
        <ug-base-input v-model="description" :hint="descriptionHint" label="Название способности"></ug-base-input>
      </v-col>
      <v-col cols="4">
        <ug-base-select
          v-model="type"
          item-text="text"
          item-value="value"
          :items="extendedTypes"
          label="Тип данных значения"
        ></ug-base-select>
      </v-col>
      <v-col cols="4">
        <ug-base-select
          v-model="operator"
          item-text="text"
          item-value="value"
          :items="operators"
          label="Оператор сравнения значеня(-ий)"
        ></ug-base-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <ug-base-input v-model="name" :hint="descriptionHint" label="Переменная способности"></ug-base-input>
      </v-col>
      <v-col cols="4">
        <ug-base-autocomplete
          v-model="autocomplete"
          dense
          :disabled="isChooseAutocompleteDisabled"
          disallow-free-type
          endpoint="/routes"
          hide-details
          item-text="text"
          item-value="value"
          label="Выберите автодополнение"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-slide-x-transition>
          <div v-if="type === 'accessList'">
            <ug-select-many v-model="value" :items="accessLinksList" label="Значение способности"></ug-select-many>
          </div>
          <div v-else-if="autocomplete && type === 'array'">
            <ug-tag-autocomplete
              v-model="value"
              label="Значение способности"
              :path="`/${autocomplete}`"
            ></ug-tag-autocomplete>
          </div>
          <div v-else-if="!autocomplete && type === 'array'">
            <ug-tag-input v-model="value" label="Значение способности"></ug-tag-input>
          </div>
          <div v-else-if="autocomplete && type === 'string'">
            <ug-base-autocomplete
              v-model="value"
              abel="Значение способности"
              dense
              :endpoint="`/${autocomplete}`"
              hide-details
              item-text="text"
              item-value="value"
            ></ug-base-autocomplete>
          </div>
          <div v-else-if="!autocomplete && type === 'string'">
            <ug-base-input v-model="value" label="Значение способности"></ug-base-input>
          </div>
          <div v-else-if="type === 'boolean'">
            <ug-base-switch v-model="value" class="mt-1" label="Значение способности"></ug-base-switch>
          </div>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="auto">
        <ug-base-btn
          color="success"
          depressed
          :disabled="isAddAbilityDisabled"
          label="Добавить способность"
          type="submit"
        ></ug-base-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script>
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete.vue'
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'
import UgSelectMany from '@/components/base/ui/select-many/select-many.vue'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch.vue'
import UgTagAutocomplete from '@/components/base/ui/tag-autocomplete/tag-autocomplete'
import UgTagInput from '@/components/base/ui/tag-input/tag-input'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseInput from '@/components/base/ui/base-input/base-input'

import RoleAPI from '@/api/role'
import { cloneDeep } from 'lodash'
import { normalizedMenus } from '@/api/helpers/menus'

const Defaults = {
  TYPE: 'boolean',
  OPERATOR: 'equals',
}

export default {
  name: 'ug-role-ability-add',

  components: {
    UgTagAutocomplete,
    UgTagInput,
    UgBaseBtn,
    UgBaseInput,
    UgBaseAutocomplete,
    UgBaseSelect,
    UgSelectMany,
    UgBaseSwitch,
  },

  props: {
    role: {
      required: true,
      type: Object,
    },
  },

  data: () => ({
    value: null,
    name: '',
    operator: Defaults.TYPE,
    type: Defaults.OPERATOR,
    types: [],
    operators: [],
    description: '',

    autocomplete: '',

    accessLinksList: normalizedMenus,

    descriptionHint: `#### Рекомендации к заполнению \n - Название способности на русском, отображается в интерфейсе`,

    nameHint: `#### Рекомендации к заполнению \n - Название способности на английском, используется в коде \n - Не должно содержать пробелов`,
  }),

  computed: {
    extendedTypes() {
      return [
        ...this.types,
        {
          text: 'Список ссылок доступа',
          value: 'accessList',
        },
      ]
    },

    isAddAbilityDisabled() {
      if (this.value !== null && this.name && this.description && this.operator && this.type) {
        return false
      }

      return true
    },

    isChooseAutocompleteDisabled() {
      return !(this.type === 'array' || this.type === 'string')
    },
  },

  watch: {
    type: function (value) {
      if (value === 'string') {
        this.value = ''
        this.operator = 'equals'
      } else if (value === 'boolean') {
        this.value = false
        this.operator = 'equals'
      } else if (value === 'array') {
        this.value = []
        this.operator = 'in array'
      } else if (value === 'accessList') {
        this.value = []
        this.operator = 'in array'
      }
    },
  },

  mounted: async function () {
    this.types = await this.getStatic('types')
    this.operators = await this.getStatic('operators')

    this.type = Defaults.TYPE
    this.operator = Defaults.OPERATOR
  },

  methods: {
    clearModel() {
      this.type = Defaults.TYPE
      this.operator = Defaults.OPERATOR

      this.name = ''
      this.description = ''

      this.autocomplete = ''
      this.value = false
    },

    async getStatic(type) {
      const apiResponse = await RoleAPI.getStatic(type)

      return apiResponse.data
    },

    async handleSubmit() {
      if (this.isAddAbilityDisabled || this.value === null) {
        this.$notification.error('Не заполнено какое то из важных полей')
        return
      }

      const fields = cloneDeep({
        value: this.value,
        name: this.name,
        description: this.description,
        operator: this.operator,
        type: this.type,
        autocomplete: this.autocomplete,
      })

      // if field type is access list we change it to it's real type (array)
      // and make unique autocomplete endpoint
      // so other components can know what autocomplete needs to be rendered
      if (fields.type === 'accessList') {
        fields.type = 'array'
        fields.autocomplete = 'access-links-list'
      }

      const apiResponse = await RoleAPI.createAbility(this.role.value, fields)

      if (!(apiResponse.status === 200)) {
        this.$notification.error(`Ошибка сервера при создании способности ${this.description}`)
      }

      this.$notification.success(`Роль ${this.description} успешно создана`)

      this.clearModel()
    },
  },
}
</script>
