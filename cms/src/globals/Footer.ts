import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig } from 'payload'

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'logoText', 
              type: 'text',
              localized: true,
              required: true,
              defaultValue: 'Savior',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              required: true,
              defaultValue: 'We are a dynamic, hands-on digital marketing service. Committed to helping businesses and entrepreneurs grow their business.',
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: {
                singular: 'Social Link',
                plural: 'Social Links',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Behance', value: 'behance' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Quick Links',
          fields: [
            {
              name: 'links',
              type: 'array',
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              fields: [
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Let's Talk",
          fields: [
            {
              name: 'talkTitle',
              type: 'text',
              localized: true,
              required: true,
              defaultValue: "Let's Talk",
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phone',
              type: 'text',
              defaultValue: '1-866-260-3833',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'locationText',
              type: 'text',
              localized: true,
              defaultValue: 'Made w/ in New York',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'address',
              type: 'textarea',
              localized: true,
              defaultValue: '2578 Broadway #546, New York, NY 10025',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          label: 'Call to Action',
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              localized: true,
              defaultValue: 'Learn 5 Website Fixes to Increase Your Revenue.',
            },
            {
              name: 'ctaButtonLabel',
              type: 'text',
              localized: true,
              defaultValue: 'Download Free eBook Now',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'ctaButtonUrl',
              type: 'text',
              defaultValue: '#',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          label: 'Featured Blog Post',
          fields: [
            {
              name: 'featuredPost',
              type: 'relationship',
              relationTo: 'posts',
              required: false,
              admin: {
                description: 'Select a post to display in the footer right column. If none selected, the latest post will be displayed.',
              },
            },
          ],
        },
        {
          label: 'Bottom Bar',
          fields: [
            {
              name: 'transparencyText',
              type: 'text',
              localized: true,
              defaultValue: 'WE BELIEVE IN TRANSPARENCY',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'copyright',
              type: 'text',
              localized: true,
              defaultValue: '© 2023 Savior Marketing, LLC. All Rights Reserved.',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'bottomLinks',
              type: 'array',
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              fields: [
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Footer
