import { anyone } from '@/shared/access/anyone'
import { CollectionGroups } from '@/shared/CollectionGroups'
import type { CollectionConfig, FieldAccess } from 'payload'

const fieldAccess: FieldAccess = () => true

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'roles'],
    listSearchableFields: ['email', 'firstName', 'lastName'],
    group: CollectionGroups.SystemCollections,
  },
  auth: true,
  access: {
    read: anyone,
    update: anyone,
    delete: anyone,
    create: anyone,
  },
  fields: [
    // Email field is added by default
    {
      name: 'firstName',
      required: true,
      type: 'text',
    },
    {
      name: 'lastName',
      required: true,
      type: 'text',
    },
    {
      name: 'roles',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      access: {
        create: fieldAccess,
        update: fieldAccess,
      },
      options: [
        // Editors can read, create, update and delete content
        {
          label: 'Editor',
          value: 'editor',
        },
        // Admins add or delete users
        {
          label: 'Admin',
          value: 'admin',
        },
        // Developers can see additional debug information
        {
          label: 'Developer',
          value: 'developer',
        },
      ],
    },
  ],
}
