import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
  }

  const result = await get(pathname, {
    access: 'private',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
  if (result === null) {
    return new NextResponse('Not found', { status: 404 })
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'private, no-cache',
    'X-Content-Type-Options': 'nosniff',
  }

  if (result.blob.contentType) {
    headers['Content-Type'] = result.blob.contentType
  }

  return new NextResponse(result.stream, {
    headers,
  })
}
