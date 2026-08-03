import { put, del } from '@vercel/blob'

function getStoreId(): string | null {
  return process.env.BLOB_STORE_ID || null
}

function buildBlobUrl(pathname: string, access: 'private' | 'public' = 'public'): string | null {
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
        return buildBlobUrl(pathname, 'public') || ''
      },
      handleDelete: async ({ doc, filename }: { doc: any; filename: string }) => {
        let url: string | null = null

        if (filename) {
          const pathname = resolvedPrefix ? `${resolvedPrefix}/${filename}` : filename
          url = buildBlobUrl(pathname, 'public')
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
          access: 'public',
          addRandomSuffix: true,
          allowOverwrite: true,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })

        return {
          filename: file.filename,
          filesize: file.filesize,
          mimeType: file.mimeType,
          url: blob.url,
        }
      },
      staticHandler: async (_req: any, _args: any) => {
        return new Response('Not implemented', { status: 501 })
      },
    }
  }
}
