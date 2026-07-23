import { CollectionGroups } from '@/shared/CollectionGroups'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

const INDUSTRY_OPTIONS = [
  { label: 'App', value: 'app' },
  { label: 'Cannabis/CBD', value: 'cannabis-cbd' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'E-commerce', value: 'e-commerce' },
  { label: 'Health Care', value: 'health-care' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Roofing', value: 'roofing' },
]

const CaseStudies: PageCollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    group: CollectionGroups.ContentCollections,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'industry',
      type: 'select',
      required: true,
      options: INDUSTRY_OPTIONS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'aboutText',
      type: 'richText',
      label: 'About the Client',
      editor: lexicalEditor(),
    },
    {
      name: 'challengeText',
      type: 'richText',
      label: 'The Challenge',
      editor: lexicalEditor(),
    },
    {
      name: 'solutionText',
      type: 'richText',
      label: 'Our Solution',
      editor: lexicalEditor(),
    },
    {
      name: 'resultsText',
      type: 'richText',
      label: 'The Results',
      editor: lexicalEditor(),
    },
  ],
}

export default CaseStudies
