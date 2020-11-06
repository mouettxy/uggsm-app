export type CallsWebhookRequest<Event> = {
  webhook: {
    action: 'call.start' | 'call.finish' | 'call.answer'
    account_id: string
    account_name: string
    user_id: string
    user_login: string
  }
  event: Event
}

export type CallsWebhookCallStandart = {
  direction: number
  type: 1 | 2 | 4
  client_number: string
  client_name: string
  event_age: number
  event_created: number
  user_name: string
  event_pbx_call_id: string
  src_number: string
}

export type CallsWebhookCallExtended = {
  start_time: number
  answer_time: number
  end_time: number
  duration: number
  answered: 0 | 1
  recording: string
  db_call_id: number | string
}

export type CallsWebhookCallStart = CallsWebhookRequest<CallsWebhookCallStandart>

export type CallsWebhookCallAnswer = CallsWebhookRequest<CallsWebhookCallStandart>

export type CallsWebhookCallFinish = CallsWebhookRequest<CallsWebhookCallStandart & CallsWebhookCallExtended>
