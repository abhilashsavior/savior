import { Block } from 'payload'

export const AboutSection3Block: Block = {
  slug: 'about-section-3',
  interfaceName: 'AboutSection3Block',
  labels: {
    singular: 'About-3: Our Agency',
    plural: 'About-3: Our Agency',
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
      name: 'brandLogos',
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
    {
      name: 'banners',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 2,
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
      ],
    },
  ],
}

export default AboutSection3Block
