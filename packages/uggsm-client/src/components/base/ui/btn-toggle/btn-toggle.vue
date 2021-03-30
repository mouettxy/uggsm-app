<template lang="pug">
.ug-btn-toggle
  ug-base-btn(
    v-bind='$props',
    :icon-right='statedRightIcon',
    :icon-left='statedLeftIcon',
    :color='statedColor',
    @click='handleClick'
  )
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

export default {
  name: 'ug-btn-toggle',

  components: {
    UgBaseBtn,
  },

  props: {
    value: {
      required: true,
      type: Boolean,
    },

    label: {
      required: true,
      type: String,
    },

    iconLeft: {
      required: false,
      type: String,
      default: '',
    },

    iconRight: {
      required: false,
      type: String,
      default: '',
    },

    color: {
      required: false,
      type: String,
      default: '',
    },

    activeColor: {
      required: false,
      type: String,
      default: '',
    },

    activeIcon: {
      required: false,
      type: String,
      default: '',
    },

    text: {
      required: false,
      type: Boolean,
    },

    depressed: {
      required: false,
      type: Boolean,
    },
  },

  computed: {
    statedColor() {
      return this.model ? this.activeColor : this.color
    },

    statedLeftIcon() {
      if (!this.activeIcon) {
        return this.iconLeft
      }

      if (!this.iconLeft) {
        return this.iconLeft
      }

      return this.model ? this.activeIcon : this.iconLeft
    },

    statedRightIcon() {
      if (!this.activeIcon) {
        return this.iconRight
      }

      if (!this.iconRight) {
        return this.iconRight
      }

      return this.model ? this.activeIcon : this.iconRight
    },

    model: {
      get: function () {
        return this.value
      },

      set: function (value) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    handleClick(event) {
      this.model = !this.model
      this.$emit('click', event)
    },
  },
}
</script>
