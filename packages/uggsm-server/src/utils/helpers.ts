import { cloneDeep, last, trim, startsWith, each, uniqueId } from 'lodash'
import { UserModel } from '../models'
import { NextFunction } from 'connect'
import express from 'express'
import { body, validationResult } from 'express-validator/check'

export function getAnonymousAnimal() {
  const animals = [
    'Неопознанный аллигатор',
    'Неопознанный муравьед',
    'Неопознанный броненосец',
    'Неопознанный зубр',
    'Неопознанный аксолотль',
    'Неопознанный барсук',
    'Неопознанная летучая мышь',
    'Неопознанный бобр',
    'Неопознанный буйвол',
    'Неопознанный верблюд',
    'Неопознанный хамелеон',
    'Неопознанный гепард',
    'Неопознанный бурундук',
    'Неопознанная шиншилла',
    'Неопознанная чупакабра',
    'Неопознанный баклан',
    'Неопознанный койот',
    'Неопознанная ворона',
    'Неопознанный динго',
    'Неопознанный динозавр',
    'Неопознанная собака',
    'Неопознанный дельфин',
    'Неопознанный дракон',
    'Неопознанная утка',
    'Неопознанный думбо',
    'Неопознанный слон',
    'Неопознанный хорек',
    'Неопознанная лиса',
    'Неопознанная лягушка',
    'Неопознанный жираф',
    'Неопознанный гусь',
    'Неопознанный суслик',
    'Неопознанный гризли',
    'Неопознанный хомяк',
    'Неопознанный еж',
    'Неопознанный бегемот',
    'Неопознанная гиена',
    'Неопознанный шакал',
    'Неопознанный горный козел',
    'Неопознанный ифрит',
    'Неопознанный игуана',
    'Неопознанный кенгуру',
    'Неопознанная коала',
    'Неопознанный кракен',
    'Неопознанный лемур',
    'Неопознанный леопард',
    'Неопознанный лев',
    'Неопознанная лама',
    'Неопознанный ламантин',
    'Неопознанная норка',
    'Неопознанная обезьяна',
    'Неопознанный лось',
    'Неопознанный нарвал',
    'Неопознанный орангутанг',
    'Неопознанная выдра',
    'Неопознанная панда',
    'Неопознанный пингвин',
    'Неопознанный утконос',
    'Неопознанный питон',
    'Неопознанная тыква',
    'Неопознанная квагга',
    'Неопознанный кролик',
    'Неопознанный енот',
    'Неопознанный носорог',
    'Неопознанная овца',
    'Неопознанная землеройка',
    'Неопознанный скунс',
    'Неопознанный медленный лори',
    'Неопознанная белка',
    'Неопознанный тигр',
    'Неопознанная черепаха',
    'Неопознанный единорог',
    'Неопознанный морж',
    'Неопознанный волк',
    'Неопознанный росомаха',
    'Неопознанный вомбат',
  ]

  return animals[Math.floor(Math.random() * animals.length)]
}

export function extendArrayWithId(extend: any, data: any) {
  let result: any = {}
  const lastId = (last(extend) as { id: number })?.id || 0

  if (extend.length === 0) {
    result = {
      id: 1,
      ...data,
    }
    return result
  }

  result = {
    id: lastId + 1,
    ...data,
  }

  return result
}

async function getUserCredentials(userId: number | null) {
  const CANNOT_FIND_USER_TEXT = 'Не удалось найти пользователя'

  if (!userId) {
    return CANNOT_FIND_USER_TEXT
  }

  try {
    const user = await UserModel.findOne({ id: userId })

    if (!user) {
      return CANNOT_FIND_USER_TEXT
    }

    return user.credentials
  } catch (e) {
    return CANNOT_FIND_USER_TEXT
  }
}

export async function processWorkflowData(data: any) {
  const result: any = { ...data }

  result.username = await getUserCredentials(data.userid)

  return result
}

export const requiredFieldsHelper = (...args: string[]) => {
  const fields = []
  args.forEach((e) => {
    fields.push(body(e).not().isEmpty().withMessage('Необходимое поле'))
  })
  return fields
}

export const badRequestHelper = () => {
  return (req: express.Request, res: express.Response, next: NextFunction): void => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Bad Request',
        errors: validationErrors.array(),
      })
    } else {
      next()
    }
  }
}

export const generateOrderId = (
  parsed: { start: string; modifier: string; modifierCount: number },
  identifier: number
) => {
  if (parsed.modifier === 'C') {
    return parseInt(
      `${parsed.start}${
        identifier.toString().length >= parsed.modifierCount
          ? ''
          : '0'.repeat(parsed.modifierCount - identifier.toString().length)
      }${identifier.toString()}`
    )
  }
}

export function formatPhone(phone) {
  phone = trim(phone)

  if (startsWith(phone, '+7')) {
    phone = phone.slice(2)
  }

  if (startsWith(phone, '7')) {
    phone = phone.slice(1)
  }

  if (startsWith(phone, '8')) {
    phone = phone.slice(1)
  }

  phone = phone.replace(/[^0-9]/g, '')

  if (phone.length < 10) {
    phone = ''
  }

  if (phone.length > 10) {
    phone = phone.substring(0, 10)
  }
  return phone
}
