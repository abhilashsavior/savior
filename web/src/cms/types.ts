import type { Author, CaseStudy, Config, Page, Post, Resource } from 'cms/src/payload-types'

export type CMSConfig = Config
export type Locale = Config['locale']

export type PageData = Page | Post | Author | CaseStudy | Resource
