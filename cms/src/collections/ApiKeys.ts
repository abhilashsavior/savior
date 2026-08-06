import { anyone } from '@/shared/access/anyone'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  labels: {
    singular: 'API Key',
    plural: 'API Keys',
  },
  admin: {
    useAsTitle: 'type',
    group: CollectionGroups.SystemCollections,
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: anyone,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Agent', value: 'agent' },
      ],
    },
  ],
}

export default ApiKeys
