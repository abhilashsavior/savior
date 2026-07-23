import { Block } from 'payload'

export const CaseStudyCarouselBlock: Block = {
  slug: 'case-study-carousel',
  interfaceName: 'CaseStudyCarouselBlock',
  labels: {
    singular: 'Case Study Carousel Block',
    plural: 'Case Study Carousel Blocks',
  },
  fields: [
    {
      name: 'sectionHeading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Main heading above the carousel',
      },
    },
    {
      name: 'sectionSubheading',
      type: 'text',
      localized: true,
      admin: {
        description: 'Subheading below main heading',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: {
        description: 'Shared background image for every slide',
      },
    },
    {
      name: 'caseStudies',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'eyebrow',
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
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'testimonial',
          type: 'group',
          fields: [
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
          ],
        },
      ],
    },
  ],
}

export default CaseStudyCarouselBlock