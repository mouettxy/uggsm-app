<template lang="pug">
.ug-token-filter
  template(v-for='filterEntry in filter')
    ug-token-filter-btn(
      :filter-entry='filterEntry',
      render-slot
    )
  ug-token-filter-add(:tokens='tokens')
</template>

<script>
import UgTokenFilterBtn from './token-filter-btn/token-filter-btn'
import UgTokenFilterAdd from './token-filter-add/token-filter-add'

export default {
  name: 'ug-token-filter',

  components: {
    UgTokenFilterBtn,
    UgTokenFilterAdd,
  },

  props: {
    tokens: {
      required: false,
      type: Array,
      default: () => [],
    },

    cache: {
      required: false,
      type: String,
      default: '',
    },

    predefinedFilters: {
      required: false,
      type: Array,
      default: () => [],
    },
  },

  data: function () {
    return {
      filter: [],
    }
  },

  watch: {
    filter: function (value) {
      this.$emit('update', value)
    },
  },

  mounted: function () {
    this.extendFilterWith(this.predefinedFilters)
  },

  methods: {
    extendFilterWith(extend) {
      this.filter = [...this.filter, ...extend]
    },
  },
}
</script>

<style lang="sass">
// *
</style>
