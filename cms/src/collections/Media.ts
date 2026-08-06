import { anyone } from '@/shared/access/anyone'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: CollectionGroups.MediaCollections,
    defaultColumns: ['filename', 'title', 'alt', 'createdAt', 'updatedAt'],
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [],
    adminThumbnail: ({ doc }) => doc.url,
  },
  access: {
    read: anyone,
    update: anyone,
    delete: anyone,
    create: anyone,
  },
  fields: [
    // TODO: use the alt-text-plugin: https://www.npmjs.com/package/@jhb.software/payload-alt-text-plugin
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: false,
      localized: true,
    },
  ],
}
