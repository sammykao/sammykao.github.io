export async function register() {
  const g = globalThis as {
    localStorage?: {
      getItem?: (key: string) => string | null
      setItem?: (key: string, value: string) => void
      removeItem?: (key: string) => void
      clear?: () => void
    }
  }

  if (g.localStorage && typeof g.localStorage.getItem !== 'function') {
    g.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    }
  }
}
