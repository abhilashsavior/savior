import { alternatePathsField, payloadPagesPlugin } from '@jhb.software/payload-pages-plugin'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { vercelBlobStorage } from './adapters/vercelBlob'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { attachDatabasePool } from '@vercel/functions'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import CodeBlock from './blocks/CodeBlock'
import ApiKeys from './collections/ApiKeys'
import Authors from './collections/Authors'
import CaseStudies from './collections/CaseStudies'
import Categories from './collections/Categories'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Posts from './collections/Posts'
import { Redirects } from './collections/Redirects'
import Resources from './collections/Resources'
import Tags from './collections/Tags'
import { Users } from './collections/Users'
import { contactEndpoint } from './endpoints/contact'
import { getGlobalData } from './endpoints/globalData'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStatisPagesProps } from './endpoints/staticPages'
import Footer from './globals/Footer'
import Header from './globals/Header'
import Labels from './globals/Labels'
import { fixHeaderGlobal } from './fixHeaderGlobal'
import { seedCMS } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const websiteName = 'Payload & Astro Website Template'

export const collections: CollectionConfig[] = [
  // Pages Collections
  Pages,
  Posts,
  Authors,

  // Data Collections
  Media,
  Categories,
  Tags,
  CaseStudies,
  Resources,

  // System Collections
  ApiKeys,
  Redirects,
  Users,
]

export const locales = ['de', 'en']

export const pageCollectionsSlugs: CollectionSlug[] = collections
  .filter((collection) => 'page' in collection && typeof collection.page === 'object')
  .map((collection) => collection.slug as CollectionSlug)

const generatePageURL = ({
  path,
  preview,
}: {
  path: string | null
  preview: boolean
}): string | null => {
  return path && process.env.NEXT_PUBLIC_FRONTEND_URL
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}${preview ? '/preview' : ''}${path}`
    : null
}

export default buildConfig({
  localization: {
    locales: locales.map((locale) => ({
      code: locale,
      label: {
        de: 'Deutsch',
        en: 'English',
      }[locale]!,
    })),
    defaultLocale: 'de',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ` - ${websiteName} CMS`,
    },
    components: {
      views: {
        dashboard: {
          Component: '/components/views/DashboardView#DashboardView',
        },
      },
    },
  },
  globals: [Header, Footer, Labels],
  collections: collections,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'relationship'),
      FixedToolbarFeature(),
      LinkFeature({ enabledCollections: pageCollectionsSlugs }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  csrf: (() => {
    const origins = new Set<string>()
    origins.add('http://localhost:3000')
    if (process.env.VERCEL_URL) {
      origins.add(`https://${process.env.VERCEL_URL}`)
    }
    if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
      origins.add(new URL(process.env.NEXT_PUBLIC_FRONTEND_URL).origin)
    }
    if (process.env.CSRF_ALLOW_ORIGIN) {
      origins.add(process.env.CSRF_ALLOW_ORIGIN)
    }
    return [...origins]
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
    // see https://vercel.com/guides/connection-pooling-with-functions
    // attachDatabasePool is Vercel-specific — skip in local dev to avoid errors
    ...(process.env.VERCEL
      ? { afterOpenConnection: async (adapter: any) => attachDatabasePool(adapter.connection.getClient()) }
      : {}),
  }),
  // Only configure email adapter when the API key is set (not needed in local dev)
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: 'cms@your-website.com',
          defaultFromName: `${websiteName} CMS`,
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),
  endpoints: [
    contactEndpoint,
    {
      path: '/static-paths',
      method: 'get',
      handler: getStatisPagesProps,
    },
    {
      path: '/sitemap',
      method: 'get',
      handler: getSitemap,
    },
    {
      path: '/page-props',
      method: 'get',
      handler: getPagePropsByPath,
    },
    {
      path: '/global-data',
      method: 'get',
      handler: getGlobalData,
    },
  ],
  blocks: [
    // Because the CodeBlock is only used inside the RichText editor of the articles, add it here to generate the type
    CodeBlock,
  ],
  sharp,
  plugins: [
    payloadPagesPlugin({
      generatePageURL,
    }),
    seoPlugin({
      collections: pageCollectionsSlugs,
      uploadsCollection: 'media',
      generateURL: ({ doc }) => generatePageURL({ path: doc.path, preview: false }) ?? '',
      generateTitle: ({ doc }) => `${doc.title} - ${websiteName}`,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'focusKeyword',
          type: 'text',
          admin: {
            description: 'Primary keyword for SEO optimization',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          index: true,
          defaultValue: false,
          admin: {
            description:
              'If checked, a noindex meta tag will be added to the page and it will be excluded from the sitemap.',
          },
        },
        alternatePathsField(),
      ],
      interfaceName: 'SeoMetadata',
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                prefix: 'media',
                disablePayloadAccessControl: true,
                disableLocalStorage: true,
                adapter: vercelBlobStorage({
                  prefix: 'media',
                }),
              },
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    await fixHeaderGlobal(payload)
    try {
      payload.logger.info('Calling seedCMS from onInit...')
      await seedCMS(payload, false) // Don't force - only seed if empty
      payload.logger.info('seedCMS execution complete.')
    } catch (err) {
      payload.logger.error('seedCMS failed: ' + err)
    }
  },
})
