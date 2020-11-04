import * as fs from 'fs'

export function readdir(disk, path) {
  return new Promise((resolve, reject) => {
    disk.readdir(path, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function writeFile(disk, pathDisk, pathLocal) {
  return new Promise((resolve, reject) => {
    disk.writeFile(pathDisk, fs.readFileSync(pathLocal), 'utf-8', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function remove(disk, path) {
  return new Promise((resolve, reject) => {
    disk.remove(path, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function download(disk, pathDisk, pathLocal) {
  return new Promise((resolve, reject) => {
    disk.downloadFile(pathDisk, pathLocal, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
