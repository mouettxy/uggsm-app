<template>
  <ug-modal-center v-model="addDetailModal" content-class="ug-modal-order-work-add" eager>
    <template #activator="{ on, attrs }">
      <ug-base-btn
        v-if="!isOrderClosed && $can('addOrderWork', 'Global')"
        v-bind="attrs"
        color="success darken-1"
        label="Добавить запчасть"
        icon-left="mdi-plus"
        v-on="on"
      ></ug-base-btn>
    </template>
    <ug-modal-content>
      <template #header>
        <div class="d-flex justify-space-between align-center w-100">
          <h5 class="text-h5">Добавление запчасти</h5>
          <ug-base-btn icon="mdi-close" @click="handleClose"></ug-base-btn>
        </div>
      </template>
      <template #main>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <ug-base-autocomplete
                v-model="detailModel.header"
                label="Название работы"
                icon="mdi-hammer-screwdriver"
                endpoint="/custom?m=Order&f=usedDetails.header&v=usedDetails.header&t=array"
                hint="Запчасть или список запчастей через запятую"
                persistent-hint
              ></ug-base-autocomplete>
            </v-col>
            <v-col cols="12">
              <ug-base-input
                v-model="detailModel.price"
                :hide-details="true"
                :single-line="false"
                suffix="₽"
                :rules="[(v) => v > 0 || 'Введите число без лишних знаков']"
                type="number"
                label="Цена работы"
              ></ug-base-input>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #footer>
        <ug-base-btn icon-left="mdi-content-save" color="primary" label="Добавить" @click="handleSubmit"></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" @click="handleClose"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-center>
</template>

<script>
import UgModalCenter from '@/components/base/ui/modal-center/modal-center'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgBaseInput from '@/components/base/ui/base-input/base-input'

import OrderAPI from '@/api/order'
import CashAPI from '@/api/cash'
import { mapState } from 'vuex'

export default {
  name: 'ug-modal-order-detail-add',

  components: {
    UgModalCenter,
    UgModalContent,
    UgBaseBtn,
    UgBaseAutocomplete,
    UgBaseInput,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    isOrderClosed: {
      required: false,
      type: Boolean,
    },
  },

  data: () => ({
    addDetailModal: false,
    detailModel: {
      header: '',
      message: '',
      credentials: '',
      price: 1000,
      userid: null,
      createdBy: null,
    },
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      office: (state) => state.settings.office,
    }),

    detailMessage() {
      if (this.detailModel.header.indexOf(',') !== -1) {
        return `запчасти: ${this.detailModel.header}`
      }

      return `запчасть: ${this.detailModel.header}`
    },
  },

  methods: {
    rewindModal() {
      this.addDetailModal = false

      this.detailModel = {
        header: '',
        message: '',
        credentials: '',
        price: 1000,
        userid: null,
        createdBy: null,
      }
    },

    async addUsedDetail() {
      const request = {
        ...this.detailModel,
        userid: this.user.id,
        credentials: this.user.credentials,
        createdBy: this.user.id,
        message: this.detailMessage,
      }

      const response = await OrderAPI.addUsedDetail(this.order.id, request)

      if (response.status !== 200) {
        return
      }

      return true
    },

    async addCashEntry() {
      const request = {
        comment: `Расход по заказу #${this.order.id} - ${this.detailMessage}`,
        cashier: this.user._id,
        consumption: Math.abs(this.detailModel.price),
        orderid: this.order.id,
      }

      const response = await CashAPI.createByOffice(this.office.code, request)

      if (response.status !== 200) {
        return false
      }

      return true
    },

    async handleSubmit() {
      const { form } = this.$refs

      if (form.validate()) {
        const isUsedDetailSended = await this.addUsedDetail()

        if (isUsedDetailSended) {
          const isCashSended = await this.addCashEntry()

          if (!isCashSended) {
            this.$notification.warning('Запчасть добавлена, но не удалось добавить расход в кассу')
          } else {
            this.$notification.success('Запчасть успешно добавлена')
          }
        } else {
          this.notification.error('Не удалось добавить запчасть')
        }

        this.rewindModal()
      }
    },

    handleClose() {
      this.rewindModal()
    },
  },
}
</script>
