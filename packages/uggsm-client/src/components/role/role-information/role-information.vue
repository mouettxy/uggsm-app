<template lang="pug">
v-card.ug-role-information(
  v-if='role',
  elevation='0'
)
  v-toolbar(
    flat,
    dense
  )
    v-toolbar-title.ml-n4 Выбранная роль: {{ role.name }}
    v-spacer
    ug-btn-toggle.mr-n4(
      v-model='showAddAbility',
      label='Добавить способность',
      icon-right='mdi-plus',
      depressed,
      color='primary',
      active-icon='mdi-plus mdi-rotate-45',
      active-color='error'
    )
  v-slide-y-transition
    ug-role-ability-add(
      v-if='showAddAbility',
      :role='role'
    )
  v-divider
  //div(
    :style='{ fontSize: "1.15rem" }',
    v-md) {{ role.description }}
  v-expansion-panels.mt-2(accordion)
    v-expansion-panel(
      v-for='ability in role.abilities',
      :key='ability.name'
    )
      v-expansion-panel-header
        template(#default='{open}')
          v-row(no-gutters)
            template(v-if='open')
              v-col(cols='auto')
                v-chip(
                  label,
                  color='secondary'
                ) {{ ability.name }}
            template(v-else)
              v-col(cols='auto')
                v-chip(
                  label,
                  color='lightgrey'
                ) {{ ability.description }}

            template(v-if='ability.type === "boolean"')
              v-col.ml-2(cols='auto')
                v-chip(
                  :color='ability.value ? "success" : "error"',
                  label
                )
                  span {{ ability.value ? "Разрешено" : "Запрещено" }}

            template(v-if='open')
              v-col.text-right(cols='auto')
                ug-base-btn(
                  @click='handleDeleteAbility(ability)',
                  icon='mdi-trash-can',
                  color='error'
                )

      v-expansion-panel-content
        .ug-role-edit.d-flex.flex-row.align-center
          template(v-if='ability.operator === "equals"')
            v-chip(
              label,
              color='success'
            ) Если равно
          template(v-if='ability.operator === "not equals"')
            v-chip(
              label,
              color='error'
            ) Если не равно
          template(v-if='ability.operator === "in array"')
            v-chip(
              label,
              color='success'
            ) Если в списке
          template(v-if='ability.operator === "not in array"')
            v-chip(
              label,
              color='error'
            ) Если не в списке
          v-chip.mx-1(
            label,
            color='secondary'
          ) :
          template(v-if='ability.autocomplete === "access-links-list"')
            ug-select-many(
              v-model='ability.value',
              :items='accessLinksList',
              label='Значение способности'
            )
          template(v-else-if='ability.autocomplete && ability.type === "array"')
            ug-tag-autocomplete(
              v-model='ability.value',
              :path='`/${ability.autocomplete}`',
              label='Значение способности',
              fetch-on-mount
            )
          template(v-else-if='!ability.autocomplete && ability.type === "array"')
            ug-tag-input(
              v-model='ability.value',
              label='Значение способности'
            )
          template(v-else-if='ability.autocomplete && ability.type === "string"')
            ug-base-autocomplete(
              v-model='ability.value',
              :endpoint='`/${ability.autocomplete}`',
              item-value='value',
              item-text='text',
              hide-details,
              dense,
              abel='Значение способности'
            )
          template(v-else-if='!ability.autocomplete && ability.type === "string"')
            ug-base-input(
              v-model='ability.value',
              label='Значение способности'
            )
          template(v-else-if='ability.type === "boolean"')
            ug-base-switch.mt-0(v-model='ability.value')

        v-row(justify='end')
          v-col(cols='auto')
            ug-base-btn(
              @click='handleUpdate(ability)',
              label='Обновить',
              depressed,
              color='success'
            )
</template>

<script lang="ts">
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete.vue'
import UgSelectMany from '@/components/base/ui/select-many/select-many.vue'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch.vue'

import RoleAPI from '@/api/role'
import { Role, RoleAbility } from '@/typings/api/role'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { normalizedMenus } from '@/api/helpers/menus'

@Component({
  components: {
    UgBaseAutocomplete,
    UgSelectMany,
    UgBaseSwitch,
  },
})
export default class UgRoleInformation extends Vue {
  @Prop() role!: Role

  public showAddAbility = false

  public accessLinksList = normalizedMenus

  async handleUpdate(ability: RoleAbility) {
    const apiResponse = await RoleAPI.updateAbility(this.role.value, ability.name, ability)

    if (!(apiResponse.status === 200)) {
      this.$notification.error(`Ошибка при обновлении способности ${ability.description}`)
      return
    }

    this.$notification.success(`Способность ${ability.description} успешно обновлена`)
  }

  async handleDeleteAbility(ability: RoleAbility) {
    const apiResponse = await RoleAPI.deleteAbility(this.role.value, ability.name)

    if (!(apiResponse.status === 200)) {
      this.$notification.error(`Ошибка при удалении способности ${ability.description}`)
      return
    }

    this.$notification.success(`Способность ${ability.description} успешно удалена`)
  }
}
</script>

<style lang="sass"></style>
