export const findElements = (elements: Record<string, string>, root: string | null = null) => {
  let rootElement: any
  if (!rootElement) {
    rootElement = document
  } else if (typeof rootElement === 'string') {
    rootElement = document.querySelector(root as string) || document
  } else {
    rootElement = root
  }

  const elementNames = Object.keys(elements)
  const resultingElements: Record<string, HTMLElement | Element | Document | null> = {}

  elementNames.forEach((e) => {
    resultingElements[e] = rootElement.querySelector(elements[e])
  })

  resultingElements.root = rootElement

  return resultingElements
}
