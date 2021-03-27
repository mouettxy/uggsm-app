import { settingsModule } from '@/store'
import OrderAPI from '@/api/order'

export const createOrder = async (data) => {
  const office = settingsModule.office.code

  const orderResponse = await OrderAPI.createOrder(office, data)

  if (orderResponse.status !== 200) {
    return {
      status: 'ERROR',
      message: 'Не удалось создать заказ',
    }
  }

  const smsResponse = await OrderAPI.sendSms(orderResponse.data.id, {
    phone: '8' + orderResponse.data.customerPhone || '',
    model: `${orderResponse.data.phoneBrand} ${orderResponse.data.phoneModel}`,
    type: 'order-created',
  })

  if (smsResponse.status !== 200) {
    return {
      status: 'WARNING',
      message: `Заказ ${orderResponse.data.id} создан, но отправить СМС не удалось`,
    }
  }

  return {
    status: 'OK',
    message: `Заказ ${orderResponse.data.id} успешно создан`,
  }
}
