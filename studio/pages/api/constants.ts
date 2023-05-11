const url = process.env.NODE_ENV === 'development' ? process.env.SUPABASE_URL : process.env.SUPABASE_PUBLIC_URL
const PUBLIC_URL = new URL(url || 'https://localhost:8000')

export const PROJECT_REST_URL = `${PUBLIC_URL.origin}/rest/v1/`
export const PROJECT_ENDPOINT = PUBLIC_URL.host
export const PROJECT_ENDPOINT_PROTOCOL = PUBLIC_URL.protocol.replace(':', '')

export const DEFAULT_PROJECT = {
  id: 1,
  ref: 'default',
  name: process.env.DEFAULT_PROJECT_NAME || 'Default Project',
  organization_id: 1,
  cloud_provider: 'localhost',
  status: 'ACTIVE_HEALTHY',
  region: 'local',
  inserted_at: '2021-08-02T06:40:40.646Z',
}

export const OSS_RETRY_ERRORS = ['InternalError', 'RequestTimeTooSkewedError', 'RequestTimeoutError', 'RequestError', 'ConnectionTimeoutError']
