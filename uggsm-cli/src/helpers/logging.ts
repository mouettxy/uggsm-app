import ora from 'ora'

export function log(scope: string, message: string, spinnerInstance) {
  if (!spinnerInstance) {
    console.log(`${scope.toUpperCase()} ${message}`)
    spinnerInstance = ora(`${scope.toUpperCase()} ${message}`).start()
  } else {
    spinnerInstance.stop()
    console.log(`${scope.toUpperCase()} ${message}`)
    spinnerInstance = ora(`${scope.toUpperCase()} ${message}`).start()
  }
}
