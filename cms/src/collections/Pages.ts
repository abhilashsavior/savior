import BrandsBlock from '@/blocks/BrandsBlock'
import AboutBlock from '@/blocks/AboutBlock'
import TransparencyBlock from '@/blocks/TransparencyBlock'
import AdvantagesOfHeroBlock from '@/blocks/AdvantagesOfHeroBlock'
import ServicesBlock from '@/blocks/ServicesBlock'
import Services2Block from '@/blocks/Services2Block'
import WhyChooseBlock from '@/blocks/WhyChooseBlock'
import TestimonialsBlock from '@/blocks/TestimonialsBlock'
import DynamicWordPressBlock from '@/blocks/DynamicWordPressBlock'
import PortfolioCarouselBlock from '@/blocks/PortfolioCarouselBlock'
import AgencyHeroBrandsBlock from '@/blocks/AgencyHeroBrandsBlock'
import CtaBlock from '@/blocks/CtaBlock'
import RichTextBlock from '@/blocks/RichTextBlock'
import BlogPostsBlock from '@/blocks/BlogPostsBlock'
import AuthorsBlock from '@/blocks/AuthorsBlock'
import CaseStudyCarouselBlock from '@/blocks/CaseStudyCarouselBlock'
import LoginBlock from '@/blocks/LoginBlock'
import OnlineBusinessBlock from '@/blocks/OnlineBusinessBlock'
import FeaturedCaseStudyBlock from '@/blocks/FeaturedCaseStudyBlock'
import CounselingBlock from '@/blocks/CounselingBlock'
import PortfolioGridBlock from '@/blocks/PortfolioGridBlock'
import AboutSection1Block from '@/blocks/AboutSection1Block'
import AboutSection2Block from '@/blocks/AboutSection2Block'
import AboutSection3Block from '@/blocks/AboutSection3Block'
import AboutSection4Block from '@/blocks/AboutSection4Block'
import AboutSection5Block from '@/blocks/AboutSection5Block'
import WebTestimonialsBlock from '@/blocks/WebTestimonialsBlock'
import WebSection2Block from '@/blocks/WebSection2Block'
import WebSection6Block from '@/blocks/WebSection6Block'
import SecretsBlock from '@/blocks/SecretsBlock'
import OurSeoBlock from '@/blocks/OurSeoBlock'
import SeoServices2Block from '@/blocks/SeoServices2Block'
import SeoServices6Block from '@/blocks/SeoServices6Block'
import PricingSectionBlock from '@/blocks/PricingSectionBlock'
import FaqSectionBlock from '@/blocks/FaqSectionBlock'
import { heroSection } from '@/fields/heroSection'
import { authenticated } from '@/shared/access/authenticated'
import type { Access, AccessArgs } from 'payload'
import type { User } from '../../payload-types'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

// Allow public access to pages with login block or marked as public
const canReadPage: Access = ({ req: { user }, doc }: AccessArgs<User>) => {
  // Allow if user is authenticated
  if (user) return true
  
  // Allow public access to pages marked as public
  if (doc?.public === true) return true
  
  // Check for login block when doc is available
  if (doc?.sections) {
    const hasLoginBlock = doc.sections.some((section: any) => 
      section?.blocks?.some((block: any) => block?.blockType === 'login')
    )
    if (hasLoginBlock) return true
  }
  
  return false
}

const Pages: PageCollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'status', 'updatedAt'],
    group: CollectionGroups.PagesCollections,
  },
  versions: {
    drafts: true,
  },
  access: {
    read: canReadPage,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
    },
    isRootCollection: true,
  },
  defaultPopulate: {
    // only populate the fields that are required by the frontend (e.g. for breadcrumbs and navigation)
    title: true,
    path: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'needsRebuild',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Flagged by migration script — page content imported from Elementor JSON and needs manual block reconstruction',
      },
    },
    heroSection(),
    {
      name: 'hidePageShell',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'When enabled, hides header, footer, hero section, and page title — the block content becomes the full page.',
      },
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Allow public access to this page (useful for login pages)',
      },
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'subTitle',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'highlightBackground',
          type: 'checkbox',
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [BrandsBlock, AboutBlock, TransparencyBlock, AdvantagesOfHeroBlock, ServicesBlock, Services2Block, WhyChooseBlock, TestimonialsBlock, DynamicWordPressBlock, PortfolioCarouselBlock, AgencyHeroBrandsBlock, CtaBlock, RichTextBlock, BlogPostsBlock, AuthorsBlock, CaseStudyCarouselBlock, LoginBlock, OnlineBusinessBlock, FeaturedCaseStudyBlock, CounselingBlock, PortfolioGridBlock, AboutSection1Block, AboutSection2Block, AboutSection3Block, AboutSection4Block, AboutSection5Block, WebTestimonialsBlock, WebSection2Block, WebSection6Block, SecretsBlock, OurSeoBlock, SeoServices2Block, SeoServices6Block, PricingSectionBlock, FaqSectionBlock],
        },
      ],
    },
  ],
}

export default Pages
