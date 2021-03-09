<template lang="pug">
.ug-order-edit-time
  template(v-if='editable')
    v-slide-y-reverse-transition(leave-absolute)
      .ug-order-edit-time__editable-text(v-if='!editMode')
        template(v-if='invalidDate')
          v-chip(
            :small='small',
            @click='enableEditMode',
            label,
            color='warning'
          ) Некорректная дата
        template(v-else)
          v-chip(
            :small='small',
            :color='chipColor',
            @click='enableEditMode',
            label
          ) {{ dateString }}
    v-slide-y-transition(
      leave-absolute,
      hide-on-leave
    )
      .ug-order-edit-time__editable-input(v-if='editMode')
        ug-datetime-picker-2.ug-order-edit-time__editable-input__field(
          v-model='model',
          :fill='chipColor',
          :add='24',
          @input='onTimeChange',
          type='hours',
          small,
          label='Дата готовности',
          icon='mdi-alarm-check'
        )
        v-btn.ug-order-edit-time__editable-input__close(
          @click='disableEditMode',
          icon,
          color='error'
        )
          v-icon mdi-close
  template(v-else)
    template(v-if='invalidDate')
      v-chip(
        :small='small',
        label,
        color='warning'
      ) Некорректная дата
    template(v-else)
      v-chip(
        :small='small',
        :color='chipColor',
        label
      ) {{ dateString }}
</template>

<script>
import UgDatetimePicker2 from '@/components/base/ui/datetime-picker-2/datetime-picker-2.vue'
import moment from 'moment'
import { includes } from 'lodash'
import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-order-edit-time',

  components: {
    UgDatetimePicker2,
  },

  props: {
    time: {
      required: true,
      validator: (prop) => typeof prop === 'string' || prop === null,
    },

    orderStatus: {
      required: true,
      type: [String],
    },

    small: {
      required: false,
      type: [Boolean],
    },

    editable: {
      required: false,
      type: [Boolean],
    },

    path: {
      required: false,
      type: [String],
      default: '',
    },

    orderid: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },

  data: function () {
    return {
      invalidDate: false,
      editMode: false,
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),

    model: {
      get: function () {
        return this.time
      },

      set: function (value) {
        this.$emit('change', value)
      },
    },

    dateString() {
      return moment(this.time).format('DD.MM.YYYY HH:mm')
    },

    isExpired() {
      return (
        moment(this.time).isBefore(moment()) &&
        !includes(['Закрыт', 'Выкуплен СЦ', 'Обещали найти', 'Закрыт с вопросом'], this.orderStatus)
      )
    },

    chipColor() {
      return this.isExpired ? 'error' : 'softgrey'
    },
  },

  watch: {
    time: function (value) {
      if (value === 'Invalid date' || value === 'Invalid date Invalid date' || value === null) {
        this.invalidDate = true
      } else {
        this.invalidDate = false
      }
    },
  },

  mounted: function () {
    if (this.time === 'Invalid date' || this.time === 'Invalid date Invalid date' || this.time === null) {
      this.invalidDate = true
    }
  },

  methods: {
    enableEditMode() {
      this.editMode = true
    },

    disableEditMode() {
      this.editMode = false
    },

    async onTimeChange(evt) {
      const response = await OrderAPI.setEstimatedCloseAt(this.orderid, {
        time: evt,
        userid: this.user.id,
      })

      if (response.status !== 200) {
        this.$notification.error('Ошибка при смене срока заказа')
        return
      }

      this.$notification.success('Успешная смена срока заказа')
      this.disableEditMode()
    },
  },
}
</script>

<style lang="sass">
.ug-order-edit-time
  .ug-order-edit-time__editable-input
    display: flex
    position: relative
    .ug-order-edit-time__editable-input__close
      position: absolute
      top: -2px
      right: 16px
</style>
