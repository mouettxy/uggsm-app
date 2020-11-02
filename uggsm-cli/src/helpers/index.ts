import { NodeSSH } from 'node-ssh'

export async function connectSSH(instance: NodeSSH, credentials: { host: string; username: string; password: string }) {
  await instance.connect(credentials)

  return instance
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
