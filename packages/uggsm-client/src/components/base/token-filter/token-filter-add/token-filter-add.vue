<template lang="pug">
.ug-token-filter-add
  ug-responsive-menu(:menu-props='{ "close-on-content-click": false, "offset-x": true, "max-height": 300 }')
    template(#activator='{on, attrs}')
      .ug-token-filter-add__button(
        v-on='on',
        v-bind='attrs'
      )
        ug-base-chip(color='#ddd')
          v-icon mdi-plus
    v-card.ug-token-filter-add__options(elevation='4')
      v-list(dense)
        v-subheader Выберите фильтр
        template(v-if='tokens.length')
          template(v-for='(token, tokenIndex) in tokens')
            ug-token-filter-edit(
              :token-index='tokenIndex',
              :token='token',
              @add-filter='$emit("add-filter", $event)'
            )
        template(v-else)
          .ug-token-filter-add__options--no-tokens
            span.text-subtitle-1.warning--text
              | Пока нет доступных токенов, в скором времени они будут добавлены.
              br
              | Спасибо за ваше терпение!
</template>

<script>
import UgTokenFilterEdit from '../token-filter-edit/token-filter-edit'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'

export default {
  name: 'ug-token-filter-add',

  components: {
    UgTokenFilterEdit,
    UgResponsiveMenu,
    UgBaseChip,
  },

  props: {
    tokens: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-add
  display: inline-block

  .ug-token-filter-add__button
    cursor: pointer

    .ug-base-chip
      cursor: inherit

.ug-token-filter-add__options
  background: var(--v-table_lightgrey-base) !important
  .v-list
    background: transparent
    .v-subheader
      font-size: 0.875rem

  &--no-tokens
    padding: 0 8px
    max-width: 400px
</style>
