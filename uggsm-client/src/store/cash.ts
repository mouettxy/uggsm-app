import { fromPairs, isNull, map, zip } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Cash as CashType } from '@/typings/api/cash'
import moment from 'moment'
import { settingsModule, ordersModule } from '@/store'
import { cashAPI } from '@/api'
import { CashInput } from '@/typings/api/cash'
import { getAnonymousAnimal } from '@/api/helpers'

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
  public options: any = {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
    mustSort: false,
    multiSort: true,
  }

  get cashTable() {
    return map(this.cashes, (e) => {
      const cashier = e.cashier ? e.cashier.credentials : getAnonymousAnimal()
      return {
        id: e.id,
        createdBy: cashier,
        createdAt: moment(e.createdAt).locale('ru').format('DD MMMM YYYY HH:mm'),
        comment: e.comment,
        income: e.income,
        consumption: e.consumption,
        balance: e.balance,
        orderid: e.orderid,
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
        orderid: e.orderid,
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

    if (settingsModule.search) {
      query.search = settingsModule.search
    }

    const sortDesc = map(payload.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(payload.sortBy, sortDesc))
    this.context.dispatch('getBalance')
    this.context.commit('SET_CASHES', await cashAPI().getPaginated(query))
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getCash(id: string | number) {
    this.context.commit('SET_LOADING', true)
    const cash = await cashAPI(id).getByOrder()
    this.context.commit('SET_CASH', cash)
    this.context.commit('SET_LOADING', false)
    return cash
  }

  @Action
  async socket_updateCashes() {
    this.fetch()
  }

  @Action
  async socket_createdCash(evt: CashType) {
    if (ordersModule.currentOrder && !isNull(this.currentCash)) {
      if (evt.orderid && evt.orderid === ordersModule.currentOrder.id) {
        this.currentCash.push(evt)
      }
    }
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
      const office = settingsModule.office?.code
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
