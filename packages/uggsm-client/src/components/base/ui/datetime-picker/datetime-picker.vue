<template lang="pug">
date-picker.datetime-picker-2(
  v-model='model',
  :type='type',
  :range='range',
  :format='format',
  :clearable='false',
  value-type='format',
  placeholder='дату'
)
  template(#input='{props}')
    ug-base-input(
      v-model='props.value',
      :label='label',
      :icon='icon'
    )
  template(#icon-calendar)
    span
</template>

<script>
import DatePicker from 'vue2-datepicker'
import UgBaseInput from '@/components/base/ui/base-input/base-input'

import '@/sass/vue2-datepicker.sass'
import 'vue2-datepicker/locale/ru'
import moment from 'moment'

export default {
  name: 'ug-datetime-picker',

  components: {
    DatePicker,
    UgBaseInput,
  },

  props: {
    value: {
      required: true,
      type: [String, Array],
    },

    range: {
      required: false,
      type: [Boolean],
    },

    format: {
      required: false,
      type: [String],

      default: 'DD.MM.YYYY',
    },

    type: {
      required: false,
      type: [String],

      default: 'date',
    },

    label: {
      required: false,
      type: [String],

      default: 'Дата',
    },

    returnIsoString: {
      required: false,
      type: [Boolean],
    },

    icon: {
      required: false,
      type: [String],
    },
  },
  computed: {
    model: {
      get: function () {
        if (this.returnIsoString) {
          return moment(this.value).format(this.format)
        }

        return this.value
      },
      set: function (value) {
        if (this.returnIsoString) {
          this.$emit('input', moment(value, this.format).toISOString())
        } else {
          this.$emit('input', value)
        }
      },
    },
  },
}
</script>
