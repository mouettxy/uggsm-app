import faker from 'faker'
import { OfficeModel, OrderModel, UserModel } from './models'
import { generateOrderId } from './utils/helpers'
import { statuses } from './utils/enums'

faker.locale = 'ru'
faker.seed(12345)

const roles = ['administrator', 'master', 'manager']

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

const savedMasterIds = []
const savedManagerIds = []
const savedOfficeIds = []

async function createOffices() {
  const offices = []
  for (let i = 0; i < 10; i += 1) {
    const office = new OfficeModel({
      code: faker.address.stateAbbr(),
      name: faker.address.timeZone(),
      ordersTemplate: faker.random.arrayElement(officeTemplates),
      docsTemplate: faker.random.arrayElement(officeTemplates),
      address: faker.address.streetAddress(),
    })
    offices.push(office)
  }
  return offices
}

async function createUsers() {
  const users = []
  for (let i = 0; i < 100; i += 1) {
    const user = new UserModel({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      credentials: faker.name.findName(),
      role: faker.random.arrayElement(roles),
      office: faker.random.arrayElement(savedOfficeIds),
    })

    users.push(user)
  }
  return users
}

// create orders
async function createOrders() {
  const orders = []
  console.time()
  for (let i = 0; i < 1000; i += 1) {
    const officeId = faker.random.arrayElement(savedOfficeIds)
    const office = await OfficeModel.findById(officeId)
    const date = new Date()
    date.setDate(date.getDate() + 7)

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
      estimatedCloseAt: date,
    })

    const firstIteration = await order.save()

    // @ts-ignore
    firstIteration.setNext('order_id', async (_err, doc) => {
      const generatedId = generateOrderId(office.ordersTemplateParsed, firstIteration.id)
      firstIteration.id = generatedId
      const secondIteration = await firstIteration.save()
      orders.push(secondIteration.id)
      //console.log(`Order created ${secondIteration.id}`)
    })

    console.log(orders.length)
  }
  console.timeEnd()
  return orders
}

export async function seedDatabase() {
  const offices = await createOffices()
  for (const office in offices) {
    const saved = await offices[office].save()
    savedOfficeIds.push(saved._id)
  }
  const users = await createUsers()
  for (const user in users) {
    const saved = await users[user].save()
    if (saved.role === 'master') {
      savedMasterIds.push(saved._id)
    }
    if (saved.role === 'manager') {
      savedManagerIds.push(saved._id)
    }
  }

  await createOrders()
}
