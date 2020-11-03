import crypto from 'crypto'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export type MessageItem = {
  uuid: string
  parent_uuid: string
  child_uuid: string
  status: string
  status_time: string
  start_time: string
  create_time: string
  to: string
  text: string
  country: string
  operator: string
  price: string
  form: string
  parts: string
  ip: string
  source: string
  created: string
  sended: string
  answers: string
  provider_status: string
  meta_data: string
}

export type MessageInput = {
  route?: 'sms' | 'viber' | 'vk' | 'hlr'
  from: string
  text: string
  to: string
  translit?: string
  phoneDelimeter?: string
  textDelimeter?: string
  validity?: string
  sms?: {
    from?: string
    text?: string
    to?: string
    validity?: string
  }
  vk?: {
    from?: string
    text?: string
    to?: string
    validity?: string
  }
  viber?: {
    from?: string
    text?: string
    to?: string
    validity?: string
    btnText?: string
    btnUrl?: string
    imageUrl?: string
  }
}

export type MessageSentResponse = {
  items?: [
    {
      uuid: string
      to: string
    }
  ]
  errors?: [
    {
      to?: string
      message: string
    }
  ]
  count?: number
  success: boolean
}

export class RedSmsClient {
  private login = 'function'
  private ts = 'aE4uTUfbC8EbE6PU'
  private apiKey = 'BgohNSjrcLjmVEokYMZmNWZO'
  private axiosConfig: AxiosRequestConfig = {
    baseURL: 'https://cp.redsms.ru/api/',
    validateStatus: (status) => {
      return status <= 500
    },
  }
  private secret: string

  public api: AxiosInstance

  constructor() {
    this.secret = crypto
      .createHash('md5')
      .update(this.ts + this.apiKey)
      .digest('hex')

    this.axiosConfig.headers = {
      login: this.login,
      ts: this.ts,
      secret: this.secret,
    }

    this.api = axios.create(this.axiosConfig)
  }

  public async sendSms(payload: MessageInput): Promise<MessageSentResponse> {
    try {
      const response = await this.api.post<MessageSentResponse>('/message', payload)

      if (response.status === 200) {
        return response.data
      } else if (response.status === 400) {
        return {
          errors: [
            {
              message: 'Некорректный запрос',
            },
          ],
          success: false,
        }
      } else if (response.status === 401) {
        return {
          errors: [
            {
              message: 'Не удалось авторизовать пользователя',
            },
          ],
          success: false,
        }
      }
    } catch (error) {
      return {
        errors: [
          {
            message: 'Ошибка сервера: ' + error.message,
          },
        ],
        success: false,
      }
    }
  }
}
