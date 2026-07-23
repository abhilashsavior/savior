import { Block } from 'payload'

export const CounselingBlock: Block = {
  slug: 'counseling',
  interfaceName: 'CounselingBlock',
  labels: {
    singular: 'About: Counseling Practice Section',
    plural: 'About: Counseling Practice Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Heading text like "Counseling Practice"',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Subheading like "Practice" on the next line in bold',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: {
        description: 'Full-width background image on the left side',
      },
    },
    {
      name: 'testimonialCard',
      type: 'group',
      fields: [
        {
          name: 'text',
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
      ],
    },
    {
      name: 'caseStudy',
      type: 'group',
      fields: [
        {
          name: 'label',
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
      ],
    },
  ],
}

export default CounselingBlock
