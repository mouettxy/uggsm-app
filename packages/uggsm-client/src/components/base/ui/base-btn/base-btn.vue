<template lang="pug">
v-btn.ug-base-btn(
  :type='type',
  :text='text',
  :icon='!!icon && !label',
  :disabled='disabled',
  :depressed='depressed',
  :color='color',
  :block='block',
  @click='handleClick'
)
  template(v-if='icon && label')
    v-icon(left) {{ icon }}
    span {{ label }}
  template(v-else-if='icon')
    v-icon {{ icon }}
  template(v-else)
    v-icon(
      v-if='iconLeft',
      left
    ) {{ iconLeft }}
    span {{ label }}
    v-icon(
      v-if='iconRight',
      right
    ) {{ iconRight }}
</template>

<script>
export default {
  name: 'ug-base-btn',
  props: {
    label: {
      required: false,
      type: String,
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

    type: {
      required: false,
      type: String,
      default: '',
    },
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="sass"></style>
