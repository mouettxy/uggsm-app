import { cloneDeep, last } from 'lodash'
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
    let lastIdInc = (last(extend) as any).id + 1
    data_ = {
      ...data_,
      id: lastIdInc,
    }
  }
  return data_
}

export async function processWorkflowData(data: any) {
  let data_ = cloneDeep(data)
  if (data_.userid) {
    try {
      const user = await UserModel.findOne({ id: data_.userid })
      if (user) {
        data_.username = user.credentials
        data_.message = data_.message
      } else {
        data_.username = getAnonymousAnimal()
        data_.message = data_.message
      }
    } catch (e) {
      data_.username = getAnonymousAnimal()
      data_.message = data_.message
    }
  } else {
    data_.username = getAnonymousAnimal()
    data_.message = data_.message
  }

  return data_
}

export const requiredFieldsHelper = (...args: string[]) => {
  const fields = []
  args.forEach(e => {
    fields.push(
      body(e)
        .not()
        .isEmpty()
        .withMessage('Необходимое поле'),
    )
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