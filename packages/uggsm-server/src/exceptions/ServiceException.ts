export class ServiceException extends Error {
  constructor(error: Error) {
    super(
      JSON.stringify({
        errors: [error.message],
        error: error,
      })
    )
  }
}
