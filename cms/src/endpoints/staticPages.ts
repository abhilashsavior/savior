import type { Config } from '@/payload-types'
import { pageCollectionsSlugs } from '@/payload.config'
import { createHash } from 'crypto'
import { CollectionSlug, PayloadRequest, type Where } from 'payload'

export type StaticPageProps = {
  id: string
  paths: Partial<Record<Config['locale'], string>>
  collection: CollectionSlug
}

/**
 * Returns a list of all pages with the props the frontend needs to prerender them.
 */
export async function getStatisPagesProps(req: PayloadRequest) {
  // Note: This endpoint is public for website builds (SSG). Data is already public via page collections.

  const collectionItems: StaticPageProps[] = []

  // All collections that should be included in static path generation
  const collections = [...pageCollectionsSlugs, 'case-studies' as const, 'resources' as const]

  for (const collection of collections) {
    const collectionConfig = req.payload.collections[collection].config
    const hasDrafts = typeof collectionConfig.versions === 'object' && collectionConfig.versions.drafts

    const where: Where = {}

    if (hasDrafts) {
      where._status = { equals: 'published' }
    }

    const data = await req.payload.find({
      collection: collection,
      limit: 0, // fetch all docs
      locale: 'all',
      depth: 0, // do not fetch related docs
      where,
      select: {
        path: true,
      },
    })

    type Doc = {
      id: string
      path: Partial<Record<Config['locale'], string>>
      collection: CollectionSlug
    }

    for (const doc of data.docs as Doc[]) {
      collectionItems.push({
        id: doc.id,
        paths: doc.path,
        collection: collection,
      })
    }
  }

  const jsonString = JSON.stringify(collectionItems)
  const etag = createHash('md5').update(jsonString).digest('hex')

  // Check if the client has a matching etag
  const ifNoneMatch = req.headers.get('if-none-match')
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 })
  }

  return new Response(jsonString, {
    headers: {
      'Content-Type': 'application/json',
      ETag: etag,
      'Cache-Control': 'no-cache',
    },
  })
}
