import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { map } from 'lodash'
import moment from 'moment'
import axios from '@/plugins/axios'
import { TableHelpers } from './helpers'
import { Call } from '@/typings/api/call'

function getTime(date: any) {
  const m = moment(date)
  return `${m.format('DD.MM.YYYY')} ${m.format('HH:mm')}`
}

@Module({
  namespaced: true,
  name: 'calls',
})
export default class Calls extends VuexModule {
  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  public table: Array<Call> | null = null
  public isLoading = false
  public tableRows = 0
  public tableOptions: any = TableHelpers.generateOptions(1, 25, 'answerTime')
  public tableHeaders = TableHelpers.generateHeaders(
    {
      order: 'Заявка',
      record: 'Запись',
      incoming: 'Входящий',
      answered: 'Отвечен',
      clientNumber: 'Клиент',
      manager: 'Ответил',
      managerNumber: 'Менеджер',
      startTime: 'Время звонка',
      endTime: 'Время окончания',
      answerTime: 'Время ответа',
    },
    'calls-headers'
  )
  get tableItems() {
    return map(this.table, (e) => {
      const startTime = getTime(e.startTime)
      const endTime = getTime(e.endTime)
      const answerTime = getTime(e.answerTime)

      return {
        incoming: e.incoming ? 'Да' : 'Нет',
        answered: e.answered ? 'Да' : 'Нет',
        clientNumber: e.clientNumber,
        manager: e.manager,
        managerNumber: e.managerNumber,
        order: e.relatedOrder,
        startTime,
        record: e.record,
        endTime,
        answerTime,
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
    localStorage.setItem('orders-headers', JSON.stringify(payload))
    this.context.commit('SET_TABLE_HEADERS', payload)
  }
  @Action
  async fetchTable() {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.get('/calls/paginated', {
        params: TableHelpers.processQuery(this.tableOptions, false, false),
      })

      this.context.commit('SET_TABLE', response.data)
    } catch (error) {
      console.log(error)
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }
}
