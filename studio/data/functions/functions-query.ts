import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { aliFunctionsKeys } from './keys'

export type FunctionsVariables = { projectRef?: string }

export type FunctionListItem = {
  id: string
  funcName: string
  createdAt: number
  updatedAt: number
  methods: string[]
  endpoint: string
  desc: string
}

export async function getFunctions(
  { projectRef }: FunctionsVariables,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('projectRef is required')

  const response = await get(`${API_URL}/projects/${projectRef}/functions`, {
    signal,
  })
  if (response.error) throw response.error
  return response as FunctionListItem[]
}

export type FunctionsData = Awaited<ReturnType<typeof getFunctions>>
export type FunctionsError = {
  message: string
}

export const useFunctionsQuery = <TData = FunctionsData>(
  { projectRef }: FunctionsVariables,
  { enabled = true, ...options }: UseQueryOptions<FunctionsData, FunctionsError, TData> = {}
) =>
  useQuery<FunctionsData, FunctionsError, TData>(
    aliFunctionsKeys.list(projectRef),
    ({ signal }) => getFunctions({ projectRef }, signal),
    { enabled: enabled && typeof projectRef !== 'undefined', ...options }
  )
