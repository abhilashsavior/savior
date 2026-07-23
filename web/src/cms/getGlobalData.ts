import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

export interface GlobalData {
  header: Header
  footer: Footer
  labels: Labels
}

function getEmptyGlobalData(): GlobalData {
  return {
    header: { id: '', logo: '' } as Header,
    footer: { id: '' } as Footer,
    labels: {
      id: '',
      global: { 'show-more': '', 'learn-more': '', 'open-menu': '', 'close-menu': '' },
      posts: { 'written-by': '', 'last-updated-at': '' },
      'not-found-page': { title: 'Not Found', description: 'Page not found', 'home-page-button': 'Home' },
    },
  }
}

/**
 * Fetches all global data (header, footer, and labels) from the CMS in a single request.
 * This is more efficient than making separate requests for each global.
 */
export async function getGlobalData({
  locale,
  preview,
}: {
  locale: Locale
  preview: boolean
}): Promise<GlobalData> {
  let response: Response

  try {
    response = await payloadSDK.request({
      method: 'GET',
      path: `/global-data?locale=${locale}&preview=${preview}`,
      init: {
        headers: {
          'X-Use-Cache': preview ? 'false' : 'true',
        },
      },
    })
  } catch (err) {
    console.warn('Failed to fetch global data from CMS:', err)
    return getEmptyGlobalData()
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch global data: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GlobalData

  if (!data.header || !data.footer || !data.labels) {
    console.error(data)
    throw new Error('Incomplete global data received from CMS')
  }

  return data
}
