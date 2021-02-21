import { Ability, AbilityClass } from '@casl/ability'

export type Actions =
  | ''
  | 'manage'
  | 'access'
  | 'createOrder'
  | 'editOrder'
  | 'createGuarantyOrder'
  | 'editOrderManager'
  | 'addOrderWork'
  | 'deleteOrderWork'
  | 'addOrderIncome'
  | 'addOrderConsumption'
  | 'editOrderStatus'
  | 'editOrderOffice'
  | 'editOrderMaster'
  | 'editClient'
  | 'addClientPhone'
  | 'deleteClientPhone'
  | 'addCashIncome'
  | 'addCashConsumption'
  | 'listenCalls'
  | 'seeOrdersFromOffices'
export type Subjects = 'Global' | 'all'

export type UggsmAbility = Ability<[Actions, Subjects]>
export const UggsmAbility = Ability as AbilityClass<UggsmAbility>
