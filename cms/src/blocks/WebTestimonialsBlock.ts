import { Block } from 'payload'

export const WebTestimonialsBlock: Block = {
  slug: 'web-testimonials',
  interfaceName: 'WebTestimonialsBlock',
  labels: {
    singular: 'Web-7: Testimonials Carousel',
    plural: 'Web-7: Testimonials Carousel',
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
        },
        {
          name: 'authorImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'scrollText',
      type: 'text',
      localized: true,
      defaultValue: 'Continue Scrolling',
    },
  ],
}

export default WebTestimonialsBlock