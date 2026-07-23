import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig } from 'payload'

import { fixHeaderGlobal } from '../fixHeaderGlobal'
import {
  sanitizeHeaderGlobalData,
  sanitizeRelationshipId,
  sanitizeTextFieldValue,
} from './sanitizeGlobalFieldValues'

const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeOperation: [
      async ({ operation, req }) => {
        if (operation === 'update') {
          try {
            await fixHeaderGlobal(req.payload)
          } catch (err) {
            req.payload.logger.error({ err, msg: 'fixHeaderGlobal failed, continuing save' })
          }
        }
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        return sanitizeHeaderGlobalData(data)
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (doc.phone) {
          doc.phone = sanitizeTextFieldValue(doc.phone)
        }

        if (doc.clientLoginLink) {
          doc.clientLoginLink = sanitizeTextFieldValue(doc.clientLoginLink)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hooks: {
        beforeChange: [({ value }) => sanitizeRelationshipId(value)],
      },
    },
    {
      type: 'array',
      name: 'links',
      maxRows: 10,
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
        {
          name: 'enableDropdown',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable dropdown menu for this link',
            width: '50%',
          },
        },
        {
          name: 'dropdown',
          type: 'group',
          admin: {
            description: 'Configure dropdown menu for this link',
            condition: (_data, siblingData) => siblingData?.enableDropdown === true,
          },
          fields: [
            {
              name: 'services',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'link',
                  type: 'relationship',
                  relationTo: 'pages',
                },
                {
                  name: 'highlighted',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Show in orange color (first item style)',
                  },
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
                  localized: true,
                  required: true,
                },
                {
                  name: 'authorName',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'authorTitle',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'authorImage',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Background image for the right side of dropdown',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [({ value }) => sanitizeTextFieldValue(value)],
      },
    },
    {
      name: 'clientLoginLink',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [({ value }) => sanitizeTextFieldValue(value)],
      },
    },
    {
      name: 'cta',
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
          hooks: {
            beforeChange: [({ value }) => sanitizeRelationshipId(value)],
          },
        },
      ],
    },
  ],
}

export default Header
