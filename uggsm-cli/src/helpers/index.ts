import { NodeSSH } from 'node-ssh'
import Axios from 'axios'
import decompress from 'decompress'
import decompressTargz from 'decompress-targz'
import { each, filter, includes, map } from 'lodash'
import { path } from 'temp'

export async function connectSSH(instance: NodeSSH, credentials: { host: string; username: string; password: string }) {
  await instance.connect(credentials)

  return instance
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function downloadFile(fileUrl: string, temp: any, token) {
  const writer = temp.createWriteStream()

  return Axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer)
      let error = null
      writer.on('error', (err) => {
        error = err
        writer.close()
        reject(err)
      })
      writer.on('close', () => {
        if (!error) {
          resolve(writer)
        }
      })
    })
  })
}

export async function getFolderFrom(type: 'backup' | 'server' | 'client', temp: any, token: string) {
  const archive: any = await downloadFile('https://github.com/newfox79/uggsm-app/archive/master.tar.gz', temp, token)

  const unzipped = await decompress(archive.path, {
    plugins: [decompressTargz()],
  })

  let needFolder
  if (type === 'backup') {
    needFolder = 'uggsm-app-master/uggsm-backup-system/dist'
  } else if (type === 'server') {
    needFolder = 'uggsm-app-master/uggsm-server/dist'
  } else if (type === 'client') {
    needFolder = 'uggsm-app-master/uggsm-client/dist'
  }

  const buffer = filter(unzipped, { path: needFolder })

  return buffer
}
