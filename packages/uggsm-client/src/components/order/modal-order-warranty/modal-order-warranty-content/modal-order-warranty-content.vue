<template>
  <div class="modal-order-warranty-content">
    <v-row>
      <v-col cols="12">
        <ug-base-input
          v-model="orderIdModel"
          :single-line="false"
          :hide-details="true"
          type="number"
          prefix="№"
          placeholder="000000"
          label="Заявка"
        ></ug-base-input>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <div v-if="order">
        <v-row>
          <v-col cols="12" class="modal-order-warranty-content__meta">
            <template v-if="order.warrantyCounter">
              <ug-base-chip color="warning">Открывалась по гарантии {{ order.warrantyCounter }} раз</ug-base-chip>
            </template>
            <template v-else>
              <ug-base-chip color="success">Не открывалась по гарантии</ug-base-chip>
            </template>
            <ug-order-status :status="order.status" :orderid="order.id" :editable="false"></ug-order-status>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ug-base-autocomplete
              v-model="defectModel"
              :hide-details="true"
              label="Новая неисправность"
              icon="mdi-cellphone-erase"
              endpoint="/declared-defect"
            ></ug-base-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-list>
            <v-subheader>Прошлые неисправности</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ order.declaredDefect }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <template v-if="order.warrantyCounter">
              <v-list-item v-for="(saved, i) in order.warrantySaved" :key="`saved-${i}`">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ saved.declaredDefect }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-row>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgOrderStatus from '@/components/order/order-status/order-status'

export default {
  name: 'ug-modal-order-warranty-content',

  components: {
    UgBaseInput,
    UgBaseChip,
    UgOrderStatus,
    UgBaseAutocomplete,
  },

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },

    defect: {
      required: false,
      type: String,
      default: '',
    },

    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    orderIdModel: {
      get() {
        return this.orderId
      },

      set(value) {
        this.$emit('update:order-id', value)
      },
    },

    defectModel: {
      get() {
        return this.defect
      },

      set(value) {
        this.$emit('update:defect', value)
      },
    },
  },
}
</script>

<style lang="sass">
.modal-order-warranty-content
  .modal-order-warranty-content__meta
    display: flex
    justify-content: space-between
    flex-wrap: wrap
</style>
