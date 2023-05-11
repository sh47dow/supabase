import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import {patch, post} from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { aliFunctionsKeys } from './keys'
import {FunctionResponse} from "./function-query";

export type FunctionUpdatePayload = {
  runtime: string
  timeout: number
  methods: string[]
  desc: string
  zipFile: string
  env: {key: string, value: string}[]
  hasInitializer: boolean
  initializer?: string
  initializationTimeout?: number
}

export type FunctionsUpdateVariables = {
  projectRef: string
  id: string
  payload: FunctionUpdatePayload
}

export async function updateFunction({
  projectRef,
  id,
  payload,
}: FunctionsUpdateVariables): Promise<FunctionResponse> {
  if (!projectRef) throw new Error('projectRef is required')
  if (!id) throw new Error('id is required')

  const data = {
    ...payload,
    env: payload.env.reduce((acc: any, item) => {
      acc[item.key] = item.value
      return acc
    }, {})
  }
  const response = await post(`${API_URL}/projects/${projectRef}/functions/${id}`, data)
  if (response.error) throw response.error

  return response
}

type FunctionsUpdateData = Awaited<ReturnType<typeof updateFunction>>

export const useFunctionUpdateMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<FunctionsUpdateData, { code?: number, message: string }, FunctionsUpdateVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<FunctionsUpdateData, { code?: number, message: string }, FunctionsUpdateVariables>(
    (vars) => updateFunction(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef, id } = variables
        await queryClient.invalidateQueries(aliFunctionsKeys.detail(projectRef, id))
        await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}
