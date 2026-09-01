export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
  const candidate = hasProtocol ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(candidate)
    if (!/^https?:$/.test(url.protocol)) return null
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null
    return url.toString()
  } catch {
    return null
  }
}
