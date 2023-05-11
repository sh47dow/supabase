import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import {patch, post} from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { aliFunctionsKeys } from './keys'

export type FunctionCreatePayload = {
  funcName: string
  runtime: string
  timeout: number
  methods: string[]
  desc: string
  zipFile: string
  env: {key: string, value: string}[]
  handler: string,
  hasInitializer: boolean,
  initializer?: string,
  initializationTimeout?: number,
}

export type FunctionsCreateVariables = {
  projectRef: string
  payload: FunctionCreatePayload
}

export async function createFunction({
  projectRef,
  payload,
}: FunctionsCreateVariables) {
  if (!projectRef) throw new Error('projectRef is required')

  const response = await post(`${API_URL}/projects/${projectRef}/functions`, payload)
  if (response.error) throw response.error

  return response
}

type FunctionsCreateData = Awaited<ReturnType<typeof createFunction>>

export const useFunctionCreateMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<FunctionsCreateData, {code: number, message: string}, FunctionsCreateVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<FunctionsCreateData, {message: string, code: number}, FunctionsCreateVariables>(
    (vars) => createFunction(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables
        await queryClient.invalidateQueries(aliFunctionsKeys.list(projectRef))
        await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}

