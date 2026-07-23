import type { Config } from '@/payload-types'
import { locales, pageCollectionsSlugs } from '@/payload.config'
import { createHash } from 'crypto'
import { PayloadRequest, type Where } from 'payload'

export type SitemapEntry = {
  path: string
  updatedAt: string
}

/**
 * Returns a list of all sitemap entries for the given locale.
 */
export async function getSitemap(req: PayloadRequest) {
  // if (!req.user) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  const locale = String(req.query.locale) as Config['locale']

  if (!locale) {
    return new Response('No locale query parameter provided.', { status: 400 })
  } else if (!locales.includes(locale)) {
    return new Response(
      `Invalid locale query parameter provided. Only ${locales.join(', ')} are allowed.`,
      {
        status: 400,
      },
    )
  }

  const pages: SitemapEntry[] = []

  // All collections that should be included in the sitemap
  const collections = [...pageCollectionsSlugs, 'case-studies' as const, 'resources' as const]

  for (const collection of collections) {
    const collectionConfig = req.payload.collections[collection].config
    const hasDrafts = typeof collectionConfig.versions === 'object' && collectionConfig.versions.drafts

    const where: Where = {
      'meta.noIndex': { not_equals: true },
    }

    if (hasDrafts) {
      where._status = { equals: 'published' }
    }

    const data = await req.payload.find({
      collection: collection,
      limit: 0, // fetch all docs
      locale: locale,
      depth: 0, // do not fetch related docs
      where,
      select: {
        path: true,
        updatedAt: true,
      },
    })

    type Doc = {
      id: string
      path: string
      updatedAt: string
    }

    for (const doc of data.docs as Doc[]) {
      pages.push({
        path: doc.path,
        updatedAt: doc.updatedAt,
      })
    }
  }

  const jsonString = JSON.stringify(pages)
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
