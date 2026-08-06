import { anyone } from '@/shared/access/anyone'
import { CollectionConfig } from 'payload'

const Avatar: CollectionConfig = {
  slug: 'avatar',
  admin: {
    group: 'Media',
    defaultColumns: ['image', 'createdAt'],
  },
  access: {
    read: anyone,
    update: anyone,
    delete: anyone,
    create: anyone,
  },
  fields: [
    {
      name: 'image',
      type: 'text',
      required: true,
      label: 'Image URL',
    },
  ],
}

export default Avatar