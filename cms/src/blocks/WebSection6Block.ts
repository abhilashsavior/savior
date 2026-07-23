import { Block } from 'payload'

export const WebSection6Block: Block = {
  slug: 'web-section-6',
  interfaceName: 'WebSection6Block',
  labels: {
    singular: 'Web-6: Why Business Owners Love Working With Us',
    plural: 'Web-6: Why Business Owners Love With Us',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'highlightedText',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}

export default WebSection6Block