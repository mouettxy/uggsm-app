import inquirer from 'inquirer'
import figlet from 'figlet'
import chalk from 'chalk'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'
import { fileURLToPath } from 'url'

const CODEGEN_TYPES = ['vue']
const CODEGEN_TITLE = 'UGGSM CODEGEN'
const TEMPLATES = {
  vue: path.join(path.dirname(fileURLToPath(import.meta.url)), '/templates/vue.ejs'),
}

class Helpers {
  static findAndDelete(arr, predicate) {
    let i = 0
    while (i < arr.length) {
      if (predicate(arr[i], i)) {
        arr.splice(i, 1)
      } else {
        ++i
      }
    }
  }
}

class ConsoleQueue {
  title = ''
  messages = []

  constructor(title) {
    this.title = title
  }

  clearMessagesWithBgColor(color) {
    Helpers.findAndDelete(this.messages, (e) => e.backgroundColor === color)

    return this
  }

  pushMessage(textColor, backgroundColor, message) {
    this.messages.push({
      textColor,
      backgroundColor,
      message,
    })

    return this
  }

  clear() {
    console.clear()
    console.log(chalk.green(figlet.textSync(this.title)))

    this.messages.forEach((e) => {
      console.log(chalk[e.textColor][e.backgroundColor](e.message))
    })
  }
}

class Generator {
  result = {
    props: {},
    data: {},
    computed: [],
    methods: [],
  }
  console = new ConsoleQueue(CODEGEN_TITLE)

  async gatherInformation() {
    this.console.clear()

    const answerAboutType = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Тип генерации',
        choices: CODEGEN_TYPES,
      },
    ])
    this.result.type = answerAboutType.type

    if (answerAboutType.type === 'vue') {
      this.console.pushMessage('black', 'bgYellow', 'Кодогенерация для Vue').clear()

      const answerAboutName = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Имя компонента',
          transformer: (input) => {
            return 'ug-' + input
          },
        },
      ])
      this.result.name = `ug-${answerAboutName.name}`

      this.console.pushMessage('black', 'bgYellow', `Генерируем компонент ${this.result.name}`).clear()

      /* -------------------------------------------------------------------------- */
      /*                                    PROPS                                   */
      /* -------------------------------------------------------------------------- */

      const answerAboutProps = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'answer',
          message: 'Генерируем Props',
        },
      ])

      let askingAboutProps = answerAboutProps.answer

      if (askingAboutProps) {
        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые Props').clear()
      }

      while (askingAboutProps) {
        const answerAboutProp = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'prop',
          },
          {
            type: 'checkbox',
            name: 'type',
            message: 'type',
            choices: ['String', 'Boolean', 'Array', 'Number', 'Function', 'Object'],
          },
          {
            type: 'list',
            name: 'required',
            message: 'required',
            choices: ['true', 'false'],
          },
          {
            type: 'input',
            name: 'default',
            message: 'default',
          },
          {
            type: 'confirm',
            name: 'next',
            message: 'Добавить ещё',
          },
        ])

        if (!this.result.props) {
          this.result.props = {}
        }

        const prop = {
          required: answerAboutProp.required === 'true' ? true : false,
          type: answerAboutProp.type,
        }

        if (answerAboutProp.default) {
          prop.default = answerAboutProp.default
        }

        this.result.props[answerAboutProp.name] = prop

        this.console
          .clearMessagesWithBgColor('bgGreen')
          .pushMessage(
            'black',
            'bgYellow',
            `Prop ${answerAboutProp.name}${answerAboutProp.default ? `=${answerAboutProp.default}` : ''} (${
              answerAboutProp.type
            });${prop.required ? ' required;' : ''}`
          )
          .clear()

        if (!answerAboutProp.next) {
          break
        }

        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые Props').clear()
      }

      /* -------------------------------------------------------------------------- */
      /*                                    DATA                                    */
      /* -------------------------------------------------------------------------- */

      const answerAboutDatas = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'answer',
          message: 'Генерируем Data',
        },
      ])

      let askingAboutData = answerAboutDatas.answer

      if (askingAboutData) {
        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые поля Data').clear()
      }

      while (askingAboutData) {
        const answerAboutData = await inquirer.prompt([
          {
            type: 'input',
            name: 'text',
            message: 'text',
          },
          {
            type: 'input',
            name: 'value',
            message: 'value',
          },
          {
            type: 'confirm',
            name: 'next',
            message: 'Добавить ещё',
          },
        ])

        if (!this.result.data) {
          this.result.data = {}
        }

        this.result.data[answerAboutData.text] = answerAboutData.value

        this.console
          .clearMessagesWithBgColor('bgGreen')
          .pushMessage('black', 'bgYellow', `Data ${answerAboutData.text}=${answerAboutData.value}`)
          .clear()

        if (!answerAboutData.next) {
          break
        }

        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые поля Data').clear()
      }
      /* -------------------------------------------------------------------------- */
      /*                                  COMPUTED                                  */
      /* -------------------------------------------------------------------------- */

      const answerAboutComputeds = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'answer',
          message: 'Генерируем Computed',
        },
      ])

      let askingAboutComputed = answerAboutComputeds.answer

      if (askingAboutComputed) {
        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые функции Computed').clear()
      }

      while (askingAboutComputed) {
        const answerAboutComputed = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: 'value',
          },
          {
            type: 'confirm',
            name: 'withSetter',
            message: 'with setter',
            default: false,
          },
          {
            type: 'confirm',
            name: 'next',
            message: 'Добавить ещё',
          },
        ])

        if (!this.result.data) {
          this.result.computed = []
        }

        this.result.computed.push({
          value: answerAboutComputed.value,
          withSetter: answerAboutComputed.withSetter,
        })

        this.console
          .clearMessagesWithBgColor('bgGreen')
          .pushMessage(
            'black',
            'bgYellow',
            `Computed ${answerAboutComputed.value};${answerAboutComputed.withSetter ? ' with setter' : ''}`
          )
          .clear()

        if (!answerAboutComputed.next) {
          break
        }

        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые функции Computed').clear()
      }

      /* -------------------------------------------------------------------------- */
      /*                                   METHODS                                  */
      /* -------------------------------------------------------------------------- */

      const answerAboutMethods = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'answer',
          message: 'Генерируем Methods',
        },
      ])

      let askingAboutMethod = answerAboutMethods.answer

      if (askingAboutMethod) {
        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые функции Methods').clear()
      }

      while (askingAboutMethod) {
        const answerAboutMethod = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: 'value',
          },
          {
            type: 'confirm',
            name: 'next',
            message: 'Добавить ещё',
          },
        ])

        if (!this.result.data) {
          this.result.methods = []
        }

        this.result.methods.push({
          value: answerAboutMethod.value,
        })

        this.console
          .clearMessagesWithBgColor('bgGreen')
          .pushMessage('black', 'bgYellow', `Method ${answerAboutMethod.value};}`)
          .clear()

        if (!answerAboutMethod.next) {
          break
        }

        this.console.pushMessage('black', 'bgGreen', 'Укажите необходимые функции Methods').clear()
      }

      /* -------------------------------------------------------------------------- */
      /*                                    MISC                                    */
      /* -------------------------------------------------------------------------- */

      const answerAboutPath = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          message: 'Путь относительно @/components/',
        },
      ])

      this.result.path = path.join(process.cwd(), answerAboutPath.path)
    }
  }

  generateTemplate() {
    return new Promise((resolve) => {
      if (this.result.type == 'vue') {
        ejs.renderFile(TEMPLATES[this.result.type], this.result, {}, (err, str) => {
          resolve(str)
        })
      }
    })
  }

  async generateFile(template) {
    return new Promise((resolve) => {
      const name = this.result.name.slice(3)
      const dirpath = path.join(this.result.path, name)
      const filepath = path.join(dirpath, `${name}.vue`)

      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath)
      }

      fs.writeFile(path.relative(path.resolve(''), filepath), template, (err) => {
        resolve(true)
      })
    })
  }

  async init() {
    await this.gatherInformation()

    await this.generateFile(await this.generateTemplate())

    const answerAboutNext = await inquirer.prompt([
      {
        type: 'confirm',
        default: false,
        name: 'next',
        message: 'Создать ещё?',
      },
    ])

    if (answerAboutNext.next) {
      this.result = {
        props: {},
        data: {},
        computed: [],
        methods: [],
      }

      this.console.clearAll()

      await this.init()
    } else {
      process.exit()
    }
  }
}

const generator = new Generator()

generator.init()
