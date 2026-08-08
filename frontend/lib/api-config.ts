const DEFAULT_PRODUCTION_API_URL = 'https://pdfforge-backend.onrender.com'
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000'

function formatApiUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '')
  if (trimmed.endsWith('/api') || trimmed.endsWith('/api/v1')) {
    return trimmed
  }
  return `${trimmed}/api`
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL
  if (envUrl) {
    return formatApiUrl(envUrl)
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0'

    if (isLocal) {
      return formatApiUrl(DEFAULT_LOCAL_API_URL)
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return formatApiUrl(DEFAULT_LOCAL_API_URL)
  }

  return formatApiUrl(DEFAULT_PRODUCTION_API_URL)
}

