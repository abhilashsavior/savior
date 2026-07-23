import { CollectionGroups } from '@/shared/CollectionGroups'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

const Resources: PageCollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    group: CollectionGroups.ContentCollections,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'External URL',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Ecommerce Platforms', value: 'ecommerce-platforms' },
        { label: 'Email Marketing Apps', value: 'email-marketing-apps' },
        { label: 'Online Marketing Apps', value: 'online-marketing-apps' },
        { label: 'Stock Assets', value: 'stock-assets' },
        { label: 'Website Apps', value: 'website-apps' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

export default Resources
