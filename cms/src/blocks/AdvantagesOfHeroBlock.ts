import { Block } from 'payload'

export const AdvantagesOfHeroBlock: Block = {
  slug: 'advantages-of-hero',
  interfaceName: 'AdvantagesOfHeroBlock',
  labels: {
    singular: 'Home-5: Advantages of Hero',
    plural: 'Home-5: Advantages of Hero',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Advantages of Hero',
    },
    {
      name: 'boldHeading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Marketing from Savior',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Partanburg, South Carolina Roofing Case Study',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue:
        'In a period of 3 months we were able to acquire 817 Conversion Actions, decrease the CPA to $7.95 , increase the Conversion Rate to 21,81% and establish Crossroads Counseling as an authority in the Tulsa Counseling Industry.',
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
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
          defaultValue:
            'I\'ve worked with Savior Marketing for over a year now. We\'ve seen a huge increase in the conversions and a great decrease in cost per conversion. They were clear in their reports and document very thoroughly and modifications and improvements. We\'ve had to hire additional admin staff, and over 10 more providers due to the growth of our company over the last year. I would recommend them to any business owner wanting paid marketing.',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: '- Angus M.',
        },
      ],
    },
  ],
}

export default AdvantagesOfHeroBlock