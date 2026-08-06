export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const protocol = window.location.protocol || 'http:'
    const hostname = window.location.hostname
    return `${protocol}//${hostname}:4000/api`
  }

  return 'http://localhost:4000/api'
}
