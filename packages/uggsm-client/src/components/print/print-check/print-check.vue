<template>
  <div id="print-check" style="width: 100%">
    <table style="width: 100%">
      <tr>
        <td style="text-align: center; font-size: 18px; font-weight: bold">
          <p style="margin: 0">Квитанция {{ orderId }}</p>
          <p style="margin: 0">8 (928) 841-26-76</p>
        </td>
        <td style="text-align: right">
          <p style="margin: 0">ИП Гергишан Андрей Владимирович. ИНН: 262410115637</p>
          <p style="margin: 0">ОГРНИП: 314231108300081 {{ address }}</p>
          <p style="margin: 0">График работы: понедельник-сбуббота:с 9 до 19 часов</p>
          <p style="margin: 0">Воскресенье:с 10 до 15 часов</p>
        </td>
      </tr>
    </table>
    <div style="font-size: 16px; text-align: center">
      <p style="margin: 0; font-weight: bold">ТОВАРНЫЙ ЧЕК</p>
      <p style="margin: 0">{{ dateNow }} г.</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px">
      <thead>
        <tr>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">№</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">
            Наименование работ и запчастей
          </td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">Гарантия</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">Кол-во</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">Цена, руб</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">Сум, руб</td>
        </tr>
      </thead>
      <tbody v-if="works">
        <tr v-for="work in works" :key="work.id">
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">{{ work.id }}</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">{{ work.message }}</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">-</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">1</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">{{ work.price }}</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">{{ work.price }}</td>
        </tr>
        <tr>
          <td colspan="5" style="text-align: right">Всего:</td>
          <td style="text-align: center; border: 1px solid black; border-collapse: collapse">{{ worksPrice }}</td>
        </tr>
      </tbody>
    </table>
    <div style="font-size: 16px; margin-top: 24px">
      <p style="margin: 0">Всего наименований {{ worksCount }}, на сумму {{ worksPrice }} руб.</p>
      <p style="margin: 0">
        <strong>Сумма к оплате (прописью):&nbsp;</strong>
        <span>{{ worksPhrase }}</span>
      </p>
    </div>
    <div style="font-size: 16px; margin-top: 44px; text-align: right">
      <span>Подпись продавца:</span>
      <span style="display: inline-block; border-bottom: 2px solid; width: 160px; margin-left: 4px"></span>
    </div>
    <ug-print-adversitement v-bind="$props"></ug-print-adversitement>
  </div>
</template>

<script>
import moment from 'moment'
import { reduce, round, trim } from 'lodash'
import { settingsModule } from '@/store'
import UgPrintAdversitement from '../print-adversitement/print-adversitement'
import { mapState } from 'vuex'

export default {
  name: 'ug-print-check',

  components: {
    UgPrintAdversitement,
  },

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },

    customerName: {
      required: false,
      type: [String],
      default: '',
    },

    works: {
      required: false,
      type: [Array],
      default: () => [],
    },
  },

  computed: {
    ...mapState({
      address: (state) => state.settings.office.address,
    }),

    dateNow() {
      return moment().locale('ru').format('DD MMMM YYYY')
    },

    worksCount() {
      return this.works?.length || 0
    },

    worksPrice() {
      if (this.works) {
        return reduce(
          this.works,
          (a, e) => {
            a += e.price
            return a
          },
          0
        )
      }

      return 0
    },

    worksPhrase() {
      function helper(a) {
        var x = round(a)
        if (x < 0 || x > 999999999999999.99) return false

        var currency = 'RUB'

        var groups = []

        groups[0] = []
        groups[1] = []
        groups[2] = []
        groups[3] = []
        groups[4] = []

        groups[9] = []

        // рубли
        // по умолчанию
        groups[0][-1] = { RUB: 'рублей', USD: 'долларов США', EUR: 'евро' }
        //исключения
        groups[0][1] = { RUB: 'рубль', USD: 'доллар США', EUR: 'евро' }
        groups[0][2] = { RUB: 'рубля', USD: 'доллара США', EUR: 'евро' }
        groups[0][3] = { RUB: 'рубля', USD: 'доллара США', EUR: 'евро' }
        groups[0][4] = { RUB: 'рубля', USD: 'доллара США', EUR: 'евро' }

        // тысячи
        // по умолчанию
        groups[1][-1] = 'тысяч'
        //исключения
        groups[1][1] = 'тысяча'
        groups[1][2] = 'тысячи'
        groups[1][3] = 'тысячи'
        groups[1][4] = 'тысячи'

        // миллионы
        // по умолчанию
        groups[2][-1] = 'миллионов'
        //исключения
        groups[2][1] = 'миллион'
        groups[2][2] = 'миллиона'
        groups[2][3] = 'миллиона'
        groups[2][4] = 'миллиона'

        // миллиарды
        // по умолчанию
        groups[3][-1] = 'миллиардов'
        //исключения
        groups[3][1] = 'миллиард'
        groups[3][2] = 'миллиарда'
        groups[3][3] = 'миллиарда'
        groups[3][4] = 'миллиарда'

        // триллионы
        // по умолчанию
        groups[4][-1] = 'триллионов'
        //исключения
        groups[4][1] = 'триллион'
        groups[4][2] = 'триллиона'
        groups[4][3] = 'триллиона'
        groups[4][4] = 'триллиона'

        // копейки
        // по умолчанию
        groups[9][-1] = { RUB: 'копеек', USD: 'центов', EUR: 'центов' }
        //исключения
        groups[9][1] = { RUB: 'копейка', USD: 'цент', EUR: 'цент' }
        groups[9][2] = { RUB: 'копейки', USD: 'цента', EUR: 'цента' }
        groups[9][3] = { RUB: 'копейки', USD: 'цента', EUR: 'цента' }
        groups[9][4] = { RUB: 'копейки', USD: 'цента', EUR: 'цента' }

        // цифры и числа
        // либо просто строка, либо 4 строки в хэше
        var names = []
        names[1] = { 0: 'один', 1: 'одна', 2: 'один', 3: 'один', 4: 'один' }
        names[2] = { 0: 'два', 1: 'две', 2: 'два', 3: 'два', 4: 'два' }
        names[3] = 'три'
        names[4] = 'четыре'
        names[5] = 'пять'
        names[6] = 'шесть'
        names[7] = 'семь'
        names[8] = 'восемь'
        names[9] = 'девять'
        names[10] = 'десять'
        names[11] = 'одиннадцать'
        names[12] = 'двенадцать'
        names[13] = 'тринадцать'
        names[14] = 'четырнадцать'
        names[15] = 'пятнадцать'
        names[16] = 'шестнадцать'
        names[17] = 'семнадцать'
        names[18] = 'восемнадцать'
        names[19] = 'девятнадцать'
        names[20] = 'двадцать'
        names[30] = 'тридцать'
        names[40] = 'сорок'
        names[50] = 'пятьдесят'
        names[60] = 'шестьдесят'
        names[70] = 'семьдесят'
        names[80] = 'восемьдесят'
        names[90] = 'девяносто'
        names[100] = 'сто'
        names[200] = 'двести'
        names[300] = 'триста'
        names[400] = 'четыреста'
        names[500] = 'пятьсот'
        names[600] = 'шестьсот'
        names[700] = 'семьсот'
        names[800] = 'восемьсот'
        names[900] = 'девятьсот'

        var r = ''
        var i, j

        var y = Math.floor(x)

        // если НЕ ноль рублей
        if (y > 0) {
          // выделим тройки с руб., тыс., миллионами, миллиардами и триллионами
          var t = []

          for (i = 0; i <= 4; i++) {
            t[i] = y % 1000
            y = Math.floor(y / 1000)
          }

          var d = []

          // выделим в каждой тройке сотни, десятки и единицы
          for (i = 0; i <= 4; i++) {
            d[i] = []
            d[i][0] = t[i] % 10 // единицы
            d[i][10] = (t[i] % 100) - d[i][0] // десятки
            d[i][100] = t[i] - d[i][10] - d[i][0] // сотни
            d[i][11] = t[i] % 100 // две правых цифры в виде числа
          }

          for (i = 4; i >= 0; i--) {
            if (t[i] > 0) {
              if (names[d[i][100]])
                r += ' ' + (typeof names[d[i][100]] == 'object' ? names[d[i][100]][i] : names[d[i][100]])

              if (names[d[i][11]])
                r += ' ' + (typeof names[d[i][11]] == 'object' ? names[d[i][11]][i] : names[d[i][11]])
              else {
                if (names[d[i][10]])
                  r += ' ' + (typeof names[d[i][10]] == 'object' ? names[d[i][10]][i] : names[d[i][10]])
                if (names[d[i][0]]) r += ' ' + (typeof names[d[i][0]] == 'object' ? names[d[i][0]][i] : names[d[i][0]])
              }

              if (names[d[i][11]])
                // если существует числительное
                j = d[i][11]
              else j = d[i][0]

              if (groups[i][j]) {
                if (i == 0) r += ' ' + groups[i][j][currency]
                else r += ' ' + groups[i][j]
              } else {
                if (i == 0) r += ' ' + groups[i][-1][currency]
                else r += ' ' + groups[i][-1]
              }
            }
          }

          if (t[0] == 0) r += ' ' + groups[0][-1][currency]
        } else r = 'Ноль ' + groups[0][-1][currency]

        y = round((x - Math.floor(x)) * 100)
        if (y < 10) {
          y = '0' + y
        }

        r = trim(r)
        r = r.substr(0, 1).toUpperCase() + r.substr(1)
        r += ' ' + y

        y = y * 1

        if (names[y])
          // если существует числительное
          j = y
        else j = y % 10

        if (groups[9][j]) r += ' ' + groups[9][j][currency]
        else r += ' ' + groups[9][-1][currency]

        return r
      }

      return helper(this.worksPrice)
    },
  },
}
</script>
