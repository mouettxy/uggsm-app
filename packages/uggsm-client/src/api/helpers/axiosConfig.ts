export const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_URL_PRODUCTION
    : process.env.VUE_APP_API_URL_DEVELOPEMENT
export const baseURLVersion =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_VERSION_PRODUCTION
    : process.env.VUE_APP_API_VERSION_DEVELOPEMENT

export const config = {
  baseURL: `${baseURL}/${baseURLVersion}`,
  validateStatus: (status: any) => {
    return status < 500 // default
  },
  timeout: 15 * 1000,
}
