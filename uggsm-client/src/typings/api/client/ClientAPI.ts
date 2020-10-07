import { Client } from './Client'
import { ClientInput } from './ClientInput'

export type ClientAPI = {
  getAll(): Promise<Array<Client> | []>
  getPaginated(options: any): Promise<Array<Client> | []>
  getByName(): Promise<Client | null>
  create(data: ClientInput): Promise<Client | null>
  updateById(data: Client): Promise<Client | null>
  deleteById(): Promise<string>
}
