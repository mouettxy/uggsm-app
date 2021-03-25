<template lang="pug">
v-btn.ug-base-btn(
  :type='type',
  :to='to',
  :text='text',
  :small='small',
  :icon='!!icon && !label',
  :disabled='disabled',
  :depressed='depressed',
  :color='color',
  :block='block',
  @click='handleClick',
  @blur.native='handleBlur'
)
  template(v-if='renderSlot')
    slot
  template(v-else)
    template(v-if='icon && label')
      v-icon(
        :size='iconSize',
        left
      ) {{ icon }}
      span {{ label }}
    template(v-else-if='icon && !label')
      v-icon(:size='iconSize') {{ icon }}
    template(v-else)
      v-icon(
        v-if='iconLeft',
        :size='iconSize',
        left
      ) {{ iconLeft }}
      span {{ label }}
      v-icon(
        v-if='iconRight',
        :size='iconSize',
        right
      ) {{ iconRight }}
</template>

<script>
export default {
  name: 'ug-base-btn',
  props: {
    label: {
      required: false,
      type: [String, Number],
      default: '',
    },

    icon: {
      required: false,
      type: String,
      default: '',
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

    text: {
      required: false,
      type: Boolean,
    },

    depressed: {
      required: false,
      type: Boolean,
    },

    disabled: {
      required: false,
      type: Boolean,
    },

    block: {
      required: false,
      type: Boolean,
    },

    small: {
      required: false,
      type: Boolean,
    },

    type: {
      required: false,
      type: String,
      default: '',
    },

    renderSlot: {
      required: false,
      type: Boolean,
    },

    iconSize: {
      required: false,
      type: [String, Number],
      default: '',
    },

    to: {
      required: false,
      type: [String, Object, Boolean],
      default: undefined,
    },
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event)
    },

    handleBlur(event) {
      this.$emit('blur', event)
    },
  },
}
</script>

<style lang="sass"></style>
