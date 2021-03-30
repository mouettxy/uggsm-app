<template>
  <v-row class="ug-modal-order-info-fields">
    <v-col cols="12" lg="6" md="6">
      <ug-modal-client v-if="orderModel.customer && orderModel.customer.id" :clientid="orderModel.customer.id">
        <template #activator="{ on, attrs }">
          <ug-base-chip v-bind="attrs" v-on="on">
            <v-icon size="1.3rem" color="dark">mdi-pencil</v-icon>
            <span class="text-subtitle-1">{{ orderModel.customerName }}</span>
          </ug-base-chip>
        </template>
      </ug-modal-client>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-chip class="text-subtitle-1 ug-modal-order-info-fields__customer-phone">
        <a class="dark--text" :href="`tel:8${orderModel.customerPhone}`">
          {{ orderModel.customerPhone | VMask('+7 (###) ###-##-##') }}
        </a>
      </ug-base-chip>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-input
        v-model="orderModel.serialNumber"
        :disabled="canEditGeneralFields"
        :hide-details="true"
        label="Серийный номер"
        icon="mdi-fingerprint"
      ></ug-base-input>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-input
        v-model="orderModel.declaredPrice"
        :disabled="canEditGeneralFields"
        :hide-details="true"
        type="number"
        label="Ориентировочная цена"
        icon="mdi-cash"
      ></ug-base-input>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.phoneBrand"
        :predefined-items="orderModel.phoneBrand ? [{ text: orderModel.phoneBrand, value: orderModel.phoneBrand }] : []"
        :hide-details="true"
        :disabled="canEditGeneralFields"
        label="Бренд"
        icon="mdi-cellphone-information"
        endpoint="/phone-brand"
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.phoneModel"
        :predefined-items="orderModel.phoneModel ? [{ text: orderModel.phoneModel, value: orderModel.phoneModel }] : []"
        :hide-details="true"
        :disabled="canEditGeneralFields"
        label="Модель"
        icon="mdi-cellphone-information"
        endpoint="/phone-model"
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.declaredDefect"
        :predefined-items="
          orderModel.declaredDefect ? [{ text: orderModel.declaredDefect, value: orderModel.declaredDefect }] : []
        "
        :hide-details="true"
        :disabled="canEditGeneralFields"
        label="Первичная неисправность"
        icon="mdi-cellphone-erase"
        endpoint="/declared-defect"
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.appearance"
        :predefined-items="orderModel.appearance ? [{ text: orderModel.appearance, value: orderModel.appearance }] : []"
        :hide-details="true"
        :disabled="canEditGeneralFields"
        label="Внешний вид"
        icon="mdi-cellphone-text"
        endpoint="/appearance"
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.kit"
        :predefined-items="orderModel.kit ? [{ text: orderModel.kit, value: orderModel.kit }] : []"
        :disabled="canEditGeneralFields"
        label="Комплектация"
        :hide-details="true"
        icon="mdi-cellphone-cog"
        endpoint="/kit"
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-switch
        v-model="orderModel.quick"
        class="mt-0"
        :disabled="canEditGeneralFields"
        label="Срочно"
        icon="mdi-alarm-light"
        color="error"
      ></ug-base-switch>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.master._id"
        :predefined-items="
          orderModel.master ? [{ text: orderModel.master.credentials, value: orderModel.master._id }] : []
        "
        :disabled="isMasterFieldDisabled"
        label="Мастер"
        :hide-details="true"
        icon="mdi-account-hard-hat"
        endpoint="/master"
        disallow-free-type
      ></ug-base-autocomplete>
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ug-base-autocomplete
        v-model="orderModel.manager._id"
        :predefined-items="
          orderModel.manager ? [{ text: orderModel.manager.credentials, value: orderModel.manager._id }] : []
        "
        :disabled="isManagerFieldDisabled"
        label="Менеджер"
        :hide-details="true"
        icon="mdi-account-cowboy-hat"
        endpoint="/manager"
        disallow-free-type
      ></ug-base-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import UgModalClient from '@/components/client/modal-client/modal-client'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'

export default {
  name: 'ug-modal-order-info-fields',

  components: {
    UgModalClient,
    UgBaseAutocomplete,
    UgBaseSwitch,
    UgBaseInput,
    UgBaseChip,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    canEditGeneralFields() {
      return !this.$can('editOrder', 'Global')
    },

    isMasterFieldDisabled() {
      if (this.$can('editOrderMaster', 'Global')) {
        return false
      }

      return true
    },

    isManagerFieldDisabled() {
      if (this.$can('editOrderManager', 'Global')) {
        return false
      }

      return true
    },

    orderModel: {
      get() {
        return this.order
      },

      set(value) {
        this.$emit('update:order', value)
      },
    },
  },

  created() {
    if (!this.orderModel.manager) {
      this.orderModel.manager = {
        _id: '',
        credentials: 'НЕВЕРНОЕ ЗНАЧЕНИЕ',
      }
    }

    if (!this.orderModel.master) {
      this.orderModel.master = {
        _id: '',
        credentials: 'НЕВЕРНОЕ ЗНАЧЕНИЕ',
      }
    }
  },
}
</script>

<style lang="sass">
.ug-modal-order-info-fields__customer-phone a
  text-decoration: none !important
</style>
