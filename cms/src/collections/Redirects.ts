import { anyone } from '@/shared/access/anyone'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { RedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'

export const Redirects: RedirectsCollectionConfig = {
  slug: 'redirects',
  admin: {
    group: CollectionGroups.SystemCollections,
  },
  access: {
  read: () => true,
  update: anyone,
  delete: anyone,
  create: anyone,
},
  redirects: {},
  // fields are managed by the plugin
  fields: [],
}
