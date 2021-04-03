<template>
  <ug-responsive-menu :menu-props="{ 'offset-y': true, 'max-height': 200, 'min-width': 400, 'max-width': 400 }">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <div class="markdown-reference__content">
      <div class="markdown-reference__item">
        <div class="markdown-reference__title">
          Напишите:
          <br />
          [Название ссылки](https://app.uggsm.ru/)
          <br />
        </div>
        <div v-md class="markdown-reference__example ug-markdown-content">{{ references.link }}</div>
      </div>
      <div class="markdown-reference__item">
        <div class="markdown-reference__title">
          Напишите для вставки картинки:
          <br />
          ![Название картинки](https://ссылка.на.картинку/)
          <br />
        </div>
      </div>
      <div class="markdown-reference__item">
        <div class="markdown-reference__title">
          Напишите:
          <br />
          ---
          <br />
        </div>
        <div v-md class="markdown-reference__example ug-markdown-content">{{ references.dash }}</div>
      </div>
      <div class="markdown-reference__item">
        <div class="markdown-reference__title">
          Напишите:
          <br />
          - Элемент списка
          <br />
          - Элемент списка
          <br />
        </div>
        <div v-md class="markdown-reference__example ug-markdown-content">
          {{ references.lists }}
        </div>
      </div>
    </div>
  </ug-responsive-menu>
</template>

<script>
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'

const REFERENCES_LISTS = `#### Результат

- Элемент списка
- Элемент списка
`

const REFERENCES_DASH = `#### Результат

---
`

const REFERENCES_LINK = `#### Результат

[Название ссылки](https://app.uggsm.ru/)
`

export default {
  name: 'ug-markdown-reference',

  components: {
    UgResponsiveMenu,
  },

  data: () => ({
    references: Object.freeze({
      lists: REFERENCES_LISTS,
      dash: REFERENCES_DASH,
      link: REFERENCES_LINK,
    }),
  }),
}
</script>

<style lang="sass">
.markdown-reference__content
  padding: 12px
  background: var(--v-table_lightgrey-base)

.markdown-reference__title
  padding: 4px 8px
  white-space: nowrap

.markdown-reference__example
  box-shadow: 0 -7px 10px -5px rgba(24, 89, 161, .1) inset, 0 7px 10px -5px rgba(24, 89, 161, .1) inset, 0 0 10px rgba(0, 0, 0, 0.1)
</style>
