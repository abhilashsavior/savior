import { getPayload } from 'payload'
import config from '@/payload.config'
import { put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

export async function POST(_req: NextRequest) {
  const payload = await getPayload({ config })

  try {
    payload.logger.info('Starting media migration to Vercel Blob...')

    const allDocs: any[] = []
    let page = 1
    const limit = 100

    while (true) {
      const result = await payload.find({
        collection: 'media',
        limit,
        page,
      })
      allDocs.push(...result.docs)
      if (result.totalPages <= page) break
      page++
    }

    payload.logger.info(`Found ${allDocs.length} media documents`)

    let migrated = 0
    let skipped = 0
    let failed = 0
    const results: any[] = []

    for (const doc of allDocs) {
      try {
        const url = doc.url as string | undefined
        if (!url) {
          payload.logger.info(`Skipping ${doc.id}: no URL`)
          skipped++
          results.push({ id: doc.id, status: 'skipped', reason: 'no URL' })
          continue
        }

        const isLocal = url.startsWith('/api/media/file/') || url.startsWith('/media/')
        if (!isLocal) {
          payload.logger.info(`Skipping ${doc.id}: already remote (${url})`)
          skipped++
          results.push({ id: doc.id, status: 'skipped', reason: 'already remote' })
          continue
        }

        const filename = (doc.filename as string) || path.basename(url)
        const localPath = path.join(MEDIA_DIR, filename)

        try {
          await fs.access(localPath)
        } catch {
          payload.logger.warn(`Skipping ${doc.id}: local file not found at ${localPath}`)
          skipped++
          results.push({ id: doc.id, status: 'skipped', reason: 'local file not found', filename })
          continue
        }

        payload.logger.info(`Migrating ${doc.id}: ${filename}`)

        const fileBuffer = await fs.readFile(localPath)
        const blobPathname = `media/${filename}`

        const blob = await put(blobPathname, fileBuffer, {
          contentType: doc.mimeType || 'application/octet-stream',
          access: 'private',
          addRandomSuffix: true,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })

        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            url: blob.url,
            filename: blob.pathname.split('/').pop() || filename,
          },
        })

        payload.logger.info(`Migrated ${doc.id} -> ${blob.url}`)
        migrated++
        results.push({ id: doc.id, status: 'migrated', url: blob.url, filename })
      } catch (err) {
        payload.logger.error(`Failed to migrate ${doc.id}: ${err}`)
        failed++
        results.push({ id: doc.id, status: 'failed', error: String(err) })
      }
    }

    payload.logger.info(`Migration complete: ${migrated} migrated, ${skipped} skipped, ${failed} failed`)

    return NextResponse.json({ migrated, skipped, failed, results })
  } catch (err) {
    payload.logger.error(`Migration failed: ${err}`)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
