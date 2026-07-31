import { Field } from 'payload'

export function heroSection(): Field {
  return {
    name: 'hero',
    type: 'group',
    interfaceName: 'HeroSection',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'subtitle',
        type: 'textarea',
        localized: true,
        required: true,
      },
      {
        name: 'backgroundImage',
        type: 'upload',
        relationTo: 'media',
        required: false,
      },
      {
        name: 'primaryCTA',
        type: 'group',
        fields: [
          {
            name: 'label',
            type: 'text',
            localized: true,
          },
          {
            name: 'link',
            type: 'relationship',
            relationTo: 'pages',
          },
        ],
      },
      {
        name: 'secondaryCTA',
        type: 'group',
        fields: [
          {
            name: 'label',
            type: 'text',
            localized: true,
          },
          {
            name: 'phone',
            type: 'text',
          },
        ],
      },
    ],
  }
}
