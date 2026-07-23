import { Block } from 'payload'

export const PortfolioCarouselBlock: Block = {
  slug: 'portfolio-carousel',
  interfaceName: 'PortfolioCarouselBlock',
  labels: {
    singular: 'Home-10: Portfolio',
    plural: 'Home-10: Portfolio',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'boldHeading',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'subDescription',
      type: 'textarea',
      localized: true,
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
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'externalUrl',
          type: 'text',
          admin: {
            description: 'Use this instead of link for external URLs',
          },
        },
      ],
    },
    {
      name: 'phoneCta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'projects',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: 'pages',
        },
      ],
    },
    {
      name: 'viewAllLink',
      type: 'text',
      localized: true,
    },
  ],
}

export default PortfolioCarouselBlock