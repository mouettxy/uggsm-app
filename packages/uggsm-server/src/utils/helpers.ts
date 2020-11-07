import { cloneDeep, last, trim, startsWith } from 'lodash'
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
  let data_ = cloneDeep(data)
  if (extend.length === 0) {
    data_ = {
      id: 1,
      ...data_,
    }
  } else {
    const lastIdInc = (last(extend) as any).id + 1
    data_ = {
      ...data_,
      id: lastIdInc,
    }
  }
  return data_
}

export async function processWorkflowData(data: any) {
  const data_ = cloneDeep(data)
  if (data_.userid) {
    try {
      const user = await UserModel.findOne({ id: data_.userid })
      if (user) {
        data_.username = user.credentials
      } else {
        data_.username = getAnonymousAnimal()
      }
    } catch (e) {
      data_.username = getAnonymousAnimal()
    }
  } else {
    data_.username = getAnonymousAnimal()
  }

  return data_
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

export const parsePaginateResponse = (requestQuery, needOffice = false, model = undefined) => {
  let query: any = {}
  if (needOffice) {
    query.office = requestQuery.office
  }

  const page = requestQuery.page
  const limit = requestQuery.limit
  const options: any = {
    page,
    limit,
  }

  if (requestQuery.sort) {
    try {
      options.sort = JSON.parse(`${requestQuery.sort}`)
    } catch (e) {
      // do nothing
    }
  }

  if (requestQuery.search) {
    if (model) {
      const searchQuery = model.searchBuilder(requestQuery.search)
      if (parseInt(requestQuery.search)) {
        searchQuery.$and[0].$or.push({ id: { $gte: requestQuery.search, $lte: requestQuery.search } })
      }
      query = {
        ...query,
        ...searchQuery,
      }
    }
  }

  if (requestQuery.filter) {
    const filter = JSON.parse(requestQuery.filter as string)
    const newFilter = {}
    for (const k in filter) {
      if (filter[k]) {
        if (parseInt(filter[k])) {
          newFilter[k] = { $gte: filter[k] }
        } else {
          newFilter[k] = { $regex: new RegExp(filter[k], 'i') }
        }
      }
    }
    Object.assign(query, newFilter)
  }

  if (requestQuery.master) {
    query.master = requestQuery.master
  }

  if (requestQuery.statuses && requestQuery.excludeStatuses) {
    query.status = { $in: requestQuery.statuses }
  } else if (requestQuery.excludeStatuses) {
    query.status = { $not: { $in: requestQuery.excludeStatuses } }
  } else if (requestQuery.statuses) {
    query.status = { $in: requestQuery.statuses }
  }

  if (requestQuery.orderDisplayOnlyExpired === 'true') {
    query.estimatedCloseAt = { $lte: new Date() }
  }

  return {
    query,
    options,
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
