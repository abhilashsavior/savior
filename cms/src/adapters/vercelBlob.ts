import { put, del } from '@vercel/blob'

function getStoreInfo(): { storeId: string; region: string } | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return null
  const match = token.match(/^vercel_blob_rw_([^_]+)_([^_]+)_/)
  if (match) {
    return { storeId: match[1], region: match[2] }
  }
  return null
}

function buildBlobUrl(pathname: string): string | null {
  const info = getStoreInfo()
  if (!info) return null
  return `https://${info.storeId}.${info.region}.blob.vercel-storage.com/${pathname}`
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
        return buildBlobUrl(pathname) || ''
      },
      handleDelete: async ({ doc, filename }: { doc: any; filename: string }) => {
        let url: string | null = null

        if (filename) {
          const pathname = resolvedPrefix ? `${resolvedPrefix}/${filename}` : filename
          url = buildBlobUrl(pathname)
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
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: file.mimeType,
          access: 'public',
          addRandomSuffix: false,
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
