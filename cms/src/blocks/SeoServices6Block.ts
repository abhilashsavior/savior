import { Block } from 'payload'

export const SeoServices6Block: Block = {
  slug: 'seo-services-6',
  interfaceName: 'SeoServices6Block',
  labels: {
    singular: 'SEO Services 6',
    plural: 'SEO Services 6',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'headingHighlight',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      localized: true,
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
        },
        {
          name: 'title',
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
          name: 'showCta',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'ctaButton',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.showCta,
          },
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
            },
          ],
        },
{
           name: 'phoneCta',
           type: 'group',
           admin: {
             condition: (_, siblingData) => siblingData?.showCta,
           },
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
         {
           name: 'isExpanded',
           type: 'checkbox',
           defaultValue: false,
         },
      ],
    },
  ],
}

export default SeoServices6Block