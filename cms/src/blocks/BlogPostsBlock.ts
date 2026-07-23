import { Block } from 'payload'

export const BlogPostsBlock: Block = {
  slug: 'blog-posts',
  interfaceName: 'BlogPostsBlock',
  labels: {
    singular: 'Blog Posts Block',
    plural: 'Blog Posts Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Blog Posts',
      localized: true,
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select blog posts to display',
      },
    },
  ],
}

export default BlogPostsBlock