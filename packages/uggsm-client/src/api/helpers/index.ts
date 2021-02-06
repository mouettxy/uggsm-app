import { Endpoint } from '@/typings/api/Endpoint'
import axios from '@/plugins/axios'

export const sendRequest = async (endpoint: Endpoint, data?: any) => {
  let data_
  if (data) {
    if (endpoint.method === 'get') {
      data_ = {
        params: { ...data },
      }
    } else {
      data_ = {
        data: {
          ...data,
        },
      }
    }
  }

  if (data_) {
    return axios({
      url: endpoint.link,
      method: endpoint.method,
      ...data_,
    })
  } else {
    return axios({
      url: endpoint.link,
      method: endpoint.method,
    })
  }
}

export function getAnonymousAnimal() {
  const animals = [
    'Таинственный аллигатор',
    'Таинственный муравьед',
    'Таинственный броненосец',
    'Таинственный зубр',
    'Таинственный аксолотль',
    'Таинственный барсук',
    'Таинственная летучая мышь',
    'Таинственный бобр',
    'Таинственный буйвол',
    'Таинственный верблюд',
    'Таинственный хамелеон',
    'Таинственный гепард',
    'Таинственный бурундук',
    'Таинственная шиншилла',
    'Таинственная чупакабра',
    'Таинственный баклан',
    'Таинственный койот',
    'Таинственная ворона',
    'Таинственный динго',
    'Таинственный динозавр',
    'Таинственная собака',
    'Таинственный дельфин',
    'Таинственный дракон',
    'Таинственная утка',
    'Таинственный думбо',
    'Таинственный слон',
    'Таинственный хорек',
    'Таинственная лиса',
    'Таинственная лягушка',
    'Таинственный жираф',
    'Таинственный гусь',
    'Таинственный суслик',
    'Таинственный гризли',
    'Таинственный хомяк',
    'Таинственный еж',
    'Таинственный бегемот',
    'Таинственная гиена',
    'Таинственный шакал',
    'Таинственный горный козел',
    'Таинственный ифрит',
    'Таинственный игуана',
    'Таинственный кенгуру',
    'Таинственная коала',
    'Таинственный кракен',
    'Таинственный лемур',
    'Таинственный леопард',
    'Таинственный лев',
    'Таинственная лама',
    'Таинственный ламантин',
    'Таинственная норка',
    'Таинственная обезьяна',
    'Таинственный лось',
    'Таинственный нарвал',
    'Таинственный орангутанг',
    'Таинственная выдра',
    'Таинственная панда',
    'Таинственный пингвин',
    'Таинственный утконос',
    'Таинственный питон',
    'Таинственная тыква',
    'Таинственная квагга',
    'Таинственный кролик',
    'Таинственный енот',
    'Таинственный носорог',
    'Таинственная овца',
    'Таинственная землеройка',
    'Таинственный скунс',
    'Таинственный медленный лори',
    'Таинственная белка',
    'Таинственный тигр',
    'Таинственная черепаха',
    'Таинственный единорог',
    'Таинственный морж',
    'Таинственный волк',
    'Таинственный росомаха',
    'Таинственный вомбат',
  ]

  return animals[Math.floor(Math.random() * animals.length)]
}

export function getCorrectTextColor(hex: string) {
  function cutHex(h: string) {
    return h.charAt(0) == '#' ? h.substring(1, 7) : h
  }
  function hexToR(h: string) {
    return parseInt(cutHex(h).substring(0, 2), 16)
  }
  function hexToG(h: string) {
    return parseInt(cutHex(h).substring(2, 4), 16)
  }
  function hexToB(h: string) {
    return parseInt(cutHex(h).substring(4, 6), 16)
  }

  const threshold = 130

  const hRed = hexToR(hex)
  const hGreen = hexToG(hex)
  const hBlue = hexToB(hex)

  const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000
  if (cBrightness > threshold) {
    return '#151515'
  } else {
    return '#fafafa'
  }
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}
