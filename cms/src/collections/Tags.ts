import { CollectionGroups } from '@/shared/CollectionGroups'
import type { CollectionConfig } from 'payload'

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    group: CollectionGroups.ContentCollections,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Tags
