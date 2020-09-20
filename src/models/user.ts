import { createSchema, Type, typedModel } from 'ts-mongoose'

export const roles = ['Administrator', 'Master', 'Manager']

const UserSchema = createSchema({
  username: Type.string({ unique: true }),
  password: Type.string(),
  credentials: Type.string(),
  branchOffice: Type.string({ required: true }),
  role: Type.string({ required: true, enum: roles }),
})

export const UserModel = typedModel('User', UserSchema)
