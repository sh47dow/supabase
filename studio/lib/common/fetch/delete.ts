import { handleError, handleResponse, handleResponseError, constructHeaders } from './base'
import { uuidv4 } from '../../helpers'
import { SupaResponse } from 'types/base'

export async function delete_<T = any>(
  url: string,
  data?: { [prop: string]: any },
  options?: { [prop: string]: any }
): Promise<SupaResponse<T>> {
  const requestId = uuidv4()
  try {
    const { headers: optionHeaders, ...otherOptions } = options ?? {}
    const headers = constructHeaders(requestId, optionHeaders)
    const response = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(data),
      credentials: 'include',
      referrerPolicy: 'no-referrer-when-downgrade',
      headers,
      ...otherOptions,
    })

    if (!response.ok) return handleResponseError(response, requestId)
    return handleResponse(response, requestId)
  } catch (error) {
    return handleError(error, requestId)
  }
}
