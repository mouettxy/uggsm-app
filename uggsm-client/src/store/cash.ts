import { fromPairs, map, zip } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Cash as CashType } from '@/typings/api/cash'
import moment from 'moment'
import { settingsModule } from '.'
import { cashAPI } from '@/api'
import { CashInput } from '@/typings/api/cash/CashInput'

@Module({
  namespaced: true,
  name: 'cash',
})
export default class Cash extends VuexModule {
  public cashes: Array<CashType> | null = null
  public currentCash: Array<CashType> | null = null
  public balance: number | null = null

  public isLoading = false
  public countRows = 0
  public options = {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
    mustSort: false,
    multiSort: true,
  }

  get cashTable() {
    return map(this.cashes, (e) => {
      return {
        id: e.id,
        createdBy: e.cashier.credentials,
        createdAt: moment(e.createdAt).locale('ru').format('DD MMMM YYYY HH:mm'),
        comment: e.comment,
        income: e.income,
        consumption: e.consumption,
        balance: e.balance,
      }
    })
  }

  get cashTableDense() {
    return map(this.currentCash, (e) => {
      return {
        id: e.id,
        createdAt: moment(e.createdAt).format('DD MMMM YYYY HH:mm'),
        comment: e.comment,
        total: e.income - e.consumption,
      }
    })
  }

  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }

  @Mutation
  SET_CASHES(payload: any) {
    this.cashes = payload.docs
    this.countRows = payload.totalDocs
  }

  @Mutation
  SET_CASH(payload: Array<CashType>) {
    this.currentCash = payload
  }

  @Mutation
  SET_OPTIONS(payload: any) {
    this.options = payload
  }

  @Mutation
  SET_BALANCE(payload: any) {
    this.balance = payload
  }

  @Mutation
  CLEAR_CURRENT_CASH() {
    this.currentCash = null
  }

  @Action
  setOptions(payload: any) {
    this.context.commit('SET_OPTIONS', payload)
  }

  @Action
  async fetch() {
    this.context.commit('SET_LOADING', true)

    const payload = this.options
    const office = settingsModule.office?._id
    const query: any = {
      page: payload.page,
      limit: payload.itemsPerPage,
      office,
    }

    const sortDesc = map(payload.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(payload.sortBy, sortDesc))
    this.context.dispatch('getBalance')
    this.context.commit('SET_CASHES', await cashAPI().getPaginated(query))
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getCash(id: string) {
    this.context.commit('SET_LOADING', true)
    this.context.commit('SET_CASH', await cashAPI(id).getByOrder())
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getBalance() {
    this.context.commit('SET_BALANCE', await cashAPI(settingsModule.office?._id).getBalance())
  }

  @Action
  async clearCash() {
    this.context.commit('CLEAR_CURRENT_CASH')
  }

  @Action
  async createCash(payload: CashInput) {
    this.context.commit('SET_LOADING', true)
    try {
      const office = settingsModule.office?._id
      const response = await cashAPI(office).createByOffice(payload)

      if (response) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }
}
