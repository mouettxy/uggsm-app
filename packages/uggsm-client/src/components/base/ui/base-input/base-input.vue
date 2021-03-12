<template lang="pug">
.ug-base-input
  template(v-if='type === "number"')
    v-text-field(
      v-bind='attrs',
      ref='input',
      v-model.number='model',
      :type='type',
      :suffix='suffix',
      :rules='rules',
      :prepend-inner-icon='icon',
      :prefix='prefix',
      :placeholder='label',
      :label='label',
      :hide-details='true',
      :disabled='disabled',
      @focus='handleFocus',
      @blur='handleBlur',
      single-line,
      dense
    )
      template(#append)
        .ug-base-input__append
          .ug-base-input__hint-content(ref='hint')
            div(v-md.html) {{ hint }}

          .ug-base-input__mark
            template(v-if='hint')
              v-avatar.ug-base-input__question-mark(
                ref='append',
                @mouseover.native='handleAppendMouseOver',
                @mouseleave.native='handleAppendMouseLeave',
                @click.prevent='handleAppendClick',
                size='24'
              )
                v-icon(
                  ref='icon',
                  small,
                  color='primary'
                ) mdi-help
  template(v-else-if='["text", "password"].includes(type)')
    v-text-field(
      v-bind='attrs',
      ref='input',
      v-model='model',
      :type='type',
      :suffix='suffix',
      :rules='rules',
      :prepend-inner-icon='icon',
      :prefix='prefix',
      :placeholder='label',
      :label='label',
      :hide-details='true',
      :disabled='disabled',
      @focus='handleFocus',
      @blur='handleBlur',
      v-mask='phoneMask',
      single-line,
      dense
    )
      template(#append)
        .ug-base-input__append
          .ug-base-input__hint-content(ref='hint')
            div(v-md.html) {{ hint }}

          .ug-base-input__mark
            template(v-if='hint')
              v-avatar.ug-base-input__question-mark(
                ref='append',
                @mouseover.native='handleAppendMouseOver',
                @mouseleave.native='handleAppendMouseLeave',
                @click.prevent='handleAppendClick',
                size='24'
              )
                v-icon(
                  ref='icon',
                  small,
                  color='primary'
                ) mdi-help
</template>

<script>
import BaseInputAnimations from './base-input.animations'

export default {
  name: 'ug-base-input',

  mixins: [BaseInputAnimations],

  props: {
    value: {
      required: false,
      type: [String, Number],
      default: '',
    },

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

    hint: {
      required: false,
      type: String,
      default: '',
    },

    rules: {
      required: false,
      type: Array,
      default: () => [],
    },

    type: {
      required: false,
      type: [String],
      default: 'text',
      validator: (v) => {
        return ['text', 'number', 'password'].includes(v)
      },
    },

    phone: {
      required: false,
      type: [Boolean],
    },

    suffix: {
      required: false,
      type: [String],
      default: '',
    },

    prefix: {
      required: false,
      type: [String],
      default: '',
    },

    disabled: {
      required: false,
      type: [Boolean],
    },

    onFocusSolo: {
      required: false,
      type: [Boolean],
    },
  },

  data: function () {
    return {
      hasFocus: false,
    }
  },

  computed: {
    model: {
      get: function () {
        return this.value
      },

      set: function (value) {
        this.$emit('input', value)
      },
    },

    phoneMask() {
      if (this.phone) {
        return '+7 (###) ###-##-##'
      } else {
        return false
      }
    },

    attrs() {
      if (this.hasFocus && this.onFocusSolo) {
        return { solo: true }
      }

      return { outlined: true }
    },
  },

  mounted: function () {
    if (this.type === 'number') {
      const { input } = this.$refs

      input.$el.querySelector('input').style.appearance = 'textfield'
    }
  },

  methods: {
    handleAppendMouseOver() {
      const { append } = this.$refs

      this.animateAppend(append.$el)
    },

    handleAppendMouseLeave() {
      const { append } = this.$refs

      this.deanimateAppend(append.$el)
    },

    handleAppendClick() {
      const { hint } = this.$refs

      this.animateHint(hint)
    },

    handleBlur() {
      this.deanimateHint()

      this.hasFocus = false
    },

    handleFocus() {
      this.hasFocus = true
    },
  },
}
</script>

<style lang="sass">
.ug-base-input
  .ug-base-input__append
    position: relative
    .ug-base-input__hint-content
      color: #151515 !important
      position: absolute
      display: none
      overflow: hidden
    .ug-base-input__mark
      margin-top: -1px
      border-radius: 50%
  .v-input__append-inner
    cursor: help !important
</style>
