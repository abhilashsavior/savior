import { Block } from 'payload'

export const AboutSection1Block: Block = {
  slug: 'about-section-1',
  interfaceName: 'AboutSection1Block',
  labels: {
    singular: 'About-1: About Us Intro',
    plural: 'About-1: About Us Intro',
  },
  fields: [
    {
      name: 'image',
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
      name: 'highlightText',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Bold highlighted text below description',
      },
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
  ],
}

export default AboutSection1Block
