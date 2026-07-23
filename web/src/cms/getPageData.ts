import type { CollectionSlug } from 'payload'
import { payloadSDK } from './sdk'
import type { Locale, PageData } from './types'

export async function getPageData(
  collection: CollectionSlug,
  id: string,
  locale: Locale,
  options?: { preview?: boolean },
): Promise<PageData> {
  const result = await payloadSDK.find(
    {
      collection: collection,
      locale,
      draft: options?.preview ? true : false,
      depth: 2,
      where: {
        id: {
          equals: id,
        },
      },
      limit: 1,
      pagination: false,
    },
    {
      headers: {
        'X-Use-Cache': options?.preview ? 'false' : 'true',
      },
    },
  )

  if (!result || !Array.isArray(result.docs)) {
    console.error('CMS API returned an unexpected response:', result)
    throw new Error(
      'Failed to fetch page data from CMS. Check that the CMS server is running and accessible at the configured CMS_URL.',
    )
  }

  if (result.totalDocs === 0) {
    throw new Error('Page for collection ' + collection + ' with id ' + id + ' not found')
  }

  return result.docs.at(0) as unknown as PageData
}
