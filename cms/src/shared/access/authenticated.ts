import type { AccessArgs } from 'payload'
import type { User } from '../../payload-types'

type isAuthenticated = ({ req: { user } }: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}