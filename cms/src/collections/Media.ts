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
    ...(process.env.STORED_MEDIA_PROVIDER === 'vercel-blob'
      ? {}
      : {
          staticDir: 'media',
        }),
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'xs',
        width: 480,
      },
      {
        name: 'sm',
        width: 768,
      },
      {
        name: 'md',
        width: 1024,
      },
      {
        name: 'lg',
        width: 1920,
      },
      {
        name: 'xl',
        width: 2560,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
      },
    ],
    adminThumbnail: 'sm',
  },
  access: {
    read: anyone,
    update: anyone,
    delete: anyone,
    create: anyone,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: false,
      localized: true,
    },
  ],
}
