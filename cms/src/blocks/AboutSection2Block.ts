import { Block } from 'payload'

export const AboutSection2Block: Block = {
  slug: 'about-section-2',
  interfaceName: 'AboutSection2Block',
  labels: {
    singular: 'About-2: Meet The Team',
    plural: 'About-2: Meet The Team',
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
      name: 'teamMembers',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}

export default AboutSection2Block
