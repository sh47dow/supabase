import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { delete_ } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { aliFunctionsKeys } from './keys'

export type FunctionsDeleteVariables = {
  projectRef: string
  id: string
}

export async function deleteFunction({ projectRef, id }: FunctionsDeleteVariables) {
  if (!projectRef) throw new Error('projectRef is required')

  const response = await delete_(`${API_URL}/projects/${projectRef}/functions/${id}`, {})
  if (response.error) {
    throw response.error
  }

  return response
}

type FunctionsDeleteData = Awaited<ReturnType<typeof deleteFunction>>

export const useFunctionDeleteMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<FunctionsDeleteData, unknown, FunctionsDeleteVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<FunctionsDeleteData, unknown, FunctionsDeleteVariables>(
    (vars) => deleteFunction(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables
        await queryClient.invalidateQueries(aliFunctionsKeys.list(projectRef), {
          refetchType: 'all',
        })
        await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}
