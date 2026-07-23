# WordPress → Payload + Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate savior.im from WordPress 6.9.4 to the existing Payload CMS + Astro stack via a big-bang migration — new collections, migration script, pixel-perfect Figma-matched frontend, contact form endpoint, multi-step estimate form, and SEO redirects.

**Architecture:** Parse the WP XML export with a Node.js script that calls Payload's REST API in phases (media → taxonomies → authors → posts → pages → case studies → resources). Frontend rebuilds all pages pixel-perfect from Figma (135 frames, ~40 in-scope pages). Service pages share a `ServiceLayout`. Location pages share a `LocationLayout`. The multi-step estimate form is a React island (`EstimateForm.tsx`). A Payload custom endpoint handles all form submissions.

**Tech Stack:** Payload CMS v3 (Next.js 15), Astro 5, React (islands for EstimateForm), MongoDB Atlas, Hetzner S3, Resend (email), Zapier/Make (webhook), `fast-xml-parser`, Tailwind CSS v4, TypeScript

**Figma:** `https://www.figma.com/design/bZPtQN0hU43f7FgPRICCC2/Savior--Copy-` — all frames are 1920px desktop-first; no design tokens defined in file

**Spec:** `docs/superpowers/specs/2026-03-31-wordpress-to-payload-migration-design.md`

---

## File Map

### CMS — New files
- `cms/src/collections/CaseStudies.ts` — CaseStudies collection
- `cms/src/collections/Categories.ts` — Blog categories
- `cms/src/collections/Tags.ts` — Blog tags
- `cms/src/collections/Resources.ts` — Resources collection
- `cms/src/blocks/CaseStudiesBlock.ts` — CaseStudies block
- `cms/src/blocks/ResourcesBlock.ts` — Resources block
- `cms/src/blocks/TestimonialsBlock.ts` — Testimonials block
- `cms/src/blocks/ContactFormBlock.ts` — Contact form block
- `cms/src/blocks/LocationBlock.ts` — Location page block
- `cms/src/endpoints/contact.ts` — Contact form POST endpoint
- `cms/scripts/migrate-from-wp.ts` — Migration script (all phases)
- `cms/scripts/media-map.json` — Auto-generated; maps WP attachment ID → Payload media ID

### CMS — Modified files
- `cms/src/collections/Posts.ts` — Add categories, tags, readingTime, meta fields
- `cms/src/collections/Pages.ts` — Add metaTitle, metaDescription, focusKeyword to meta group
- `cms/src/payload.config.ts` — Register new collections, blocks, endpoint
- `cms/src/endpoints/sitemap.ts` — Add CaseStudies and Resources to sitemap query
- `cms/src/endpoints/static-paths.ts` — Add CaseStudies and Resources
- `cms/src/endpoints/pageProps.ts` — Add CaseStudies and Resources routing

### Web — New files

**Design tokens (do first):**
- `web/src/styles/tokens.css` — CSS custom properties: brand colors, font families, spacing scale extracted from Figma frames

**Layouts:**
- `web/src/layout/HomeLayout.astro` — Home page (unique hero + sections)
- `web/src/layout/NotFoundLayout.astro` — 404 page
- `web/src/layout/ServiceLayout.astro` — Shared layout for all 6 service pages
- `web/src/layout/LocationLayout.astro` — Shared layout for all 17 location pages
- `web/src/layout/CareersLayout.astro` — Static careers page + modal
- `web/src/layout/collections/CaseStudyLayout.astro` — Single case study
- `web/src/layout/collections/CaseStudiesCollectionLayout.astro` — Case studies index
- `web/src/layout/collections/PortfolioLayout.astro` — Website portfolio index
- `web/src/layout/collections/PortfolioItemLayout.astro` — Single portfolio item
- `web/src/layout/collections/ResourcesLayout.astro` — Resources index

**Blocks:**
- `web/src/components/blocks/CaseStudiesBlock.astro` — Case studies grid block
- `web/src/components/blocks/ResourcesBlock.astro` — Resources list block
- `web/src/components/blocks/TestimonialsBlock.astro` — Testimonials block
- `web/src/components/blocks/ContactFormBlock.astro` — Contact form block
- `web/src/components/blocks/LocationBlock.astro` — Location content block

**Interactive islands:**
- `web/src/components/EstimateForm.tsx` — Multi-step estimate form React island (14 Figma frames → state machine: steps 1–4 universal, step 5 branches by service type, step 6 confirmation)

### Web — Modified files
- `web/src/pages/404.astro` — Use new `NotFoundLayout`
- `web/astro.config.mjs` — Add `PUBLIC_CMS_URL` env var; add React integration for EstimateForm island
- `vercel.json` — Add global WP → `/en/` redirect rule

---

## Task 1: Add `Categories` and `Tags` collections to Payload

**Files:**
- Create: `cms/src/collections/Categories.ts`
- Create: `cms/src/collections/Tags.ts`
- Modify: `cms/src/payload.config.ts`

- [ ] **Step 1: Create Categories collection**

```ts
// cms/src/collections/Categories.ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
  ],
}
```

- [ ] **Step 2: Create Tags collection**

```ts
// cms/src/collections/Tags.ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
  ],
}
```

- [ ] **Step 3: Register in payload.config.ts**

Open `cms/src/payload.config.ts`. Add `Categories` and `Tags` to the `collections` array alongside the existing ones:

```ts
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'

// Inside buildConfig({ collections: [...] })
// Add: Categories, Tags
```

- [ ] **Step 4: Verify dev server starts without errors**

```bash
cd cms && pnpm dev
```

Expected: No TypeScript errors, Payload admin shows Categories and Tags in sidebar.

- [ ] **Step 5: Generate types**

```bash
cd cms && pnpm generate:types
```

- [ ] **Step 6: Commit**

```bash
git add cms/src/collections/Categories.ts cms/src/collections/Tags.ts cms/src/payload.config.ts cms/src/payload-types.ts
git commit -m "feat(cms): add Categories and Tags collections"
```

---

## Task 2: Add SEO meta fields to `Posts` and `Pages`

**Files:**
- Modify: `cms/src/collections/Posts.ts`
- Modify: `cms/src/collections/Pages.ts`

- [ ] **Step 1: Read current Posts collection**

Read `cms/src/collections/Posts.ts` to understand the current field structure before editing.

- [ ] **Step 2: Add fields to Posts**

Add the following fields to the `Posts` collection's `fields` array. Add `categories` and `tags` near the top (after `title`/`slug`), and the `meta` group in the sidebar area:

```ts
// Relationship fields — add after existing content fields
{
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  admin: { position: 'sidebar' },
},
{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
  admin: { position: 'sidebar' },
},
{
  name: 'readingTime',
  type: 'number',
  admin: {
    position: 'sidebar',
    description: 'Estimated reading time in minutes',
  },
},
// SEO group — add as a new group field
{
  name: 'meta',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'focusKeyword', type: 'text' },
  ],
},
```

- [ ] **Step 3: Read current Pages collection**

Read `cms/src/collections/Pages.ts` to find the existing `meta` group and `noIndex` field.

- [ ] **Step 4: Add SEO fields and needsRebuild to Pages**

Find the existing `meta` group in Pages and add `metaTitle`, `metaDescription`, `focusKeyword` fields inside it alongside `noIndex`. Also add a top-level `needsRebuild` field (used by the migration script to flag Elementor-heavy pages for manual reconstruction):

```ts
// Add as a top-level field (sidebar)
{
  name: 'needsRebuild',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Flagged by migration script — page content imported from Elementor JSON and needs manual block reconstruction',
  },
},
// Update existing meta group to include SEO fields
{
  name: 'meta',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'focusKeyword', type: 'text' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
  ],
},
```

- [ ] **Step 5: Generate types and verify**

```bash
cd cms && pnpm generate:types
```

Expected: `payload-types.ts` now includes `categories`, `tags`, `readingTime`, `meta.metaTitle`, `meta.metaDescription`, `meta.focusKeyword` on Post type; same SEO fields on Page type.

- [ ] **Step 6: Commit**

```bash
git add cms/src/collections/Posts.ts cms/src/collections/Pages.ts cms/src/payload-types.ts
git commit -m "feat(cms): add categories, tags, readingTime, and SEO meta fields to Posts and Pages"
```

---

## Task 3: Create `CaseStudies` collection

**Files:**
- Create: `cms/src/collections/CaseStudies.ts`
- Modify: `cms/src/payload.config.ts`

- [ ] **Step 1: Create CaseStudies collection**

```ts
// cms/src/collections/CaseStudies.ts
import type { CollectionConfig } from 'payload'

const INDUSTRY_OPTIONS = [
  { label: 'App', value: 'app' },
  { label: 'Cannabis/CBD', value: 'cannabis-cbd' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'E-commerce', value: 'e-commerce' },
  { label: 'Health Care', value: 'health-care' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Roofing', value: 'roofing' },
]

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'industry',
      type: 'select',
      required: true,
      options: INDUSTRY_OPTIONS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'aboutText',
      type: 'richText',
      label: 'About the Client',
    },
    {
      name: 'challengeText',
      type: 'richText',
      label: 'The Challenge',
    },
    {
      name: 'solutionText',
      type: 'richText',
      label: 'Our Solution',
    },
    {
      name: 'resultsText',
      type: 'richText',
      label: 'The Results',
    },
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'focusKeyword', type: 'text' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
```

- [ ] **Step 2: Register in payload.config.ts**

```ts
import { CaseStudies } from './collections/CaseStudies'
// Add CaseStudies to the collections array
```

- [ ] **Step 3: Generate types and verify**

```bash
cd cms && pnpm generate:types
```

- [ ] **Step 4: Commit**

```bash
git add cms/src/collections/CaseStudies.ts cms/src/payload.config.ts cms/src/payload-types.ts
git commit -m "feat(cms): add CaseStudies collection"
```

---

## Task 4: Create `Resources` collection

**Files:**
- Create: `cms/src/collections/Resources.ts`
- Modify: `cms/src/payload.config.ts`

- [ ] **Step 1: Create Resources collection**

```ts
// cms/src/collections/Resources.ts
import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'External URL',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Ecommerce Platforms', value: 'ecommerce-platforms' },
        { label: 'Email Marketing Apps', value: 'email-marketing-apps' },
        { label: 'Online Marketing Apps', value: 'online-marketing-apps' },
        { label: 'Stock Assets', value: 'stock-assets' },
        { label: 'Website Apps', value: 'website-apps' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
```

- [ ] **Step 2: Register in payload.config.ts**

```ts
import { Resources } from './collections/Resources'
// Add Resources to the collections array
```

- [ ] **Step 3: Generate types and verify**

```bash
cd cms && pnpm generate:types
```

- [ ] **Step 4: Commit**

```bash
git add cms/src/collections/Resources.ts cms/src/payload.config.ts cms/src/payload-types.ts
git commit -m "feat(cms): add Resources collection"
```

---

## Task 5: Create new CMS blocks

**Files:**
- Create: `cms/src/blocks/CaseStudiesBlock.ts`
- Create: `cms/src/blocks/ResourcesBlock.ts`
- Create: `cms/src/blocks/TestimonialsBlock.ts`
- Create: `cms/src/blocks/ContactFormBlock.ts`
- Create: `cms/src/blocks/LocationBlock.ts`

- [ ] **Step 1: Read an existing block for pattern reference**

Read `cms/src/blocks/BlogPostsBlock.ts` to understand the block structure pattern.

- [ ] **Step 2: Create CaseStudiesBlock**

```ts
// cms/src/blocks/CaseStudiesBlock.ts
import type { Block } from 'payload'

export const CaseStudiesBlock: Block = {
  slug: 'case-studies-block',
  labels: { singular: 'Case Studies Block', plural: 'Case Studies Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Max items to show (0 = all)',
      defaultValue: 0,
    },
    {
      name: 'filterByIndustry',
      type: 'select',
      hasMany: true,
      label: 'Pre-filter by industry (leave empty for all)',
      options: [
        { label: 'App', value: 'app' },
        { label: 'Cannabis/CBD', value: 'cannabis-cbd' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'E-commerce', value: 'e-commerce' },
        { label: 'Health Care', value: 'health-care' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Real Estate', value: 'real-estate' },
        { label: 'Roofing', value: 'roofing' },
      ],
    },
  ],
}
```

- [ ] **Step 3: Create ResourcesBlock**

```ts
// cms/src/blocks/ResourcesBlock.ts
import type { Block } from 'payload'

export const ResourcesBlock: Block = {
  slug: 'resources-block',
  labels: { singular: 'Resources Block', plural: 'Resources Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'filterByCategory',
      type: 'select',
      hasMany: true,
      label: 'Pre-filter by category (leave empty for all)',
      options: [
        { label: 'Ecommerce Platforms', value: 'ecommerce-platforms' },
        { label: 'Email Marketing Apps', value: 'email-marketing-apps' },
        { label: 'Online Marketing Apps', value: 'online-marketing-apps' },
        { label: 'Stock Assets', value: 'stock-assets' },
        { label: 'Website Apps', value: 'website-apps' },
      ],
    },
  ],
}
```

- [ ] **Step 4: Create TestimonialsBlock**

```ts
// cms/src/blocks/TestimonialsBlock.ts
import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials-block',
  labels: { singular: 'Testimonials Block', plural: 'Testimonials Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'comment', type: 'textarea', required: true },
        { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
      ],
    },
  ],
}
```

- [ ] **Step 5: Create ContactFormBlock**

```ts
// cms/src/blocks/ContactFormBlock.ts
import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contact-form-block',
  labels: { singular: 'Contact Form Block', plural: 'Contact Form Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Get in Touch',
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Send Message',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: "Thanks! We'll be in touch soon.",
    },
  ],
}
```

- [ ] **Step 6: Create LocationBlock**

```ts
// cms/src/blocks/LocationBlock.ts
import type { Block } from 'payload'

export const LocationBlock: Block = {
  slug: 'location-block',
  labels: { singular: 'Location Block', plural: 'Location Blocks' },
  fields: [
    { name: 'city', type: 'text', required: true },
    { name: 'state', type: 'text', required: true },
    { name: 'heroHeading', type: 'text' },
    { name: 'heroSubheading', type: 'text' },
    { name: 'bodyContent', type: 'richText' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}
```

- [ ] **Step 7: Register all new blocks in payload.config.ts**

Read `cms/src/payload.config.ts` to find where existing blocks are registered (likely inside `Pages` collection's `blocks` array or a shared blocks config). Add all 5 new blocks there.

```ts
import { CaseStudiesBlock } from './blocks/CaseStudiesBlock'
import { ResourcesBlock } from './blocks/ResourcesBlock'
import { TestimonialsBlock } from './blocks/TestimonialsBlock'
import { ContactFormBlock } from './blocks/ContactFormBlock'
import { LocationBlock } from './blocks/LocationBlock'
```

- [ ] **Step 8: Generate types and verify dev server**

```bash
cd cms && pnpm generate:types && pnpm dev
```

Expected: No errors; all 5 new blocks appear in admin block picker.

- [ ] **Step 9: Commit**

```bash
git add cms/src/blocks/ cms/src/payload.config.ts cms/src/payload-types.ts
git commit -m "feat(cms): add CaseStudiesBlock, ResourcesBlock, TestimonialsBlock, ContactFormBlock, LocationBlock"
```

---

## Task 6: Create contact form Payload endpoint

**Files:**
- Create: `cms/src/endpoints/contact.ts`
- Modify: `cms/src/payload.config.ts`

- [ ] **Step 1: Install Resend SDK**

```bash
cd cms && pnpm add resend
```

- [ ] **Step 2: Read an existing endpoint for pattern reference**

Read `cms/src/endpoints/globalData.ts` (or similar) to understand the endpoint pattern used in this codebase.

- [ ] **Step 3: Create the contact endpoint**

```ts
// cms/src/endpoints/contact.ts
import type { Endpoint } from 'payload'
import { Resend } from 'resend'

export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req) => {
    const body = await req.json()
    const { name, email, message, phone } = body

    if (!name || !email || !message) {
      return Response.json(
        { error: 'name, email, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'contact@savior.im',
        to: 'bharat@savior.im',
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\n\nMessage:\n${message}`,
      })

      if (process.env.CONTACT_WEBHOOK_URL) {
        await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, phone }),
        })
      }

      return Response.json({ success: true })
    } catch (err) {
      console.error('Contact form error:', err)
      return Response.json({ error: 'Failed to send message' }, { status: 500 })
    }
  },
}
```

- [ ] **Step 4: Register endpoint in payload.config.ts**

```ts
import { contactEndpoint } from './endpoints/contact'

// Inside buildConfig, add to endpoints array:
endpoints: [contactEndpoint, /* ...existing endpoints */]
```

- [ ] **Step 5: Add env vars to Render (manual step)**

In Render dashboard, add:
```
RESEND_API_KEY=<your key from resend.com>
CONTACT_WEBHOOK_URL=<your Zapier or Make webhook URL>
```

- [ ] **Step 6: Test the endpoint manually**

With dev server running:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

Expected: `{"success":true}`

- [ ] **Step 7: Commit**

```bash
git add cms/src/endpoints/contact.ts cms/src/payload.config.ts
git commit -m "feat(cms): add contact form endpoint with Resend email and webhook forwarding"
```

---

## Task 7: Update sitemap and static-paths endpoints

**Files:**
- Modify: `cms/src/endpoints/sitemap.ts`
- Modify: `cms/src/endpoints/static-paths.ts`
- Modify: `cms/src/endpoints/pageProps.ts` (if it exists)

- [ ] **Step 1: Read current endpoint files**

Read `cms/src/endpoints/sitemap.ts` and `cms/src/endpoints/static-paths.ts` to understand the current query pattern.

- [ ] **Step 2: Add CaseStudies and Resources to sitemap**

In `sitemap.ts`, find where collections are queried (likely an array of `{ collection, path }` entries). Add:

```ts
{ collection: 'case-studies', pathPrefix: '/case-studies/' },
{ collection: 'resources', pathPrefix: '/resources/' },
```

- [ ] **Step 3: Add CaseStudies and Resources to static-paths**

In `static-paths.ts`, add `case-studies` and `resources` to the collections that generate static paths.

- [ ] **Step 4: Update pageProps routing**

In `pageProps.ts` (or wherever collection routing is determined), add a case for `case-studies` and `resources` that returns the appropriate document.

- [ ] **Step 5: Verify dev server**

```bash
cd cms && pnpm dev
```

Then check: `http://localhost:3000/api/sitemap` — should include case-studies and resources paths once documents exist.

- [ ] **Step 6: Commit**

```bash
git add cms/src/endpoints/
git commit -m "feat(cms): add CaseStudies and Resources to sitemap and static-paths endpoints"
```

---

## Task 8: Write the WordPress migration script

**Files:**
- Create: `cms/scripts/migrate-from-wp.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd cms && pnpm add -D fast-xml-parser tsx
```

- [ ] **Step 2: Create the migration script skeleton**

```ts
// cms/scripts/migrate-from-wp.ts
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'

const WP_XML_PATH = path.resolve(__dirname, '../../savior.WordPress.2026-03-31.xml')
const PAYLOAD_API = process.env.PAYLOAD_API_URL ?? 'http://localhost:3000/api'
const API_KEY = process.env.MIGRATION_API_KEY ?? ''
const MEDIA_MAP_PATH = path.resolve(__dirname, 'media-map.json')

const headers = {
  'Content-Type': 'application/json',
  Authorization: `api-keys API-Key ${API_KEY}`,
}

function loadMediaMap(): Record<string, string> {
  if (fs.existsSync(MEDIA_MAP_PATH)) {
    return JSON.parse(fs.readFileSync(MEDIA_MAP_PATH, 'utf-8'))
  }
  return {}
}

function saveMediaMap(map: Record<string, string>) {
  fs.writeFileSync(MEDIA_MAP_PATH, JSON.stringify(map, null, 2))
}

function parseXml() {
  const xml = fs.readFileSync(WP_XML_PATH, 'utf-8')
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    isArray: (name) => ['item', 'wp:postmeta', 'wp:category', 'wp:tag', 'wp:term', 'wp:author', 'category'].includes(name),
  })
  return parser.parse(xml)
}

function getMeta(postmeta: any[], key: string): string {
  const entry = postmeta?.find((m: any) => m['wp:meta_key']?.__cdata === key)
  return entry?.['wp:meta_value']?.__cdata ?? ''
}

async function payloadPost(endpoint: string, data: object): Promise<any> {
  const res = await fetch(`${PAYLOAD_API}/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST /${endpoint} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function payloadExists(endpoint: string, slug: string): Promise<boolean> {
  const res = await fetch(`${PAYLOAD_API}/${endpoint}?where[slug][equals]=${slug}&limit=1`, { headers })
  const data = await res.json()
  return data.totalDocs > 0
}

// Phase runners (implemented in subsequent steps)
async function migrateMedia(items: any[]) { /* Step 3 */ }
async function migrateCategories(data: any) { /* Step 4 */ }
async function migrateTags(data: any) { /* Step 4 */ }
async function migratePosts(items: any[], mediaMap: Record<string, string>) { /* Step 5 */ }
async function migratePages(items: any[], mediaMap: Record<string, string>) { /* Step 6 */ }
async function migrateCaseStudies(items: any[], mediaMap: Record<string, string>) { /* Step 7 */ }
async function migrateResources(items: any[], mediaMap: Record<string, string>) { /* Step 8 */ }

async function main() {
  console.log('Parsing WordPress XML...')
  const data = parseXml()
  const items: any[] = data.rss.channel.item

  const PHASE = process.env.PHASE ?? 'all'

  if (PHASE === 'all' || PHASE === 'media') {
    await migrateMedia(items.filter((i: any) => i['wp:post_type']?.__cdata === 'attachment'))
  }
  const mediaMap = loadMediaMap()

  if (PHASE === 'all' || PHASE === 'taxonomies') {
    await migrateCategories(data.rss.channel)
    await migrateTags(data.rss.channel)
  }
  if (PHASE === 'all' || PHASE === 'posts') {
    await migratePosts(items.filter((i: any) => i['wp:post_type']?.__cdata === 'post' && i['wp:status']?.__cdata === 'publish'), mediaMap)
  }
  if (PHASE === 'all' || PHASE === 'pages') {
    await migratePages(items.filter((i: any) => i['wp:post_type']?.__cdata === 'page' && i['wp:status']?.__cdata === 'publish'), mediaMap)
  }
  if (PHASE === 'all' || PHASE === 'case-studies') {
    await migrateCaseStudies(items.filter((i: any) => {
      // Identify case study pages by their category assignment or slug pattern
      const categories: any[] = Array.isArray(i.category) ? i.category : (i.category ? [i.category] : [])
      return i['wp:post_type']?.__cdata === 'page' && categories.some((c: any) => c['@_domain'] === 'case_study_category')
    }), mediaMap)
  }
  if (PHASE === 'all' || PHASE === 'resources') {
    await migrateResources(items.filter((i: any) => {
      const categories: any[] = Array.isArray(i.category) ? i.category : (i.category ? [i.category] : [])
      return i['wp:post_type']?.__cdata === 'page' && categories.some((c: any) => c['@_domain'] === 'resources_categories')
    }), mediaMap)
  }

  console.log('Migration complete.')
}

main().catch(console.error)
```

- [ ] **Step 3: Implement migrateMedia phase**

Replace the `migrateMedia` stub with:

```ts
async function migrateMedia(attachments: any[]) {
  console.log(`Migrating ${attachments.length} media attachments...`)
  const mediaMap = loadMediaMap()

  for (const item of attachments) {
    const wpId = String(item['wp:post_id'])
    if (mediaMap[wpId]) {
      console.log(`  Skip (already migrated): ${wpId}`)
      continue
    }

    const fileUrl: string = item['wp:attachment_url']?.__cdata ?? item.guid?.__cdata ?? ''
    if (!fileUrl) continue

    try {
      const fileRes = await fetch(fileUrl)
      if (!fileRes.ok) {
        console.warn(`  Failed to fetch: ${fileUrl}`)
        continue
      }

      const buffer = Buffer.from(await fileRes.arrayBuffer())
      const filename = fileUrl.split('/').pop() ?? `attachment-${wpId}`
      const contentType = fileRes.headers.get('content-type') ?? 'image/jpeg'

      const formData = new FormData()
      formData.append('file', new Blob([buffer], { type: contentType }), filename)
      formData.append('alt', item.title?.__cdata ?? '')

      const uploadRes = await fetch(`${PAYLOAD_API}/media`, {
        method: 'POST',
        headers: { Authorization: `api-keys API-Key ${API_KEY}` },
        body: formData,
      })

      if (!uploadRes.ok) {
        console.warn(`  Upload failed for ${filename}: ${uploadRes.status}`)
        continue
      }

      const uploaded = await uploadRes.json()
      mediaMap[wpId] = uploaded.doc?.id ?? uploaded.id
      saveMediaMap(mediaMap)
      console.log(`  Uploaded: ${filename} → ${mediaMap[wpId]}`)
    } catch (err) {
      console.error(`  Error for ${wpId}:`, err)
    }
  }
  console.log('Media migration complete.')
}
```

- [ ] **Step 4: Implement migrateCategories and migrateTags**

```ts
async function migrateCategories(channel: any) {
  const categories = Array.isArray(channel['wp:category']) ? channel['wp:category'] : []
  console.log(`Migrating ${categories.length} categories...`)
  for (const cat of categories) {
    const slug: string = cat['wp:category_nicename']?.__cdata ?? ''
    const name: string = cat['wp:cat_name']?.__cdata ?? ''
    if (!slug || slug === 'uncategorized') continue
    if (await payloadExists('categories', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }
    await payloadPost('categories', { name, slug })
    console.log(`  Created category: ${slug}`)
  }
}

async function migrateTags(channel: any) {
  const tags = Array.isArray(channel['wp:tag']) ? channel['wp:tag'] : []
  console.log(`Migrating ${tags.length} tags...`)
  for (const tag of tags) {
    const slug: string = tag['wp:tag_slug']?.__cdata ?? ''
    const name: string = tag['wp:tag_name']?.__cdata ?? ''
    if (!slug) continue
    if (await payloadExists('tags', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }
    await payloadPost('tags', { name, slug })
    console.log(`  Created tag: ${slug}`)
  }
}
```

- [ ] **Step 5: Implement migratePosts**

```ts
async function migratePosts(posts: any[], mediaMap: Record<string, string>) {
  console.log(`Migrating ${posts.length} posts...`)

  for (const item of posts) {
    const slug: string = item['wp:post_name']?.__cdata ?? ''
    if (!slug) continue
    if (await payloadExists('posts', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }

    const postmeta: any[] = Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : []
    const thumbnailWpId = getMeta(postmeta, '_thumbnail_id')
    const featuredImageId = thumbnailWpId ? mediaMap[thumbnailWpId] : undefined

    const categoryNames: string[] = Array.isArray(item.category)
      ? item.category.filter((c: any) => c['@_domain'] === 'category').map((c: any) => c['@_nicename'])
      : []
    const tagNames: string[] = Array.isArray(item.category)
      ? item.category.filter((c: any) => c['@_domain'] === 'post_tag').map((c: any) => c['@_nicename'])
      : []

    // Resolve category IDs
    const categoryIds: string[] = []
    for (const catSlug of categoryNames) {
      const res = await fetch(`${PAYLOAD_API}/categories?where[slug][equals]=${catSlug}&limit=1`, { headers })
      const data = await res.json()
      if (data.docs?.[0]?.id) categoryIds.push(data.docs[0].id)
    }

    const tagIds: string[] = []
    for (const tagSlug of tagNames) {
      const res = await fetch(`${PAYLOAD_API}/tags?where[slug][equals]=${tagSlug}&limit=1`, { headers })
      const data = await res.json()
      if (data.docs?.[0]?.id) tagIds.push(data.docs[0].id)
    }

    const doc: any = {
      title: item.title?.__cdata ?? item.title ?? '',
      slug,
      content: item['content:encoded']?.__cdata ?? '',
      publishedAt: item['wp:post_date_gmt']?.__cdata,
      categories: categoryIds,
      tags: tagIds,
      meta: {
        metaTitle: getMeta(postmeta, '_yoast_wpseo_title'),
        metaDescription: getMeta(postmeta, '_yoast_wpseo_metadesc'),
        focusKeyword: getMeta(postmeta, '_yoast_wpseo_focuskw'),
        noIndex: getMeta(postmeta, '_yoast_wpseo_meta-robots-noindex') === '1',
      },
    }

    if (featuredImageId) doc.featuredImage = featuredImageId

    await payloadPost('posts', doc)
    console.log(`  Created post: ${slug}`)
  }
}
```

- [ ] **Step 6: Implement migratePages**

```ts
function extractTextFromElementorJson(json: string): string {
  try {
    const parsed = JSON.parse(json)
    const texts: string[] = []
    const walk = (node: any) => {
      if (typeof node === 'string' && node.length > 0) texts.push(node)
      if (typeof node === 'object' && node !== null) {
        Object.values(node).forEach(walk)
      }
    }
    walk(parsed)
    return texts.filter(t => !t.startsWith('{') && t.length > 2).join('\n')
  } catch {
    return ''
  }
}

async function migratePages(pages: any[], mediaMap: Record<string, string>) {
  console.log(`Migrating ${pages.length} pages...`)

  for (const item of pages) {
    const slug: string = item['wp:post_name']?.__cdata ?? ''
    if (!slug) continue
    if (await payloadExists('pages', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }

    const postmeta: any[] = Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : []
    const elementorData = getMeta(postmeta, '_elementor_data')
    const thumbnailWpId = getMeta(postmeta, '_thumbnail_id')
    const featuredImageId = thumbnailWpId ? mediaMap[thumbnailWpId] : undefined

    const hasElementor = elementorData.length > 10
    const bodyText = hasElementor
      ? extractTextFromElementorJson(elementorData)
      : item['content:encoded']?.__cdata ?? ''

    const doc: any = {
      title: item.title?.__cdata ?? item.title ?? '',
      slug,
      // Payload expects richText as Lexical JSON — store as plain text in a RichTextBlock for now
      // Pages with needsRebuild=true will be manually reconstructed
      needsRebuild: hasElementor,
      _importedContent: bodyText, // temporary field to hold raw text for manual rebuild
      meta: {
        metaTitle: getMeta(postmeta, '_yoast_wpseo_title'),
        metaDescription: getMeta(postmeta, '_yoast_wpseo_metadesc'),
        focusKeyword: getMeta(postmeta, '_yoast_wpseo_focuskw'),
        noIndex: getMeta(postmeta, '_yoast_wpseo_meta-robots-noindex') === '1',
      },
    }

    if (featuredImageId) doc.featuredImage = featuredImageId

    await payloadPost('pages', doc)
    console.log(`  Created page: ${slug}${hasElementor ? ' [needs rebuild]' : ''}`)
  }
}
```

- [ ] **Step 7: Implement migrateCaseStudies**

```ts
async function migrateCaseStudies(items: any[], mediaMap: Record<string, string>) {
  console.log(`Migrating ${items.length} case studies...`)

  for (const item of items) {
    const slug: string = item['wp:post_name']?.__cdata ?? ''
    if (!slug) continue
    if (await payloadExists('case-studies', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }

    const postmeta: any[] = Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : []
    const thumbnailWpId = getMeta(postmeta, '_thumbnail_id')
    const featuredImageId = thumbnailWpId ? mediaMap[thumbnailWpId] : undefined

    const industryTerms: any[] = Array.isArray(item.category)
      ? item.category.filter((c: any) => c['@_domain'] === 'case_study_category')
      : []
    const industry = industryTerms[0]?.['@_nicename'] ?? ''

    const doc: any = {
      title: item.title?.__cdata ?? item.title ?? '',
      slug,
      client: getMeta(postmeta, 'client_name') || (item.title?.__cdata ?? ''),
      industry,
      publishedDate: item['wp:post_date_gmt']?.__cdata,
      aboutText: getMeta(postmeta, 'about_text'),
      challengeText: getMeta(postmeta, 'challenge_text'),
      solutionText: getMeta(postmeta, 'solution_text'),
      resultsText: getMeta(postmeta, 'results_text'),
      meta: {
        metaTitle: getMeta(postmeta, '_yoast_wpseo_title'),
        metaDescription: getMeta(postmeta, '_yoast_wpseo_metadesc'),
        focusKeyword: getMeta(postmeta, '_yoast_wpseo_focuskw'),
        noIndex: getMeta(postmeta, '_yoast_wpseo_meta-robots-noindex') === '1',
      },
    }

    if (featuredImageId) doc.featuredImage = featuredImageId

    await payloadPost('case-studies', doc)
    console.log(`  Created case study: ${slug}`)
  }
}
```

- [ ] **Step 8: Implement migrateResources**

```ts
async function migrateResources(items: any[], mediaMap: Record<string, string>) {
  console.log(`Migrating ${items.length} resources...`)

  for (const item of items) {
    const slug: string = item['wp:post_name']?.__cdata ?? ''
    if (!slug) continue
    if (await payloadExists('resources', slug)) {
      console.log(`  Skip: ${slug}`)
      continue
    }

    const postmeta: any[] = Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : []
    const categoryTerms: any[] = Array.isArray(item.category)
      ? item.category.filter((c: any) => c['@_domain'] === 'resources_categories')
      : []
    const category = categoryTerms[0]?.['@_nicename'] ?? ''
    const iconWpId = getMeta(postmeta, '_thumbnail_id')
    const iconId = iconWpId ? mediaMap[iconWpId] : undefined

    const doc: any = {
      title: item.title?.__cdata ?? item.title ?? '',
      slug,
      url: getMeta(postmeta, 'resources_url') || getMeta(postmeta, 'resource_url'),
      category,
      description: getMeta(postmeta, 'description_text') || item['content:encoded']?.__cdata,
    }

    if (iconId) doc.icon = iconId

    await payloadPost('resources', doc)
    console.log(`  Created resource: ${slug}`)
  }
}
```

- [ ] **Step 9: Add run script to cms/package.json**

```json
"scripts": {
  "migrate:wp": "tsx scripts/migrate-from-wp.ts"
}
```

- [ ] **Step 10: Test script against local Payload (dry run — media phase only)**

```bash
cd cms && PHASE=media PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<your-api-key> pnpm migrate:wp
```

Expected: Downloads attachments, uploads to Payload, creates `cms/scripts/media-map.json`.

- [ ] **Step 11: Commit**

```bash
git add cms/scripts/migrate-from-wp.ts cms/package.json
git commit -m "feat(cms): add WordPress XML migration script with phased import"
```

---

## Task 9: Build Astro frontend — CaseStudy layouts and block

**Files:**
- Create: `web/src/layout/collections/CaseStudyLayout.astro`
- Create: `web/src/layout/collections/CaseStudiesCollectionLayout.astro`
- Create: `web/src/components/blocks/CaseStudiesBlock.astro`

- [ ] **Step 1: Read existing layout for pattern**

Read `web/src/layout/collections/PostLayout.astro` (or similar) to understand how layouts consume Payload data in this codebase.

- [ ] **Step 2: Create CaseStudyLayout**

```astro
---
// web/src/layout/collections/CaseStudyLayout.astro
import Layout from '../Layout.astro'
import SEOMetadata from '../SEOMetadata.astro'
import Img from '../../components/Img.astro'
import RichTextBlock from '../../components/blocks/RichTextBlock/RichTextBlock.astro'
import type { CaseStudy } from 'cms/src/payload-types'

interface Props {
  caseStudy: CaseStudy
}

const { caseStudy } = Astro.props
const { title, client, industry, featuredImage, aboutText, challengeText, solutionText, resultsText, meta } = caseStudy
---

<Layout>
  <SEOMetadata
    slot="head"
    title={meta?.metaTitle || title}
    description={meta?.metaDescription}
    noIndex={meta?.noIndex}
  />

  <article class="max-w-4xl mx-auto px-4 py-16">
    <header class="mb-12">
      <span class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 rounded-full mb-4 capitalize">
        {industry?.replace(/-/g, ' ')}
      </span>
      <h1 class="text-4xl font-bold mb-2">{title}</h1>
      <p class="text-gray-600">Client: {client}</p>
    </header>

    {featuredImage && typeof featuredImage !== 'string' && (
      <Img image={featuredImage} class="w-full rounded-xl mb-12" />
    )}

    {aboutText && (
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-4">About the Client</h2>
        <RichTextBlock content={aboutText} />
      </section>
    )}

    {challengeText && (
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-4">The Challenge</h2>
        <RichTextBlock content={challengeText} />
      </section>
    )}

    {solutionText && (
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-4">Our Solution</h2>
        <RichTextBlock content={solutionText} />
      </section>
    )}

    {resultsText && (
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-4">The Results</h2>
        <RichTextBlock content={resultsText} />
      </section>
    )}
  </article>
</Layout>
```

- [ ] **Step 3: Create CaseStudiesCollectionLayout**

```astro
---
// web/src/layout/collections/CaseStudiesCollectionLayout.astro
import Layout from '../Layout.astro'
import SEOMetadata from '../SEOMetadata.astro'
import Img from '../../components/Img.astro'
import type { CaseStudy } from 'cms/src/payload-types'

interface Props {
  caseStudies: CaseStudy[]
}

const { caseStudies } = Astro.props

const industries = [...new Set(caseStudies.map(cs => cs.industry).filter(Boolean))]
---

<Layout>
  <SEOMetadata slot="head" title="Case Studies" description="See how we've helped clients grow online." />

  <section class="max-w-6xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-8">Case Studies</h1>

    <div class="flex gap-2 flex-wrap mb-10" id="industry-filters">
      <button class="filter-btn active px-4 py-2 rounded-full text-sm border" data-filter="all">All</button>
      {industries.map(ind => (
        <button class="filter-btn px-4 py-2 rounded-full text-sm border capitalize" data-filter={ind}>
          {ind?.replace(/-/g, ' ')}
        </button>
      ))}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="case-studies-grid">
      {caseStudies.map(cs => (
        <a
          href={`/case-studies/${cs.slug}`}
          class="group block rounded-xl overflow-hidden border hover:shadow-lg transition"
          data-industry={cs.industry}
        >
          {cs.featuredImage && typeof cs.featuredImage !== 'string' && (
            <Img image={cs.featuredImage} class="w-full aspect-video object-cover" />
          )}
          <div class="p-5">
            <span class="text-xs text-gray-500 uppercase tracking-wide capitalize">{cs.industry?.replace(/-/g, ' ')}</span>
            <h3 class="text-lg font-semibold mt-1 group-hover:text-blue-600 transition">{cs.title}</h3>
            <p class="text-sm text-gray-600 mt-1">{cs.client}</p>
          </div>
        </a>
      ))}
    </div>
  </section>

  <script>
    document.addEventListener('astro:page-load', () => {
      const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn')
      const cards = document.querySelectorAll<HTMLElement>('[data-industry]')

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active', 'bg-black', 'text-white'))
          btn.classList.add('active', 'bg-black', 'text-white')

          const filter = btn.dataset.filter
          cards.forEach(card => {
            card.style.display = filter === 'all' || card.dataset.industry === filter ? '' : 'none'
          })
        })
      })
    })
  </script>
</Layout>
```

- [ ] **Step 4: Create CaseStudiesBlock.astro**

Read `web/src/components/blocks/BlogPostsBlock.astro` for the pattern, then create:

```astro
---
// web/src/components/blocks/CaseStudiesBlock.astro
import Img from '../Img.astro'
import type { CaseStudiesBlock as CaseStudiesBlockType, CaseStudy } from 'cms/src/payload-types'

interface Props {
  block: CaseStudiesBlockType & { caseStudies?: CaseStudy[] }
}

const { block } = Astro.props
const { heading, caseStudies = [] } = block
---

{heading && <h2 class="text-3xl font-bold mb-8">{heading}</h2>}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {caseStudies.map(cs => (
    <a href={`/case-studies/${cs.slug}`} class="group block rounded-xl overflow-hidden border hover:shadow-lg transition">
      {cs.featuredImage && typeof cs.featuredImage !== 'string' && (
        <Img image={cs.featuredImage} class="w-full aspect-video object-cover" />
      )}
      <div class="p-5">
        <span class="text-xs text-gray-500 capitalize">{cs.industry?.replace(/-/g, ' ')}</span>
        <h3 class="text-lg font-semibold mt-1 group-hover:text-blue-600">{cs.title}</h3>
      </div>
    </a>
  ))}
</div>
```

- [ ] **Step 5: Run Astro type check**

```bash
cd web && pnpm check
```

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add web/src/layout/collections/CaseStudyLayout.astro web/src/layout/collections/CaseStudiesCollectionLayout.astro web/src/components/blocks/CaseStudiesBlock.astro
git commit -m "feat(web): add CaseStudy layouts and CaseStudiesBlock component"
```

---

## Task 10: Build Astro ContactFormBlock

**Files:**
- Create: `web/src/components/blocks/ContactFormBlock.astro`

- [ ] **Step 1: Create ContactFormBlock**

```astro
---
// web/src/components/blocks/ContactFormBlock.astro
import type { ContactFormBlock as ContactFormBlockType } from 'cms/src/payload-types'

interface Props {
  block: ContactFormBlockType
}

const { block } = Astro.props
const {
  heading = 'Get in Touch',
  subheading,
  submitLabel = 'Send Message',
  successMessage = "Thanks! We'll be in touch soon.",
} = block
---

<section class="max-w-2xl mx-auto px-4 py-16">
  {heading && <h2 class="text-3xl font-bold mb-2">{heading}</h2>}
  {subheading && <p class="text-gray-600 mb-8">{subheading}</p>}

  <form id="contact-form" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium mb-1">Name *</label>
      <input type="text" id="name" name="name" required class="w-full border rounded-lg px-4 py-2" />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium mb-1">Email *</label>
      <input type="email" id="email" name="email" required class="w-full border rounded-lg px-4 py-2" />
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
      <input type="tel" id="phone" name="phone" class="w-full border rounded-lg px-4 py-2" />
    </div>
    <div>
      <label for="message" class="block text-sm font-medium mb-1">Message *</label>
      <textarea id="message" name="message" rows="5" required class="w-full border rounded-lg px-4 py-2"></textarea>
    </div>
    <div id="form-error" class="text-red-600 text-sm hidden"></div>
    <div id="form-success" class="text-green-600 text-sm hidden">{successMessage}</div>
    <button type="submit" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
      {submitLabel}
    </button>
  </form>
</section>

<script>
  import { getEnvVar } from 'astro:env/client'

  document.addEventListener('astro:page-load', () => {
    const form = document.getElementById('contact-form') as HTMLFormElement | null
    if (!form) return

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const errorEl = document.getElementById('form-error')!
      const successEl = document.getElementById('form-success')!
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement

      errorEl.classList.add('hidden')
      successEl.classList.add('hidden')
      submitBtn.disabled = true
      submitBtn.textContent = 'Sending...'

      const data = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
        message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      }

      try {
        const CMS_URL = import.meta.env.PUBLIC_CMS_URL ?? 'http://localhost:3000'
        const res = await fetch(`${CMS_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (res.ok) {
          form.reset()
          successEl.classList.remove('hidden')
        } else {
          const body = await res.json()
          errorEl.textContent = body.error ?? 'Something went wrong. Please try again.'
          errorEl.classList.remove('hidden')
        }
      } catch {
        errorEl.textContent = 'Network error. Please try again.'
        errorEl.classList.remove('hidden')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = form.dataset.submitLabel ?? 'Send Message'
      }
    })
  })
</script>
```

- [ ] **Step 2: Add PUBLIC_CMS_URL to Astro env schema**

Read `web/astro.config.mjs` and add:

```js
env: {
  schema: {
    // ...existing vars
    PUBLIC_CMS_URL: envField.string({ context: 'client', access: 'public', default: 'http://localhost:3000' }),
  }
}
```

- [ ] **Step 3: Type check**

```bash
cd web && pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add web/src/components/blocks/ContactFormBlock.astro web/astro.config.mjs
git commit -m "feat(web): add ContactFormBlock component"
```

---

## Task 11: Add Vercel redirect rule for WP URLs

**Files:**
- Create or modify: `vercel.json` at repo root (or `web/vercel.json`)

- [ ] **Step 1: Check if vercel.json exists**

```bash
ls /Users/bharatpalwekar/website/savior-in-js/vercel.json /Users/bharatpalwekar/website/savior-in-js/web/vercel.json 2>/dev/null
```

- [ ] **Step 2: Add redirect rule**

In the appropriate `vercel.json`, add a redirect that sends language-prefix-less URLs to `/en/`:

```json
{
  "redirects": [
    {
      "source": "/:path((?!en|de|api|_next|favicon|robots|sitemap).*)",
      "destination": "/en/:path",
      "permanent": true
    }
  ]
}
```

**Note:** The negative lookahead excludes `en`, `de`, `api`, `_next`, `favicon`, `robots`, `sitemap` from being redirected — these must pass through as-is.

- [ ] **Step 3: Commit**

```bash
git add vercel.json  # or web/vercel.json
git commit -m "feat(web): add 301 redirect from WP URL structure to /en/ prefix"
```

---

## Task 12: Run full migration against staging and validate

This is a manual validation task — no code written.

- [ ] **Step 1: Start local Payload dev server**

```bash
cd cms && pnpm dev
```

- [ ] **Step 2: Run media phase**

```bash
PHASE=media PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: `cms/scripts/media-map.json` exists and has entries.

- [ ] **Step 3: Run taxonomy phase**

```bash
PHASE=taxonomies PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: Payload admin shows 5 categories, 8 tags.

- [ ] **Step 4: Run posts phase**

```bash
PHASE=posts PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: Payload admin shows 15 published posts with categories, tags, and SEO meta.

- [ ] **Step 5: Run pages phase**

```bash
PHASE=pages PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: 69 pages created; complex Elementor pages flagged with `needsRebuild: true`.

- [ ] **Step 6: Run case-studies phase**

```bash
PHASE=case-studies PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: Case study documents created with `aboutText`, `challengeText`, `solutionText`, `resultsText` populated.

- [ ] **Step 7: Run resources phase**

```bash
PHASE=resources PAYLOAD_API_URL=http://localhost:3000/api MIGRATION_API_KEY=<key> pnpm migrate:wp
```

Check: Resource documents created with `url` and `category`.

- [ ] **Step 8: Build Astro frontend and verify locally**

```bash
cd web && pnpm build && pnpm preview
```

Navigate to `/en/case-studies` — should render the collection. Navigate to `/en/blog` — posts should appear.

- [ ] **Step 9: Check for 404s**

Check browser DevTools Network tab for any 404s on images, pages, or API calls.

---

## Task 13: Cutover

Manual deployment steps — execute in order on cutover day.

- [ ] **Step 1: Freeze WordPress**

In WordPress admin: Settings → Discussion → disable new comments. Disable all editor/author accounts except one admin account. Enable a maintenance mode plugin or add `wp_die()` to `functions.php` for non-admins.

- [ ] **Step 2: Deploy Payload to Render**

Push `main` branch — Render auto-deploys. Verify `cms.savior.im` is live and admin panel is accessible.

- [ ] **Step 3: Run full migration against production Payload**

```bash
PHASE=all PAYLOAD_API_URL=https://cms.savior.im/api MIGRATION_API_KEY=<prod-key> pnpm migrate:wp
```

- [ ] **Step 4: Trigger Astro build on Vercel**

Either push a commit or manually trigger build in Vercel dashboard.

- [ ] **Step 5: Update DNS**

Point `savior.im` A/CNAME record → Vercel. TTL 300 seconds (5 min) for fast propagation.

- [ ] **Step 6: Verify live site**

- `https://savior.im/en/blog` — blog posts visible
- `https://savior.im/en/case-studies` — case studies visible
- `https://savior.im/blog/` (no lang prefix) — should 301 redirect to `/en/blog`
- Contact form — submit test message, verify email received in Resend dashboard and webhook fired

- [ ] **Step 7: Monitor for 48h**

Check Vercel analytics and Render logs for 404s and errors. Address any broken redirects.

---

## Task 14: Extract design tokens from Figma

**Files:**
- Create: `web/src/styles/tokens.css`

This task must be done **before any layout or block components** — all components reference these tokens via Tailwind CSS custom properties.

- [ ] **Step 1: Open Figma and inspect color values**

Open `https://www.figma.com/design/bZPtQN0hU43f7FgPRICCC2/Savior--Copy-`. Select frames and use the inspect panel to extract:
- Primary brand color (orange/red — `#EF4421` is referenced in ACF color_code field)
- Secondary/dark color (likely near-black used for headings)
- Background colors (white, light gray sections)
- Text colors (body, muted)
- Font families (heading font, body font — check the Text panel)

- [ ] **Step 2: Create tokens.css**

```css
/* web/src/styles/tokens.css */
:root {
  /* Brand colors — update from Figma inspect */
  --color-primary: #EF4421;
  --color-primary-dark: #C73318;
  --color-dark: #111111;
  --color-gray-900: #1A1A1A;
  --color-gray-600: #6B6B6B;
  --color-gray-100: #F5F5F5;
  --color-white: #FFFFFF;

  /* Typography — update font names from Figma */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing scale */
  --section-padding-y: 5rem;
  --container-max: 1280px;
  --container-padding-x: 2rem;
}
```

- [ ] **Step 3: Import tokens in global CSS**

Read `web/src/styles/global.css` (or equivalent) and add:

```css
@import './tokens.css';
```

- [ ] **Step 4: Extend Tailwind config with brand colors**

Read `web/tailwind.config.mjs` (or check `web/astro.config.mjs` for inline Tailwind v4 config) and add brand color aliases so components can use `text-primary`, `bg-primary`, etc.:

```js
// In Tailwind v4 (CSS-first config in global.css):
@theme {
  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-primary-dark);
  --color-brand-dark: var(--color-dark);
}
```

- [ ] **Step 5: Commit**

```bash
git add web/src/styles/tokens.css web/src/styles/global.css
git commit -m "feat(web): add design tokens from Figma"
```

---

## Task 15: Build ServiceLayout (shared for 6 service pages)

**Files:**
- Create: `web/src/layout/ServiceLayout.astro`

All 6 service pages in Figma share the same section structure. Build one reusable layout driven by Payload `Pages` data.

- [ ] **Step 1: Read Figma service page structure**

Open any service page frame in Figma (e.g., `Services_Web Design Development`). Note the section order — typically:
1. Hero (headline, subheadline, CTA button, hero image)
2. Features/benefits grid
3. Process steps
4. Testimonials
5. FAQ accordion
6. Bottom CTA / contact form

- [ ] **Step 2: Read existing Layout.astro and HeroSection.astro for patterns**

Read `web/src/layout/Layout.astro` and `web/src/layout/HeroSection.astro`.

- [ ] **Step 3: Create ServiceLayout**

```astro
---
// web/src/layout/ServiceLayout.astro
import Layout from './Layout.astro'
import SEOMetadata from './SEOMetadata.astro'
import HeroSection from './HeroSection.astro'
import SectionBlock from '../components/SectionBlock.astro'
import TestimonialsBlock from '../components/blocks/TestimonialsBlock.astro'
import ContactFormBlock from '../components/blocks/ContactFormBlock.astro'
import type { Page } from 'cms/src/payload-types'

interface Props {
  page: Page
}

const { page } = Astro.props
const { title, heroSection, layout, meta } = page
---

<Layout>
  <SEOMetadata
    slot="head"
    title={meta?.metaTitle || title}
    description={meta?.metaDescription}
    noIndex={meta?.noIndex}
  />

  {heroSection && <HeroSection hero={heroSection} />}

  {layout?.map((block: any) => (
    <SectionBlock block={block} />
  ))}
</Layout>
```

- [ ] **Step 4: Verify type check**

```bash
cd web && pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add web/src/layout/ServiceLayout.astro
git commit -m "feat(web): add ServiceLayout for service pages"
```

---

## Task 16: Build HomeLayout

**Files:**
- Create: `web/src/layout/HomeLayout.astro`

- [ ] **Step 1: Inspect Home frame in Figma**

Open the `Home` frame. List every distinct section with its purpose and approximate content. Common home page sections for this site:
- Nav/Header (global)
- Hero (headline with HMS formula mention, CTA)
- Services overview (grid or list)
- How it works / Process
- Case studies preview
- Testimonials
- Blog posts preview
- Footer CTA / Contact
- Footer (global)

- [ ] **Step 2: Create HomeLayout**

```astro
---
// web/src/layout/HomeLayout.astro
import Layout from './Layout.astro'
import SEOMetadata from './SEOMetadata.astro'
import HeroSection from './HeroSection.astro'
import SectionBlock from '../components/SectionBlock.astro'
import type { Page } from 'cms/src/payload-types'

interface Props {
  page: Page
}

const { page } = Astro.props
const { title, heroSection, layout, meta } = page
---

<Layout>
  <SEOMetadata
    slot="head"
    title={meta?.metaTitle || title}
    description={meta?.metaDescription}
    noIndex={meta?.noIndex}
  />

  {heroSection && <HeroSection hero={heroSection} />}

  {layout?.map((block: any) => (
    <SectionBlock block={block} />
  ))}
</Layout>
```

- [ ] **Step 3: Wire HomeLayout to the home page route**

Read `web/src/pages/[lang]/[...path].astro`. Find where layout selection happens (likely a `switch` or `if` on `collection` or `slug`). Add a case that uses `HomeLayout` when `page.slug === 'home'` or `page.isHomePage === true`.

- [ ] **Step 4: Commit**

```bash
git add web/src/layout/HomeLayout.astro
git commit -m "feat(web): add HomeLayout for home page"
```

---

## Task 17: Build LocationLayout (shared for 17 location pages)

**Files:**
- Create: `web/src/layout/LocationLayout.astro`

- [ ] **Step 1: Inspect Location frames in Figma**

Open `Main Location` and `Location_Atlanta` frames. They should share the same structure:
1. Hero with city name + local headline
2. Services offered in this area
3. Why choose us (local trust signals)
4. Case studies from the region (optional)
5. Contact CTA

- [ ] **Step 2: Create LocationLayout**

```astro
---
// web/src/layout/LocationLayout.astro
import Layout from './Layout.astro'
import SEOMetadata from './SEOMetadata.astro'
import HeroSection from './HeroSection.astro'
import SectionBlock from '../components/SectionBlock.astro'
import type { Page } from 'cms/src/payload-types'

interface Props {
  page: Page
}

const { page } = Astro.props
const { title, heroSection, layout, meta } = page
---

<Layout>
  <SEOMetadata
    slot="head"
    title={meta?.metaTitle || title}
    description={meta?.metaDescription}
    noIndex={meta?.noIndex}
  />

  {heroSection && <HeroSection hero={heroSection} />}

  {layout?.map((block: any) => (
    <SectionBlock block={block} />
  ))}
</Layout>
```

- [ ] **Step 3: Wire LocationLayout**

In the page routing logic, detect location pages by slug pattern (e.g., ends with `-web-design`) or by a `pageType: 'location'` field. Use `LocationLayout` for those pages.

- [ ] **Step 4: Commit**

```bash
git add web/src/layout/LocationLayout.astro
git commit -m "feat(web): add LocationLayout for city service pages"
```

---

## Task 18: Build NotFoundLayout (404 page)

**Files:**
- Create: `web/src/layout/NotFoundLayout.astro`
- Modify: `web/src/pages/404.astro`

- [ ] **Step 1: Inspect 404 frame in Figma**

Open the `404` frame. Note: headline, subtext, CTA button (typically "Go Home").

- [ ] **Step 2: Create NotFoundLayout**

```astro
---
// web/src/layout/NotFoundLayout.astro
import Layout from './Layout.astro'
import Link from '../components/Link.astro'
---

<Layout>
  <section class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <p class="text-8xl font-bold text-primary mb-4">404</p>
    <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
    <p class="text-gray-600 mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link href="/en/" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
      Go Home
    </Link>
  </section>
</Layout>
```

- [ ] **Step 3: Update 404.astro**

Read `web/src/pages/404.astro`. Replace its content to use `NotFoundLayout`:

```astro
---
import NotFoundLayout from '../layout/NotFoundLayout.astro'
---
<NotFoundLayout />
```

- [ ] **Step 4: Commit**

```bash
git add web/src/layout/NotFoundLayout.astro web/src/pages/404.astro
git commit -m "feat(web): add 404 NotFoundLayout from Figma design"
```

---

## Task 19: Build CareersLayout (static)

**Files:**
- Create: `web/src/layout/CareersLayout.astro`

- [ ] **Step 1: Inspect Careers frame in Figma**

Open `Careers` and `Single Careers Popup` frames. Note: hero, open positions list (static for now), and the popup modal structure (position title, description, apply button/link).

- [ ] **Step 2: Create CareersLayout**

```astro
---
// web/src/layout/CareersLayout.astro
import Layout from './Layout.astro'
import SEOMetadata from './SEOMetadata.astro'

// Static positions — hardcoded for now, no CMS collection
const positions = [
  {
    title: 'Digital Marketing Specialist',
    type: 'Full-time',
    location: 'Remote',
    description: 'We are looking for a digital marketing specialist to help our clients grow their online presence.',
  },
  // Add more positions from Figma as needed
]
---

<Layout>
  <SEOMetadata slot="head" title="Careers at Savior" description="Join our team and help businesses grow online." />

  <section class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-4">Join Our Team</h1>
    <p class="text-gray-600 mb-12">We're always looking for talented people to help us grow.</p>

    <div class="space-y-6" id="positions-list">
      {positions.map((pos, i) => (
        <div class="border rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold">{pos.title}</h3>
            <p class="text-sm text-gray-500 mt-1">{pos.type} · {pos.location}</p>
          </div>
          <button
            class="open-modal px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
            data-index={i}
          >
            View Role
          </button>
        </div>
      ))}
    </div>
  </section>

  <!-- Modal -->
  <div id="career-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 p-8 relative">
      <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
      <h2 id="modal-title" class="text-2xl font-bold mb-2"></h2>
      <p id="modal-type" class="text-sm text-gray-500 mb-6"></p>
      <p id="modal-description" class="text-gray-700 mb-8"></p>
      <a href="mailto:careers@savior.im" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
        Apply Now
      </a>
    </div>
  </div>
</Layout>

<script>
  const positions = JSON.parse(document.getElementById('positions-list')?.dataset.positions ?? '[]')

  document.addEventListener('astro:page-load', () => {
    const modal = document.getElementById('career-modal')!
    const closeBtn = document.getElementById('close-modal')!
    const modalTitle = document.getElementById('modal-title')!
    const modalType = document.getElementById('modal-type')!
    const modalDesc = document.getElementById('modal-description')!

    document.querySelectorAll<HTMLButtonElement>('.open-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index)
        // positions array is available via closure from server-rendered data
        const allPositions = Array.from(document.querySelectorAll('[data-index]')).map((el, i) => ({
          title: el.closest('.border')?.querySelector('h3')?.textContent ?? '',
          type: el.closest('.border')?.querySelector('p')?.textContent ?? '',
        }))
        modalTitle.textContent = allPositions[idx]?.title ?? ''
        modalType.textContent = allPositions[idx]?.type ?? ''
        modal.classList.remove('hidden')
      })
    })

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'))
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden') })
  })
</script>
```

- [ ] **Step 3: Commit**

```bash
git add web/src/layout/CareersLayout.astro
git commit -m "feat(web): add static CareersLayout with job modal"
```

---

## Task 20: Build PortfolioLayout and PortfolioItemLayout

**Files:**
- Create: `web/src/layout/collections/PortfolioLayout.astro`
- Create: `web/src/layout/collections/PortfolioItemLayout.astro`

- [ ] **Step 1: Inspect Figma frames**

Open `Main Portfolio` and `Single Website Portfolio` frames. Note:
- `Main Portfolio`: grid of website thumbnails, possibly filterable by industry/type
- `Single Website Portfolio`: project hero image, description, tech stack, live site link

- [ ] **Step 2: Create PortfolioLayout**

```astro
---
// web/src/layout/collections/PortfolioLayout.astro
import Layout from '../Layout.astro'
import SEOMetadata from '../SEOMetadata.astro'
import Img from '../../components/Img.astro'
// Portfolio items come from CaseStudies collection or a future Projects collection
// For now, accept items as props
interface Props {
  items: Array<{ title: string; slug: string; featuredImage: any; industry?: string }>
}
const { items } = Astro.props
---

<Layout>
  <SEOMetadata slot="head" title="Our Portfolio" description="See our work across industries." />

  <section class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-12">Our Work</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map(item => (
        <a href={`/website-portfolio/${item.slug}`} class="group block rounded-xl overflow-hidden border hover:shadow-xl transition">
          {item.featuredImage && typeof item.featuredImage !== 'string' && (
            <Img image={item.featuredImage} class="w-full aspect-video object-cover" />
          )}
          <div class="p-5">
            <h3 class="font-semibold group-hover:text-primary transition">{item.title}</h3>
            {item.industry && <p class="text-sm text-gray-500 capitalize mt-1">{item.industry.replace(/-/g, ' ')}</p>}
          </div>
        </a>
      ))}
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Create PortfolioItemLayout**

```astro
---
// web/src/layout/collections/PortfolioItemLayout.astro
import Layout from '../Layout.astro'
import SEOMetadata from '../SEOMetadata.astro'
import Img from '../../components/Img.astro'
import RichTextBlock from '../../components/blocks/RichTextBlock/RichTextBlock.astro'
import type { CaseStudy } from 'cms/src/payload-types'

interface Props {
  item: CaseStudy
}
const { item } = Astro.props
---

<Layout>
  <SEOMetadata slot="head" title={item.meta?.metaTitle || item.title} description={item.meta?.metaDescription} />

  <article class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-4">{item.title}</h1>

    {item.featuredImage && typeof item.featuredImage !== 'string' && (
      <Img image={item.featuredImage} class="w-full rounded-2xl mb-12" />
    )}

    {item.aboutText && <RichTextBlock content={item.aboutText} />}
  </article>
</Layout>
```

- [ ] **Step 4: Commit**

```bash
git add web/src/layout/collections/PortfolioLayout.astro web/src/layout/collections/PortfolioItemLayout.astro
git commit -m "feat(web): add Portfolio and PortfolioItem layouts"
```

---

## Task 21: Build EstimateForm React island (multi-step)

**Files:**
- Create: `web/src/components/EstimateForm.tsx`
- Modify: `web/astro.config.mjs` — add `@astrojs/react` integration

This is the most complex frontend task. The Figma has 14 frames:
- Steps 1–4: universal (contact info, project info, budget, timeline)
- Step 5: branches into 8 service-specific variants (Web Design, Custom Web App, Landing Page, Maintenance, Hosting, SEO, PPC, Digital Marketing) — each with 1–3 sub-steps
- Step 6: confirmation / thank you

- [ ] **Step 1: Add React integration to Astro**

```bash
cd web && pnpm astro add react
```

Expected: `@astrojs/react` added to `astro.config.mjs`, React dependencies installed.

- [ ] **Step 2: Inspect Figma estimate form frames**

Open `Multi-Step Estimate Form 1` through `Multi-Step Estimate Form 6`, and all `5_1` through `5_8` variants. For each step note: fields shown, input types, button labels, progress indicator style.

- [ ] **Step 3: Create EstimateForm.tsx**

```tsx
// web/src/components/EstimateForm.tsx
import { useState } from 'react'

type ServiceType =
  | 'web-design'
  | 'custom-web-app'
  | 'landing-page'
  | 'maintenance'
  | 'hosting'
  | 'seo'
  | 'ppc'
  | 'digital-marketing'

interface FormData {
  // Step 1 — Contact
  name: string
  email: string
  phone: string
  company: string
  // Step 2 — Project
  serviceType: ServiceType | ''
  projectDescription: string
  // Step 3 — Budget
  budget: string
  // Step 4 — Timeline
  timeline: string
  // Step 5 — Service-specific (varies by serviceType)
  serviceDetails: Record<string, string>
}

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'web-design', label: 'Web Design & Development' },
  { value: 'custom-web-app', label: 'Custom Web App Development' },
  { value: 'landing-page', label: 'Conversion-Focused Landing Page' },
  { value: 'maintenance', label: 'Website Maintenance & Support' },
  { value: 'hosting', label: 'Fast Web Hosting & Security' },
  { value: 'seo', label: 'Search Engine Optimization' },
  { value: 'ppc', label: 'Google Ads PPC Management' },
  { value: 'digital-marketing', label: 'Digital Marketing Campaigns' },
]

const BUDGET_OPTIONS = ['Under $1,000', '$1,000–$5,000', '$5,000–$10,000', '$10,000–$25,000', '$25,000+']
const TIMELINE_OPTIONS = ['ASAP', '1–3 months', '3–6 months', '6–12 months', 'Flexible']

// Service-specific step 5 fields — update from Figma inspection
const SERVICE_STEP5_FIELDS: Record<ServiceType, Array<{ name: string; label: string; type: string; options?: string[] }>> = {
  'web-design': [
    { name: 'pageCount', label: 'How many pages?', type: 'select', options: ['1–5', '6–10', '11–20', '20+'] },
    { name: 'hasExistingBranding', label: 'Do you have existing branding?', type: 'select', options: ['Yes', 'No', 'Partial'] },
    { name: 'competitors', label: 'List 2–3 competitor websites', type: 'textarea' },
  ],
  'custom-web-app': [
    { name: 'appType', label: 'What type of app?', type: 'text' },
    { name: 'userCount', label: 'Expected users', type: 'select', options: ['<100', '100–1,000', '1,000–10,000', '10,000+'] },
    { name: 'integrations', label: 'Required integrations (APIs, tools)', type: 'textarea' },
  ],
  'landing-page': [
    { name: 'goal', label: 'Primary conversion goal', type: 'select', options: ['Lead generation', 'Product sale', 'Event signup', 'App download'] },
    { name: 'traffic', label: 'Expected monthly traffic', type: 'select', options: ['<1,000', '1,000–10,000', '10,000+'] },
    { name: 'hasOffer', label: 'Do you have a lead magnet or offer?', type: 'select', options: ['Yes', 'No', 'Need help creating one'] },
  ],
  'maintenance': [
    { name: 'platform', label: 'Current platform', type: 'select', options: ['WordPress', 'Webflow', 'Shopify', 'Custom', 'Other'] },
    { name: 'issueType', label: 'Main issue or need', type: 'textarea' },
  ],
  'hosting': [
    { name: 'currentHost', label: 'Current hosting provider', type: 'text' },
    { name: 'trafficVolume', label: 'Monthly traffic', type: 'select', options: ['<5,000', '5,000–50,000', '50,000+'] },
  ],
  'seo': [
    { name: 'currentRankings', label: 'Are you currently ranking for any keywords?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
    { name: 'targetKeywords', label: 'Target keywords or topics', type: 'textarea' },
    { name: 'localSEO', label: 'Do you need local SEO?', type: 'select', options: ['Yes', 'No'] },
  ],
  'ppc': [
    { name: 'monthlyAdBudget', label: 'Monthly ad spend budget', type: 'select', options: ['<$500', '$500–$2,000', '$2,000–$10,000', '$10,000+'] },
    { name: 'currentlyRunning', label: 'Currently running ads?', type: 'select', options: ['Yes', 'No'] },
    { name: 'targetAudience', label: 'Describe your target audience', type: 'textarea' },
  ],
  'digital-marketing': [
    { name: 'channels', label: 'Which channels?', type: 'select', options: ['Social Media', 'Email', 'Content/Blog', 'All of the above'] },
    { name: 'currentFollowing', label: 'Existing audience size', type: 'select', options: ['Just starting', '<1,000', '1,000–10,000', '10,000+'] },
  ],
}

export default function EstimateForm({ cmsUrl }: { cmsUrl: string }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', company: '',
    serviceType: '', projectDescription: '',
    budget: '', timeline: '',
    serviceDetails: {},
  })

  const totalSteps = formData.serviceType ? 6 : 5
  const progress = Math.round((step / totalSteps) * 100)

  const update = (field: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const updateServiceDetail = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, serviceDetails: { ...prev.serviceDetails, [field]: value } }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${cmsUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `
Company: ${formData.company}
Service: ${formData.serviceType}
Project: ${formData.projectDescription}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Service Details: ${JSON.stringify(formData.serviceDetails, null, 2)}
          `.trim(),
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const body = await res.json()
        setError(body.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">We received your request!</h2>
        <p className="text-gray-600">Our team will reach out within 1 business day.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step 1 — Contact info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Let's start with your contact info</h2>
          {[
            { name: 'name', label: 'Full Name *', type: 'text', required: true },
            { name: 'email', label: 'Email *', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: false },
            { name: 'company', label: 'Company Name', type: 'text', required: false },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                value={(formData as any)[field.name]}
                onChange={e => update(field.name as keyof FormData, e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Step 2 — Service selection */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">What service are you looking for?</h2>
          <div className="grid grid-cols-1 gap-3">
            {SERVICE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update('serviceType', opt.value)}
                className={`text-left px-5 py-4 border rounded-xl transition ${
                  formData.serviceType === opt.value
                    ? 'border-primary bg-primary/5 font-medium'
                    : 'hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Briefly describe your project</label>
            <textarea
              value={formData.projectDescription}
              onChange={e => update('projectDescription', e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Step 3 — Budget */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">What's your budget range?</h2>
          <div className="grid grid-cols-1 gap-3">
            {BUDGET_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => update('budget', opt)}
                className={`text-left px-5 py-4 border rounded-xl transition ${
                  formData.budget === opt ? 'border-primary bg-primary/5 font-medium' : 'hover:border-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Timeline */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">What's your ideal timeline?</h2>
          <div className="grid grid-cols-1 gap-3">
            {TIMELINE_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => update('timeline', opt)}
                className={`text-left px-5 py-4 border rounded-xl transition ${
                  formData.timeline === opt ? 'border-primary bg-primary/5 font-medium' : 'hover:border-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — Service-specific questions */}
      {step === 5 && formData.serviceType && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold mb-6">
            A few more questions about your {SERVICE_OPTIONS.find(s => s.value === formData.serviceType)?.label}
          </h2>
          {SERVICE_STEP5_FIELDS[formData.serviceType as ServiceType]?.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={formData.serviceDetails[field.name] ?? ''}
                  onChange={e => updateServiceDetail(field.name, e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData.serviceDetails[field.name] ?? ''}
                  onChange={e => updateServiceDetail(field.name, e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <input
                  type="text"
                  value={formData.serviceDetails[field.name] ?? ''}
                  onChange={e => updateServiceDetail(field.name, e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 6 — Review & Submit */}
      {step === 6 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Review your request</h2>
          <dl className="space-y-3 text-sm mb-8">
            {[
              ['Name', formData.name],
              ['Email', formData.email],
              ['Phone', formData.phone],
              ['Company', formData.company],
              ['Service', SERVICE_OPTIONS.find(s => s.value === formData.serviceType)?.label],
              ['Budget', formData.budget],
              ['Timeline', formData.timeline],
            ].map(([label, value]) => value ? (
              <div key={label as string} className="flex gap-4">
                <dt className="w-24 text-gray-500 shrink-0">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ) : null)}
          </dl>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
        )}
        <div className="ml-auto">
          {step < totalSteps ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && (!formData.name || !formData.email)) ||
                (step === 2 && !formData.serviceType) ||
                (step === 3 && !formData.budget) ||
                (step === 4 && !formData.timeline)
              }
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the Astro page for the estimate form**

Create `web/src/pages/[lang]/get-estimate.astro`:

```astro
---
import Layout from '../../layout/Layout.astro'
import SEOMetadata from '../../layout/SEOMetadata.astro'
import EstimateForm from '../../components/EstimateForm'
import { CMS_URL } from 'astro:env/server'
---

<Layout>
  <SEOMetadata slot="head" title="Get a Free Estimate" description="Tell us about your project and we'll get back to you within 1 business day." />
  <EstimateForm client:load cmsUrl={CMS_URL} />
</Layout>
```

- [ ] **Step 5: Add CMS_URL to Astro env schema**

In `web/astro.config.mjs`, add to `env.schema`:

```js
CMS_URL: envField.string({ context: 'server', access: 'secret' }),
```

Add to Vercel env vars: `CMS_URL=https://cms.savior.im`

- [ ] **Step 6: Type check**

```bash
cd web && pnpm check
```

- [ ] **Step 7: Commit**

```bash
git add web/src/components/EstimateForm.tsx web/src/pages/[lang]/get-estimate.astro web/astro.config.mjs
git commit -m "feat(web): add multi-step estimate form React island"
```

---

## Task 22: Build Web Analyzer landing page variants

**Files:**
- Create: `web/src/pages/[lang]/web-analyzer.astro`
- Create: `web/src/pages/[lang]/web-analyzer-home-improvement.astro`
- Create: `web/src/pages/[lang]/web-analyzer-roofing.astro`

- [ ] **Step 1: Inspect Figma web analyzer frames**

Open `Web Analyzer Landing Page v3`, `v3_ Home Improvement`, `v3_ Roofing Contractors`. Note the differences between variants (typically: hero headline, target industry copy, background image). The embedded analyzer widget is the same across all three.

- [ ] **Step 2: Create a shared WebAnalyzerLayout**

Create `web/src/layout/WebAnalyzerLayout.astro`:

```astro
---
// web/src/layout/WebAnalyzerLayout.astro
import Layout from './Layout.astro'
import SEOMetadata from './SEOMetadata.astro'

interface Props {
  headline: string
  subheadline: string
  metaTitle: string
  metaDescription: string
  analyzerEmbedUrl?: string
}

const { headline, subheadline, metaTitle, metaDescription, analyzerEmbedUrl } = Astro.props
---

<Layout>
  <SEOMetadata slot="head" title={metaTitle} description={metaDescription} />

  <section class="bg-dark text-white py-20 px-4 text-center">
    <h1 class="text-4xl font-bold mb-4">{headline}</h1>
    <p class="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{subheadline}</p>

    <!-- Embed analyzer widget — replace src with actual tool URL -->
    {analyzerEmbedUrl ? (
      <iframe
        src={analyzerEmbedUrl}
        class="w-full max-w-3xl mx-auto h-96 rounded-xl border-0"
        loading="lazy"
      />
    ) : (
      <div class="w-full max-w-3xl mx-auto h-96 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
        Analyzer widget embed — add URL to analyzerEmbedUrl prop
      </div>
    )}
  </section>
</Layout>
```

- [ ] **Step 3: Create the three page files**

```astro
---
// web/src/pages/[lang]/web-analyzer.astro
import WebAnalyzerLayout from '../../layout/WebAnalyzerLayout.astro'
---
<WebAnalyzerLayout
  headline="Get Your Free Website Analysis"
  subheadline="Find out what's holding your website back from ranking #1 on Google."
  metaTitle="Free Website Analyzer | Savior"
  metaDescription="Get a free website analysis and discover how to improve your online presence."
/>
```

```astro
---
// web/src/pages/[lang]/web-analyzer-home-improvement.astro
import WebAnalyzerLayout from '../../layout/WebAnalyzerLayout.astro'
---
<WebAnalyzerLayout
  headline="Free Website Analysis for Home Improvement Companies"
  subheadline="See exactly why your competitors rank higher and what you need to fix."
  metaTitle="Free Website Analyzer for Home Improvement | Savior"
  metaDescription="Home improvement businesses: get a free website analysis and start generating more leads online."
/>
```

```astro
---
// web/src/pages/[lang]/web-analyzer-roofing.astro
import WebAnalyzerLayout from '../../layout/WebAnalyzerLayout.astro'
---
<WebAnalyzerLayout
  headline="Free Website Analysis for Roofing Contractors"
  subheadline="Discover why your roofing website isn't generating enough leads — and how to fix it."
  metaTitle="Free Website Analyzer for Roofers | Savior"
  metaDescription="Roofing contractors: get a free website analysis and see how to get more jobs from your website."
/>
```

- [ ] **Step 4: Commit**

```bash
git add web/src/layout/WebAnalyzerLayout.astro web/src/pages/[lang]/web-analyzer*.astro
git commit -m "feat(web): add Web Analyzer landing page variants"
```
