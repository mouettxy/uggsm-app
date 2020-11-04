import { Endpoint } from '@/typings/api/Endpoint'

export type AuthEndpoints = {
  login: Endpoint
  logout: Endpoint
  register: Endpoint
}

export type AuthInput = {
  username: string
  password: string
}

export type RegisterInput = {
  username: string
  password: string
  credentials: string
  office: string
  role: string
}

export type User = {
  _id: string
  username: string
  password: string
  credentials: string
  role: string
  office: string
  id: number
}
