import 'dotenv/config'
import mongoose from 'mongoose'
import AutoIncrementFactory from 'mongoose-sequence'

// @ts-ignore
export const AutoIncrement = AutoIncrementFactory(mongoose)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const { MONGO_USER, MONGO_PASSWORD, DB_CONNECTION_STRING, DB_SERVER } = process.env

export function initializePlugins(_connection): void {
  // do nothing right now
}

export function connectToDatabase(): void {
  const DB_URL = `${DB_CONNECTION_STRING}${MONGO_USER}:${MONGO_PASSWORD}${DB_SERVER}`

  mongoose
    .connect(DB_URL)
    .then(() => {
      // tslint:disable-next-line: no-console
      console.log('Database connected successfully')

      initializePlugins(mongoose.connection)

      console.log('Database plugins initialized')
    })
    .catch((error: Error) => {
      // tslint:disable-next-line: no-console
      console.log('Database connection error: ' + error.message)
    })
}
