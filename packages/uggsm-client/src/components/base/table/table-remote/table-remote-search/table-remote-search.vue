<template lang="pug">
ug-base-input.ug-table-remote-search(
  v-model='searchModel',
  placeholder='Поиск...',
  on-focus-solo,
  label='Поиск...',
  icon='mdi-magnify',
  clearable
)
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input'

export default {
  name: 'ug-table-remote-search',

  components: {
    UgBaseInput,
  },

  model: {
    prop: 'search',
    event: 'input',
  },

  props: {
    search: {
      required: true,
      type: String,
    },
  },

  computed: {
    searchModel: {
      get: function () {
        return this.search
      },

      set: function (value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-search
  max-height: 32px !important

  .v-input
    .v-input__slot
      background: var(--v-light-base)
      font-size: 14px !important

      border-radius: 4px
      padding: 0 8px !important
      min-height: 32px !important
      .v-input__prepend-inner
        align-self: start !important
        margin-top: 4px !important
        .v-icon
          font-size: 1.5rem
      .v-text-field__slot
        input
          padding: 4px 0
      fieldset
        border: 1px solid var(--v-table_darkgrey-base)
</style>
