import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { aliFunctionsKeys } from './keys'

export type FunctionVariables = {
  projectRef?: string
  id?: string
}

export type FunctionResponse = {
  id: string
  funcName: string
  createdAt: number
  updatedAt: number
  runtime: string
  handler: string
  timeout: number
  methods: string[]
  endpoint: string
  desc: string
  zipFile: string
  zipFileUrl: string
  env: {
    key: string,
    value: string
  }[],
  hasInitializer: boolean,
  initializer: string,
  initializationTimeout: number,
}

export async function getFunctionDetail(
  { projectRef, id }: FunctionVariables,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('projectRef is required')
  if (!id) throw new Error('id is required')

  const response = await get(`${API_URL}/projects/${projectRef}/functions/${id}`, {
    signal,
  }).then(data => {
    return {
      ...data,
      env: Object.entries(data.env).map((item) => ({ key: item[0], value: item[1] }))
    }
  })
  if (response.error) throw response.error
  return response as FunctionResponse
}

export type FunctionData = Awaited<ReturnType<typeof getFunctionDetail>>
export type FunctionError = unknown

export const useFunctionQuery = <TData = FunctionData>(
  { projectRef, id }: FunctionVariables,
  { enabled = true, ...options }: UseQueryOptions<FunctionData, FunctionError, TData> = {}
) =>
  useQuery<FunctionData, FunctionError, TData>(
    aliFunctionsKeys.detail(projectRef, id),
    ({ signal }) => getFunctionDetail({ projectRef, id }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined' && typeof id !== 'undefined',
      ...options,
    }
  )

export const useResourcePrefetch = ({ projectRef, id }: FunctionVariables) => {
  const client = useQueryClient()

  return useCallback(() => {
    if (projectRef && id) {
      client.prefetchQuery(aliFunctionsKeys.detail(projectRef, id), ({ signal }) =>
        getFunctionDetail({ projectRef, id }, signal)
      )
    }
  }, [projectRef, id])
}
