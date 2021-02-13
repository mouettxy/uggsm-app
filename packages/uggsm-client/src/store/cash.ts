import axios from '@/plugins/axios'
import { fromPairs, isNull, map, zip } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Cash as CashType } from '@/typings/api/cash'
import moment from 'moment'
import { settingsModule, ordersModule } from '@/store'
import { cashAPI } from '@/api'
import { CashInput } from '@/typings/api/cash'
import { getAnonymousAnimal } from '@/api/helpers'
import { TableHelpers } from './helpers'
import { off } from 'process'

@Module({
  namespaced: true,
  name: 'cash',
})
export default class Cash extends VuexModule {
  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  public table: Array<CashType> | null = null
  public isLoading = false
  public tableRows = 0
  public tableOptions: any = TableHelpers.generateOptions(1, 25, 'id')
  public tableHeaders = TableHelpers.generateHeaders(
    {
      id: '№',
      createdBy: 'Создал',
      comment: 'Комментарий',
      income: 'Приход',
      consumption: 'Расход',
      balance: 'Остаток',
      actions: 'Действия',
    },
    'cash-headers'
  )
  get tableItems() {
    return map(this.table, (e) => {
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
  get tableHeadersFormatted() {
    return TableHelpers.excludeNotShownHeaders(this.tableHeaders)
  }
  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }
  @Mutation
  SET_TABLE(payload: any) {
    this.table = payload.docs
    this.tableRows = payload.totalDocs
  }
  @Mutation
  SET_TABLE_OPTIONS(payload: any) {
    this.tableOptions = payload
  }
  @Mutation
  SET_TABLE_HEADERS(payload: any) {
    this.tableHeaders = payload
  }
  @Action
  setTableOptions(payload: any) {
    this.context.commit('SET_TABLE_OPTIONS', payload)
  }
  @Action
  setTableHeaders(payload: any) {
    localStorage.setItem('cashes-headers', JSON.stringify(payload))
    this.context.commit('SET_TABLE_HEADERS', payload)
  }
  @Action
  async fetchTable() {
    this.context.commit('SET_LOADING', true)

    const response = await cashAPI().getPaginated(
      TableHelpers.processQuery(this.tableOptions, (query: any) => {
        if (this.tableOptions.cashFilter) {
          query.cashFilter = this.tableOptions.cashFilter
        }

        return query
      })
    )

    this.context.dispatch('getBalance')

    this.context.commit('SET_TABLE', response)
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getCash(id: string | number) {
    this.context.commit('SET_LOADING', true)
    const cash = await cashAPI(id).getByOrder()
    this.context.commit('SET_LOADING', false)
    return cash
  }
  /* -------------------------------------------------------------------------- */
  /*                                   SOCKETS                                  */
  /* -------------------------------------------------------------------------- */

  @Action
  async socket_updateCashes() {
    this.fetchTable()
  }

  /* -------------------------------------------------------------------------- */
  /*                                     API                                    */
  /* -------------------------------------------------------------------------- */

  public balance: number | null = null

  @Mutation
  SET_BALANCE(payload: any) {
    this.balance = payload
  }

  @Action
  async getBalance() {
    this.context.commit('SET_BALANCE', await cashAPI(settingsModule.office?._id).getBalance())
  }

  @Action
  async getTotalByFilter(payload: any) {
    this.context.commit('SET_LOADING', true)
    try {
      const office = settingsModule.office?._id
      const response = await axios.get('/cash/total-filtered', {
        params: {
          office: office,
          ...payload,
        },
      })

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
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
