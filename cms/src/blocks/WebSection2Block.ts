import { Block } from 'payload'

export const WebSection2Block: Block = {
  slug: 'web-section-2',
  interfaceName: 'WebSection2Block',
  labels: {
    singular: 'Web-2: Online Business Solutions Featured In',
    plural: 'Web-2: Online Business Solutions Featured In',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default WebSection2Block