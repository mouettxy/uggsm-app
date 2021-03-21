export const findElements = (elements: Record<string, string>, root: string | null = null) => {
  const rootElement = root ? document.querySelector(root) || document : document
  const elementNames = Object.keys(elements)
  const resultingElements: Record<string, HTMLElement | Element | Document | null> = {}

  elementNames.forEach((e) => {
    resultingElements[e] = rootElement.querySelector(elements[e])
  })

  resultingElements.root = rootElement

  return resultingElements
}
