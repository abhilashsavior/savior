import { Block } from 'payload'

export const AboutSection5Block: Block = {
  slug: 'about-section-5',
  interfaceName: 'AboutSection5Block',
  labels: {
    singular: 'About-5: Scale CTA',
    plural: 'About-5: Scale CTA',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
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
      name: 'primaryCta',
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
  ],
}

export default AboutSection5Block
