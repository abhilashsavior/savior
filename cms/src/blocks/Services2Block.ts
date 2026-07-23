import { Block } from 'payload'

export const Services2Block: Block = {
  slug: 'services-2',
  interfaceName: 'Services2Block',
  labels: {
    singular: 'Services 2',
    plural: 'Services 2',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlayImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'overlayText',
      type: 'text',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'headingHighlight',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'number',
          type: 'text',
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
          required: true,
          localized: true,
        },
      ],
    },
  ],
}

export default Services2Block