<template lang="pug">
ug-base-select.ug-select-many(
  v-model='model',
  :label='label',
  :items='items',
  :cache='cache',
  @change='onChange',
  multiple,
  dense
)
  template(#selection='{ item, index }')
    v-chip(
      v-if='index === 0',
      small
    )
      template(v-if='typeof item === "string"')
        span {{ item }}
      template(v-else)
        span {{ item["text"] }}
    v-menu(open-on-hover)
      template(#activator='{on, attrs}')
        v-chip(
          v-if='index === 1',
          v-on='on',
          v-bind='attrs',
          small
        )
          | + {{ model.length - 1 }}
      v-card(dark)
        v-card-text
          span.white--text {{ joinedModel }}
</template>

<script>
import UgBaseSelect from '@/components/base/ui/base-select/base-select'

import { find } from 'lodash'

export default {
  name: 'ug-select-many',

  components: {
    UgBaseSelect,
  },

  props: {
    items: {
      required: true,
      type: [Array],
    },

    value: {
      required: true,
      type: [Array],
    },

    label: {
      required: false,
      type: [String],
    },

    cache: {
      required: false,
      type: [String],
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

    joinedModel() {
      return this.value
        .map((e) => {
          if (this.items.length > 0 && typeof this.items[0] === 'string') {
            return e
          }

          return find(this.items, { value: e })?.text || ''
        })
        .join(', ')
    },
  },

  methods: {
    onChange() {
      this.$emit('change', this.model)
    },
  },
}
</script>
