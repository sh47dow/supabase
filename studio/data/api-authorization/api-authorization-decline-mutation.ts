import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { delete_ } from 'lib/common/fetch'
import { API_ADMIN_URL } from 'lib/constants'
// import { resourceKeys } from './keys'

export type ApiAuthorizationDeclineVariables = {
  id: string
}

export async function declineApiAuthorization({ id }: ApiAuthorizationDeclineVariables) {
  if (!id) throw new Error('Authorization ID is required')

  const response = await delete_(`${API_ADMIN_URL}/oauth/authorization/${id}`, {})
  if (response.error) throw response.error
  return response
}

type ApiAuthorizationDeclineData = Awaited<ReturnType<typeof declineApiAuthorization>>

export const useApiAuthorizationDeclineMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<ApiAuthorizationDeclineData, unknown, ApiAuthorizationDeclineVariables>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<ApiAuthorizationDeclineData, unknown, ApiAuthorizationDeclineVariables>(
    (vars) => declineApiAuthorization(vars),
    {
      async onSuccess(data, variables, context) {
        // const { id } = variables
        // await queryClient.invalidateQueries(networkRestrictionKeys.list(projectRef))
        // await onSuccess?.(data, variables, context)
      },
      ...options,
    }
  )
}
