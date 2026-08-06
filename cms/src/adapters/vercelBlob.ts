import { put, del, get } from '@vercel/blob'

function getStoreId(): string | null {
  return process.env.BLOB_STORE_ID || null
}

function buildBlobUrl(pathname: string, access: 'private' | 'public' = 'private'): string | null {
  const storeId = getStoreId()
  if (!storeId) return null
  const domain = access === 'private' ? '.private' : '.public'
  return `https://${storeId}${domain}.blob.vercel-storage.com/${pathname}`
}

export const vercelBlobStorage = (options?: { prefix?: string }) => {
  const prefix = options?.prefix || ''

  return ({ collection, prefix: filePrefix }: { collection: any; prefix?: string }) => {
    const resolvedPrefix = prefix || filePrefix

    return {
      name: 'vercel-blob',
      clientUploads: false,
      fields: [],
      generateURL: async ({ data, filename }: { data: any; filename: string }) => {
        if (data?.url) {
          return data.url
        }

        const pathname = resolvedPrefix ? `${resolvedPrefix}/${filename}` : filename
        return buildBlobUrl(pathname, 'private') || ''
      },
      handleDelete: async ({ doc, filename }: { doc: any; filename: string }) => {
        let url: string | null = null

        if (filename) {
          const pathname = resolvedPrefix ? `${resolvedPrefix}/${filename}` : filename
          url = buildBlobUrl(pathname, 'private')
        } else if (doc?.url) {
          url = doc.url
        }

        if (!url) return

        await del(url, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
      },
      handleUpload: async ({ file }: { file: any }) => {
        const pathname = resolvedPrefix ? `${resolvedPrefix}/${file.filename}` : file.filename

        const blob = await put(pathname, file.buffer, {
          contentType: file.mimeType,
          access: 'private',
          addRandomSuffix: true,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })

        return {
          filename: blob.pathname.split('/').pop() || file.filename,
          filesize: file.filesize,
          mimeType: file.mimeType,
          url: blob.url,
        }
      },
      staticHandler: async (_req: any, args: any) => {
        const { filename, prefix } = args.params || {}
        if (!filename) {
          return new Response('Missing filename', { status: 400 })
        }

        const pathname = prefix ? `${prefix}/${filename}` : filename

        try {
          const result = await get(pathname, {
            access: 'private',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          })

          if (result === null) {
            return new Response('Not found', { status: 404 })
          }

          const headers: Record<string, string> = {
            'Cache-Control': 'private, no-cache',
            'X-Content-Type-Options': 'nosniff',
          }

          if (result.blob.contentType) {
            headers['Content-Type'] = result.blob.contentType
          }

          return new Response(result.stream, {
            headers,
          })
        } catch (err) {
          return new Response('Not found', { status: 404 })
        }
      },
    }
  }
}
