import { Block } from 'payload'

export const FeaturedCaseStudyBlock: Block = {
  slug: 'featured-case-study',
  interfaceName: 'FeaturedCaseStudyBlock',
  labels: {
    singular: 'Featured Case Study Block',
    plural: 'Featured Case Study Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Category label above the heading (e.g. "Counseling Practice")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Main case study title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short description of the case study',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Read Case Study',
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: {
        description: 'Full-width background image',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: {
        description: 'Featured image displayed on the left side',
      },
    },
  ],
}

export default FeaturedCaseStudyBlock
