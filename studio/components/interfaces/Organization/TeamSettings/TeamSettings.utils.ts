import { Role } from 'types'
import { checkPermissions } from 'hooks'
import { PermissionAction } from '@supabase/shared-types/out/constants'

export const getRolesManagementPermissions = (
  roles: Role[]
): { rolesAddable: Number[]; rolesRemovable: Number[] } => {
  const rolesAddable: Number[] = []
  const rolesRemovable: Number[] = []
  if (!roles) return { rolesAddable, rolesRemovable }

  roles.forEach((role: Role) => {
    const canAdd = checkPermissions(PermissionAction.CREATE, 'auth.subject_roles', {
      resource: { role_id: role.id },
    })
    if (canAdd) rolesAddable.push(role.id)

    const canRemove = checkPermissions(PermissionAction.DELETE, 'auth.subject_roles', {
      resource: { role_id: role.id },
    })
    if (canRemove) rolesRemovable.push(role.id)
  })

  return { rolesAddable, rolesRemovable }
}

export const getRolesInvitablePermissions = (roles: Role[]): { rolesInvitable: Number[] } => {
  const rolesInvitable: Number[] = []
  if (!roles) return { rolesInvitable }

  roles.forEach((role: Role) => {
    const canInvite = checkPermissions(PermissionAction.CREATE, 'user_invites', {
      resource: { role_id: role.id },
    })
    if (canInvite) rolesInvitable.push(role.id)
  })

  return { rolesInvitable }
}
