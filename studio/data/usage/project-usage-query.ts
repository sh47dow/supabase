import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { usageKeys } from './keys'

export type ProjectUsageVariables = {
  projectRef?: string
}

export interface UsageMetric {
  usage: number
  limit: number
  cost: number
  available_in_plan: boolean
}

export type ProjectUsageResponse = {
  db_size: UsageMetric
  db_egress: UsageMetric
  storage_size: UsageMetric
  storage_egress: UsageMetric
  storage_image_render_count: UsageMetric
  monthly_active_users: UsageMetric
  monthly_active_sso_users: UsageMetric
  realtime_message_count: UsageMetric
  realtime_peak_connection: UsageMetric
  func_count: UsageMetric
  func_invocations: UsageMetric
  disk_volume_size_gb: number
}

export type ProjectUsageResponseUsageKeys = keyof Omit<ProjectUsageResponse, 'disk_volume_size_gb'>

export async function getProjectUsage({ projectRef }: ProjectUsageVariables, signal?: AbortSignal) {
  if (!projectRef) {
    throw new Error('projectRef is required')
  }

  const response = await get(`${API_URL}/projects/${projectRef}/usage`, {
    signal,
  })
  if (response.error) {
    throw response.error
  }

  return response as ProjectUsageResponse
}

export type ProjectUsageData = Awaited<ReturnType<typeof getProjectUsage>>
export type ProjectUsageError = unknown

export const useProjectUsageQuery = <TData = ProjectUsageData>(
  { projectRef }: ProjectUsageVariables,
  { enabled = true, ...options }: UseQueryOptions<ProjectUsageData, ProjectUsageError, TData> = {}
) =>
  useQuery<ProjectUsageData, ProjectUsageError, TData>(
    usageKeys.usage(projectRef),
    ({ signal }) => getProjectUsage({ projectRef }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      // @ts-ignore, ensure that all usage values are numbers
      select(data) {
        const formattedData: any = {}
        Object.keys(data).forEach((attribute: any) => {
          const originalAttributeData = (data as any)[attribute]
          const attributeData =
            typeof originalAttributeData === 'object'
              ? ({
                  ...originalAttributeData,
                  usage: Number((data as any)[attribute].usage),
                } as UsageMetric)
              : originalAttributeData
          formattedData[attribute] = attributeData
        })
        return formattedData as ProjectUsageResponse
      },
      ...options,
    }
  )

export const useProjectUsagePrefetch = ({ projectRef }: ProjectUsageVariables) => {
  const client = useQueryClient()

  return useCallback(() => {
    if (projectRef) {
      client.prefetchQuery(usageKeys.usage(projectRef), ({ signal }) =>
        getProjectUsage({ projectRef }, signal)
      )
    }
  }, [projectRef])
}
