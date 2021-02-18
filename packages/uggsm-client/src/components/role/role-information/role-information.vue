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
          v-row(
            v-if='!open',
            no-gutters
          )
            v-col(cols='auto')
              v-chip(
                label,
                color='secondary'
              ) {{ ability.description }}
            template(v-if='ability.type === "boolean"')
              v-col.ml-2(cols='auto')
                v-chip(
                  :color='ability.value ? "success" : "error"',
                  label
                )
                  span {{ ability.value ? "Разрешено" : "Запрещено" }}
          v-row(
            v-else,
            no-gutters
          )
            v-col(cols='10')
              v-chip(
                label,
                color='secondary'
              ) {{ ability.name }}

            v-col.text-right(cols='2')
              ug-base-btn(
                @click='handleDeleteAbility(ability)',
                icon='mdi-trash-can'
              )

      v-expansion-panel-content
        v-divider
        v-row
          v-col(
            cols='12',
            v-if='ability.autocomplete && ability.type === "array"'
          )
            ug-tag-autocomplete(
              v-model='ability.value',
              :path='`/${ability.autocomplete}`',
              label='Значение способности'
            )
          v-col(
            cols='12',
            v-else-if='!ability.autocomplete && ability.type === "array"'
          )
            ug-tag-input(
              v-model='ability.value',
              label='Значение способности'
            )
          v-col(
            cols='12',
            v-else-if='ability.autocomplete && ability.type === "string"'
          )
            a-autocomplete(
              v-model='ability.value',
              :endpoint='`/${ability.autocomplete}`',
              item-value='value',
              item-text='text',
              hide-details,
              dense,
              abel='Значение способности'
            )
          v-col(
            cols='12',
            v-else-if='!ability.autocomplete && ability.type === "string"'
          )
            ug-base-input(
              v-model='ability.value',
              label='Значение способности'
            )
          v-col(
            cols='12',
            v-else-if='ability.type === "boolean"'
          )
            a-switch.mt-1(
              v-model='ability.value',
              label='Значение способности'
            )
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
import RoleAPI from '@/api/role'
import { Role, RoleAbility } from '@/typings/api/role'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class UgRoleInformation extends Vue {
  @Prop() role!: Role

  public showAddAbility = false

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
