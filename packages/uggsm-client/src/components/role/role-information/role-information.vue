<template>
  <v-card v-if="role" class="ug-role-information" elevation="0">
    <v-toolbar dense flat>
      <v-toolbar-title class="ml-n4">Выбранная роль: {{ role.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <ug-btn-toggle
        v-model="showAddAbility"
        active-color="error"
        active-icon="mdi-plus mdi-rotate-45"
        class="mr-n4"
        color="primary"
        depressed
        icon-right="mdi-plus"
        label="Добавить способность"
      ></ug-btn-toggle>
    </v-toolbar>
    <v-slide-y-transition>
      <ug-role-ability-add v-if="showAddAbility" :role="role"></ug-role-ability-add>
    </v-slide-y-transition>
    <v-divider></v-divider>
    <v-expansion-panels accordion class="mt-2">
      <v-expansion-panel v-for="ability in role.abilities" :key="ability.name">
        <v-expansion-panel-header>
          <template #default="{ open }">
            <v-row no-gutters>
              <template v-if="open">
                <v-col cols="auto">
                  <v-chip color="secondary" label>{{ ability.name }}</v-chip>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="auto">
                  <v-chip color="lightgrey" label>{{ ability.description }}</v-chip>
                </v-col>
              </template>
              <template v-if="ability.type === 'boolean'">
                <v-col class="ml-2" cols="auto">
                  <v-chip :color="ability.value ? 'success' : 'error'">
                    <span>{{ ability.value ? 'Разрешено' : 'Запрещено' }}</span>
                  </v-chip>
                </v-col>
              </template>
              <template v-if="open">
                <v-col class="text-right" cols="auto">
                  <ug-base-btn color="error" icon="mdi-trash-can" @click="handleDeleteAbility(ability)"></ug-base-btn>
                </v-col>
              </template>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="ug-role-edit d-flex flex-row align-center">
            <template v-if="ability.operator === 'equals'">
              <v-chip color="success" label>Если равно</v-chip>
            </template>
            <template v-if="ability.operator === 'not equals'">
              <v-chip color="error" label>Если не равно</v-chip>
            </template>
            <template v-if="ability.operator === 'in array'">
              <v-chip color="success" label>Если в списке</v-chip>
            </template>
            <template v-if="ability.operator === 'not in array'">
              <v-chip color="error" label>Если не в списке</v-chip>
            </template>
            <v-chip class="mx-1" color="secondary" label>:</v-chip>
            <template v-if="ability.autocomplete === 'access-links-list'">
              <ug-select-many
                v-model="ability.value"
                :items="accessLinksList"
                label="Значение способности"
              ></ug-select-many>
            </template>
            <template v-else-if="ability.autocomplete && ability.type === 'array'">
              <ug-tag-autocomplete
                v-model="ability.value"
                fetch-on-mount
                label="Значение способности"
                :path="`/${ability.autocomplete}`"
              ></ug-tag-autocomplete>
            </template>
            <template v-else-if="!ability.autocomplete && ability.type === 'array'">
              <ug-tag-input v-model="ability.value" label="Значение способности"></ug-tag-input>
            </template>
            <template v-else-if="ability.autocomplete && ability.type === 'string'">
              <ug-base-autocomplete
                v-model="ability.value"
                abel="Значение способности"
                dense
                :endpoint="`/${ability.autocomplete}`"
                hide-details
                item-text="text"
                item-value="value"
              ></ug-base-autocomplete>
            </template>
            <template v-else-if="!ability.autocomplete && ability.type === 'string'">
              <ug-base-input v-model="ability.value" label="Значение способности"></ug-base-input>
            </template>
            <template v-else-if="ability.type === 'boolean'">
              <ug-base-switch v-model="ability.value" class="mt-0"></ug-base-switch>
            </template>
          </div>
          <v-row justify="end">
            <v-col cols="auto">
              <ug-base-btn color="success" depressed label="Обновить" @click="handleUpdate(ability)"></ug-base-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import UgTagAutocomplete from '@/components/base/ui/tag-autocomplete/tag-autocomplete'
import UgTagInput from '@/components/base/ui/tag-input/tag-input'
import UgBtnToggle from '@/components/base/ui/btn-toggle/btn-toggle'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgSelectMany from '@/components/base/ui/select-many/select-many'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch'
import UgRoleAbilityAdd from '../role-ability-add/role-ability-add'

import RoleAPI from '@/api/role'
import { normalizedMenus } from '@/api/helpers/menus'

export default {
  name: 'ug-role-information',

  components: {
    UgBaseInput,
    UgTagAutocomplete,
    UgTagInput,
    UgBaseAutocomplete,
    UgSelectMany,
    UgBaseSwitch,
    UgBtnToggle,
    UgBaseBtn,
    UgRoleAbilityAdd,
  },

  props: {
    role: {
      required: false,
      type: [Object, String],
      default: () => ({}),
    },
  },

  data: () => ({
    showAddAbility: false,
    accessLinksList: normalizedMenus,
  }),

  methods: {
    async handleUpdate(ability) {
      const apiResponse = await RoleAPI.updateAbility(this.role.value, ability.name, ability)

      if (!(apiResponse.status === 200)) {
        this.$notification.error(`Ошибка при обновлении способности ${ability.description}`)
        return
      }

      this.$notification.success(`Способность ${ability.description} успешно обновлена`)
    },

    async handleDeleteAbility(ability) {
      const apiResponse = await RoleAPI.deleteAbility(this.role.value, ability.name)

      if (!(apiResponse.status === 200)) {
        this.$notification.error(`Ошибка при удалении способности ${ability.description}`)
        return
      }

      this.$notification.success(`Способность ${ability.description} успешно удалена`)
    },
  },
}
</script>
