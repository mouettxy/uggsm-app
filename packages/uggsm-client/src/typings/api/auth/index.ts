import { Endpoint } from '@/typings/api/Endpoint'
import { User as UserType } from '@/typings/api/user'

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

export type User = UserType
