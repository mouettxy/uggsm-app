import faker from 'faker'
import { OfficeModel, OrderModel, UserModel } from './models'

faker.locale = 'ru'
faker.seed(12345)

const roles = ['administrator', 'master', 'manager']

const statuses = [
  'Новый',
  'На уточнении',
  'В работе',
  'Ждёт запчасть',
  'Позвонить повторно',
  'Нужно решить',
  'Готов, без ремонта',
  'На продаже',
  'Закрыт',
  'Обещали найти',
  'Готов',
]

const officeTemplates = [
  '1{C:4}',
  '2{C:4}',
  '3{C:4}',
  '4{C:4}',
  '5{C:4}',
  '6{C:4}',
  '7{C:4}',
  '8{C:4}',
  '9{C:4}',
  '11{C:4}',
  '12{C:4}',
  '13{C:4}',
  '14{C:4}',
  '15{C:4}',
  '16{C:4}',
  '17{C:4}',
  '18{C:4}',
  '19{C:4}',
  '22{C:4}',
  '23{C:4}',
  '24{C:4}',
  '25{C:4}',
  '26{C:4}',
  '27{C:4}',
  '28{C:4}',
  '29{C:4}',
  '33{C:4}',
  '34{C:4}',
  '35{C:4}',
  '36{C:4}',
  '37{C:4}',
  '38{C:4}',
  '39{C:4}',
  '44{C:4}',
  '45{C:4}',
  '46{C:4}',
  '47{C:4}',
  '48{C:4}',
  '49{C:4}',
  '55{C:4}',
]

const userUsernamePasswords = {}
const savedMasterIds = []
const savedManagerIds = []
const savedOfficeIds = []

async function createOffices() {
  for (let i = 0; i < 10; i += 1) {
    const office = new OfficeModel({
      code: faker.address.stateAbbr(),
      name: faker.address.timeZone(),
      ordersTemplate: faker.random.arrayElement(officeTemplates),
      docsTemplate: faker.random.arrayElement(officeTemplates),
      address: faker.address.streetAddress(),
    })
    const saved = await office.save()
    savedOfficeIds.push(saved._id)
  }
}

async function createUsers() {
  for (let i = 0; i < 100; i += 1) {
    const user = new UserModel({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      credentials: faker.name.findName(),
      role: faker.random.arrayElement(roles),
      office: faker.random.arrayElement(savedOfficeIds),
    })
    const saved = await user.save()
    if (user.role === 'master') {
      savedMasterIds.push(saved._id)
    }
    if (user.role === 'manager') {
      savedManagerIds.push(saved._id)
    }
    userUsernamePasswords[user.username] = user.password
  }
}

// create orders
async function createOrders() {
  for (let i = 0; i < 10000; i += 1) {
    const officeId = faker.random.arrayElement(savedOfficeIds)
    const office = await OfficeModel.findById(officeId)

    const order = new OrderModel({
      customerName: faker.name.findName(),
      customerPhone: faker.phone.phoneNumber(),
      office: officeId,
      master: faker.random.arrayElement(savedMasterIds),
      manager: faker.random.arrayElement(savedManagerIds),
      status: faker.random.arrayElement(statuses),
      phoneBrand: faker.vehicle.manufacturer(),
      phoneModel: faker.vehicle.model(),
      quick: faker.random.boolean(),
      password: faker.internet.password(),
      serialNumber: faker.random.alphaNumeric(15),
      declaredDefect: faker.random.words(5),
      kit: faker.random.words(2),
      declaredPrice: faker.random.number(5000),
    })

    const savedOrderFirstIteration = await order.save()

    // @ts-ignore
    savedOrderFirstIteration.setNext('order_id', async (_err, doc) => {
      const parsed = office.ordersTemplateParsed

      // setting up zero values so we can increment to it
      let initial = parsed[0] + String('0').repeat(parseInt(parsed[1]))

      // if incremented value bigger than zero amount we should extend
      // given template and extend amount of zeros to prevent id broke
      if (savedOrderFirstIteration.id.toString().length > initial.length - 1) {
        initial = parsed[0] + String('0').repeat(savedOrderFirstIteration.id.toString().length)
      }

      savedOrderFirstIteration.id = parseInt(initial) + savedOrderFirstIteration.id

      const savedOrderSecondIteration = await savedOrderFirstIteration.save()

      console.log(savedOrderSecondIteration._id)
    })
  }
}

export async function seedDatabase() {
  await createOffices()
  await createUsers()
  await createOrders()
}
