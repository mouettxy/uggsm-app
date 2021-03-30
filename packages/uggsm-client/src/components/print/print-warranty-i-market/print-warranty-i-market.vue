<template>
  <div id="print-warranty-i-market" :style="{ width: '100%', height: '100%' }">
    <!-- header-->
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px">
      <tbody>
        <tr>
          <td :style="{ 'text-align': 'left', color: '#757575', 'vertical-align': 'top', 'font-size': '12px' }">
            <div>+7 (918) 35-111-39 ул. Октябрьская 12</div>
            <div>+7 (918) 35-111-26 ул. О.Кошевого 194А</div>
            <div>Режим работы пн-вс с 10-19:00</div>
          </td>
          <td :style="{ display: 'flex', justifyContent: 'end' }">
            <div :style="{ display: 'flex', flexDirection: 'column' }">
              <div :style="{ position: 'relative', width: '230px', height: '150px' }">
                <div :style="{ position: 'absolute', top: '-30px', whiteSpace: 'nowrap', left: '0px' }">
                  <img height="110" src="@/assets/warranty-i-market.jpg" width="230" />
                </div>
                <div :style="{ fontSize: '8px', position: 'absolute', top: '50px', whiteSpace: 'nowrap', left: '8px' }">
                  Продажа,ремонт,сервисное обслуживание техники Apple.
                </div>
                <div :style="{ position: 'absolute', top: '70px', whiteSpace: 'nowrap', left: '90px' }">
                  <img heigh="12" src="@/assets/instagram-i-market.jpg" width="61" />
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div :style="{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }">Гарантийный талон.</div>
    <div :style="{ 'font-size': '16px', 'text-align': 'center', 'margin-top': '16px' }">
      <span>от&nbsp;</span>
      <span>«</span>
      <span
        :style="{
          'margin-left': '2px',
          'margin-right': '2px',
          width: '32px',
          'border-bottom': '2px solid',
          display: 'inline-block',
        }"
      ></span>
      <span>»</span>
      <span
        :style="{
          'margin-left': '2px',
          'margin-right': '2px',
          width: '128px',
          'border-bottom': '2px solid',
          display: 'inline-block',
        }"
      ></span>
      <span>{{ year }}г.</span>
    </div>
    <div :style="{ display: 'flex' }">
      <div>Заказчик</div>
      <div :style="{ 'margin-left': '8px', 'margin-right': '2px', 'border-bottom': '1px solid', flexGrow: '1' }"></div>
    </div>
    <table :style="{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }">
      <thead>
        <tr>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">№</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">Наименование работы (услуги)</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">Серийный номер</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">цена</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i">
          <td :style="{ textAlign: 'center', border: '1px solid black' }">⠀&nbsp;</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">⠀&nbsp;</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">⠀&nbsp;</td>
          <td :style="{ textAlign: 'center', border: '1px solid black' }">⠀&nbsp;</td>
        </tr>
      </tbody>
    </table>
    <div :style="{ marginTop: '16px', fontStyle: 'italic', fontSize: '14px' }">
      <p :style="{ marginBottom: '2px' }">Гарантийный срок 1 месяц с момента передачи устройства клиенту.</p>
      <p :style="{ marginBottom: '2px' }">
        Гарантия распространяется ТОЛЬКО на выполненные работы и замененные запчасти.
      </p>
      <p :style="{ marginBottom: '2px' }">
        Гарантия не распространяется на аппараты ,которые подвергались воздействию жидкости или механическому
        повреждению (удар, падение),а так же в случае не квалифицированного ремонта сторонними ремонтными организациями.
      </p>
      <p :style="{ marginBottom: '2px' }">
        Гарантия не распространяется на детали вышедшие из строя из за усиленного износа.
      </p>
      <p :style="{ marginBottom: '2px' }">
        Гарантийный срок согласно закону о защите прав потребителей увеличивается на время нахождения изделия в ремонте.
      </p>
    </div>
    <div :style="{ marginTop: '64px', fontStyle: 'italic', fontSize: '14px' }">
      <div>Всего оказано услуг на сумму:</div>
      <div :style="{ display: 'flex' }">
        <div
          :style="{ 'margin-left': '2px', 'margin-right': '2px', 'border-bottom': '1px solid', flexGrow: '1' }"
        ></div>
        <div>рублей</div>
      </div>
      <div :style="{ marginTop: '16px', marginBottom: '16px' }">
        Вышеперечисленные работы (услуги) выполнены полностью и в срок. Заказчик претензий по объему, качеству и срокам
        оказания услуг претензий не имеет.
      </div>
    </div>
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div>
        <span>Исполнитель:</span>
        <span
          :style="{
            'margin-left': '2px',
            'margin-right': '2px',
            width: '128px',
            'border-bottom': '2px solid',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '.8',
          }"
        >
          iMarket
        </span>
      </div>
      <div>
        <span>Заказчик:</span>
        <span
          :style="{
            'margin-left': '2px',
            'margin-right': '2px',
            width: '128px',
            'border-bottom': '2px solid',
            display: 'inline-block',
            lineHeight: '.8',
          }"
        >
          ⠀
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'm-print-warranty-i-market',

  data: () => ({
    year: moment().format('YYYY'),
  }),
}
</script>
