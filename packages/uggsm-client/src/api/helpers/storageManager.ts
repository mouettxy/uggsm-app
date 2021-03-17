export const addToStorage = (key: string, data: unknown): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const removeFromStorage = (key: string): void => {
  localStorage.removeItem(key)
}

export const getFromStorage = (key: string): any => {
  const item = localStorage.getItem(key)

  if (!item) {
    return null
  }

  return JSON.parse(item)
}
