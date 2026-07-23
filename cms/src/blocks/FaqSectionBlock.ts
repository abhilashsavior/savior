import { Block } from 'payload'

export const FaqSectionBlock: Block = {
  slug: 'faq-section',
  interfaceName: 'FaqSectionBlock',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Section',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: {
            description: 'Question number (e.g., 01, 02)',
          },
        },
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'isExpanded',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}

export default FaqSectionBlock