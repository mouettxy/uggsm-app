<template lang="pug">
v-dialog.ug-modal-fullscreen(
  v-model='model',
  transition='slide-y-transition',
  internal-activator,
  fullscreen
)
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  v-card
    slot
    slot(name='content')
</template>

<script>
export default {
  name: 'ug-modal-fullscreen',

  props: {
    value: {
      required: true,
      type: [Boolean],
    },
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
  },
}
</script>
