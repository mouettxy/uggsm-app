<template lang="pug">
v-btn.ug-base-btn(
  :type='type',
  :text='text',
  :icon='!!icon && !label',
  :disabled='disabled',
  :depressed='depressed',
  :color='color',
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
    },
    icon: {
      required: false,
      type: String,
    },
    iconLeft: {
      required: false,
      type: String,
    },
    iconRight: {
      required: false,
      type: String,
    },
    color: {
      required: false,
      type: String,
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
    type: {
      required: false,
      type: String,
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
