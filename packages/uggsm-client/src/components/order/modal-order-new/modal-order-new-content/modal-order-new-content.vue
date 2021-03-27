<template>
  <div class="ug-modal-order-new-content">
    <v-row>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.customerName"
          :icon="customerNameIcon"
          :hide-details="true"
          label="Имя клиента"
          endpoint="/customer-name"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.customerPhone"
          :hide-details="true"
          :replace-search-with="orderModel.customerName"
          phone
          label="Телефон клиента"
          icon="mdi-phone"
          endpoint="/customer-phone"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-input
          v-model="orderModel.password"
          :single-line="false"
          label="Пароль"
          icon="mdi-cellphone-key"
        ></ug-base-input>
      </v-col>
      <v-col cols="12">
        <ug-base-input
          v-model="orderModel.serialNumber"
          :single-line="false"
          label="Серийный номер"
          icon="mdi-fingerprint"
        ></ug-base-input>
      </v-col>
      <v-col cols="12">
        <ug-base-input
          v-model="orderModel.declaredPrice"
          :single-line="false"
          label="Ориентировочная цена"
          icon="mdi-cash"
        ></ug-base-input>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.phoneBrand"
          :hide-details="true"
          label="Бренд"
          icon="mdi-cellphone-information"
          endpoint="/phone-brand"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.phoneModel"
          :hide-details="true"
          label="Модель"
          icon="mdi-cellphone-information"
          endpoint="/phone-model"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.declaredDefect"
          :hide-details="true"
          label="Первичная неисправность"
          icon="mdi-cellphone-erase"
          endpoint="/declared-defect"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.appearance"
          :hide-details="true"
          :predefined-items="[{ value: 'царапины и потёртости', text: 'царапины и потёртости' }]"
          label="Внешний вид"
          icon="mdi-cellphone-text"
          endpoint="/appearance"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.kit"
          :hide-details="true"
          :predefined-items="[
            {
              value: 'устройство без сим карты, чехла, карты памяти',
              text: 'устройство без сим карты, чехла, карты памяти',
            },
          ]"
          label="Комплектация"
          icon="mdi-cellphone-cog"
          endpoint="/kit"
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-datetime-picker2
          v-model="orderModel.estimatedCloseAt"
          :add="24"
          :hide-details="true"
          type="hours"
          label="Дата готовности"
          icon="mdi-alarm-check"
        ></ug-datetime-picker2>
      </v-col>
      <v-col cols="12">
        <ug-base-switch
          v-model="orderModel.quick"
          class="mt-0"
          label="Срочно"
          icon="mdi-alarm-light"
          color="error"
        ></ug-base-switch>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.master"
          label="Мастер"
          icon="mdi-account-hard-hat"
          endpoint="/master"
          :hide-details="true"
          disallow-free-type
        ></ug-base-autocomplete>
      </v-col>
      <v-col cols="12">
        <ug-base-autocomplete
          v-model="orderModel.manager"
          :predefined-items="predefinedManagerFields"
          :hide-details="true"
          :disabled="isObjectId(orderModel.manager)"
          label="Менеджер"
          icon="mdi-account-cowboy-hat"
          endpoint="/manager"
          disallow-free-type
        ></ug-base-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgDatetimePicker2 from '@/components/base/ui/datetime-picker-2/datetime-picker-2'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import { mapState } from 'vuex'

export default {
  name: 'ug-modal-order-new-content',

  components: {
    UgBaseAutocomplete,
    UgBaseInput,
    UgDatetimePicker2,
    UgBaseSwitch,
  },

  model: {
    prop: 'order',
    event: 'input',
  },

  props: {
    order: {
      required: true,
      type: Object,
    },
  },

  data: () => ({
    customerNameIcon: 'mdi-account-plus',
    predefinedManagerFields: [
      {
        value: '',
        text: '',
      },
    ],
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),

    orderModel: {
      get() {
        return this.order
      },

      set(value) {
        this.$emit('input', value)
      },
    },
  },

  created() {
    this.predefinedManagerFields = [
      {
        value: this.user._id,
        text: this.user.credentials,
      },
    ]
  },

  methods: {
    isObjectId(str) {
      if (str && str.match(/^[0-9a-fA-F]{24}$/)) {
        return true
      }

      return false
    },

    async handleCustomerNameBlur() {
      const isClientExists = await this.checkClientExistance()

      if (isClientExists) {
        this.customerNameIcon = 'mdi-account-check'
        return
      }

      this.customerNameIcon = 'mdi-account-plus'
    },

    async checkClientExistance() {
      try {
        //!FIXME: axios call in component
        const response = await this.$axios.get('/autocomplete/customer-phone', {
          params: { search: this.model.customerName },
        })

        if (response.data.length > 0) {
          return true
        }

        return false
      } catch (error) {
        return false
      }
    },
  },
}
</script>

<style></style>
