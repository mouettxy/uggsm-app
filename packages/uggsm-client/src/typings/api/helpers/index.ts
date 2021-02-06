import { AxiosResponse } from 'axios'

export type AxiosResponseAPI<T> = Promise<AxiosResponse<T>>

export type ConstructorOf<C> = {
  new (...args: any[]): C
}
