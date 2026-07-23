# WordPress → Payload CMS + Astro Migration Design Spec

**Date:** 2026-03-31  
**Site:** savior.im  
**WordPress version:** 6.9.4  
**Approach:** Big Bang Migration — freeze WP, migrate everything, cut over DNS in one shot

---

## 1. Source Audit Summary

Extracted from `savior.WordPress.2026-03-31.xml`:

### Content Volume

| Type | Count |
|---|---|
| Published pages | 69 |
| Published blog posts | 15 |
| Media attachments | 724 |
| Authors | 4 |
| Blog categories | 5 |
| Blog tags | 8 |
| Case study industry terms | 7 |
| Resource categories | 5 |

### Post Types to Migrate

- `post` → `Posts` collection (existing)
- `page` → `Pages` collection (existing) — includes service pages, location pages, legal pages, lead-gen pages
- Case Studies → new `CaseStudies` collection (built with ACF fields on `page` post type)
- Resources → new `Resources` collection (built as pages with ACF fields)

### Post Types to Drop (not migrate)

- `elementor_library` (79 templates) — rebuild as Astro components
- `popup` / `popup_theme` — replace with native Astro modals if needed
- `acf-field` / `acf-field-group` — schema only, no content to migrate
- `labs` — confirmed out of scope
- Draft pages (26 items, including `-old` variants) — archive in WP only

### Taxonomies

**Migrate:**
- `category` (5 terms) → `Categories` collection
- `post_tag` (8 terms) → `Tags` collection
- `case_study_category` (7 terms) → `industry` select field on `CaseStudies`
- `resources_categories` (5 terms) → `category` select field on `Resources`

**Drop:**
- `elementor_library_type` — internal Elementor metadata
- `labs_categories` — placeholder terms (Lab Category 1/2/3), Labs is out of scope
- `portfolio_category` — only 1 term (Healthcare), no actual portfolio CPT items found
- `nav_menu` — rebuild navigation in Payload `Header`/`Footer` globals

### Authors

| WP Login | Display Name | Email | Payload Role |
|---|---|---|---|
| Bharat | Bharat | bharat@savior.im | `admin` |
| monet@savior.im | Monet St Juste | monet@savior.im | `editor` |
| mishael@savior.im | Mishaél Fabien | mishael@savior.im | `editor` |
| MarketingHM | Marketing Team | harsh@savior.im | `editor` |

### ACF Field Groups (mapped to Payload)

| ACF Group | Mapped to | Key fields |
|---|---|---|
| Case studies information | `CaseStudies` collection | `aboutText`, `challengeText`, `solutionText`, `resultsText`, `featuredImage`, `client`, `industry` |
| Testimonial | `TestimonialsBlock` | `name`, `image`, `comment`, `rating` |
| Blog advanced information | `Posts` fields | `metaTitle`, `metaDescription`, `focusKeyword` |
| Resources | `Resources` collection | `title`, `url`, `category`, `description`, `icon` |
| Career Information | Out of scope (no career pages in migration) | — |

### SEO Plugin

Yoast SEO — keys to migrate per post/page:
- `_yoast_wpseo_title` → `metaTitle`
- `_yoast_wpseo_metadesc` → `metaDescription`
- `_yoast_wpseo_focuskw` → `focusKeyword`
- `_yoast_wpseo_meta-robots-noindex` → `noIndex` (already exists on `Pages`)

Drop: `_yoast_wpseo_content_score`, `_yoast_wpseo_linkdex`, `_yoast_wpseo_wordproof_timestamp` — internal Yoast scores, no value post-migration.

---

## 2. Content Model

### New Collections

#### `CaseStudies`

```
title          text (required)
slug           text (required, unique)
client         text (required)
industry       select (required)
               options: app, cannabis-cbd, corporate, e-commerce,
                        health-care, manufacturing, real-estate, roofing
featuredImage  upload → Media (required)
aboutText      richText
challengeText  richText
solutionText   richText
resultsText    richText
publishedDate  date
meta
  metaTitle    text
  metaDescription text
  focusKeyword text
  noIndex      checkbox
```

#### `Categories`

```
name   text (required)
slug   text (required, unique)
```

#### `Tags`

```
name   text (required)
slug   text (required, unique)
```

#### `Resources`

```
title       text (required)
slug        text (required, unique)
url         text (required) — external link
category    select
            options: ecommerce-platforms, email-marketing-apps,
                     online-marketing-apps, stock-assets, website-apps
description richText
icon        upload → Media
```

### Existing Collections — Field Additions

#### `Posts` — add fields:

```
categories    relationship → Categories (hasMany)
tags          relationship → Tags (hasMany)
readingTime   number (minutes)
meta
  metaTitle       text
  metaDescription text
  focusKeyword    text
```

#### `Pages` — add fields:

```
meta
  metaTitle       text
  metaDescription text
  focusKeyword    text
```
(`noIndex` already exists per recent commit)

### New Blocks

| Block | Purpose | Astro component |
|---|---|---|
| `CaseStudiesBlock` | Filterable case study grid by industry | `CaseStudiesBlock.astro` |
| `ResourcesBlock` | Filterable resource list by category | `ResourcesBlock.astro` |
| `TestimonialsBlock` | Client testimonials (name, image, rating, comment) | `TestimonialsBlock.astro` |
| `ContactFormBlock` | Contact form → Resend email + Zapier webhook | `ContactFormBlock.astro` |
| `LocationBlock` | City-specific service page template (reused for 17 locations) | `LocationBlock.astro` |

### Submissions (Contact Form)

**Day-zero cutover** — historical WP form submissions stay in WordPress as archive. New submissions after cutover are handled entirely by `ContactFormBlock`:

- Client-side form POST to a Payload custom endpoint `/api/contact`
- Endpoint sends email via **Resend**
- Endpoint fires a webhook to **Zapier** or **Make** for CRM forwarding
- No `Submissions` collection in Payload

---

## 3. Data Migration Strategy

### Approach

Single Node.js migration script at `cms/scripts/migrate-from-wp.ts`. Parses `savior.WordPress.2026-03-31.xml` using `fast-xml-parser`. Runs in phases — each phase is **idempotent** (safe to re-run, checks for existing slugs before inserting).

Authenticates against Payload REST API using an API key (`Authorization: api-keys API-Key <key>`).

### Migration Phases

| Phase | Script task | Notes |
|---|---|---|
| 1. Media | Download 724 attachment originals from `savior.im/wp-content/uploads/`, upload to Payload `/api/media`, save `wpId → payloadId` map to `cms/scripts/media-map.json` | Run first; all later phases depend on this map |
| 2. Categories | POST to `/api/categories` for each WP `wp:category` | 5 items |
| 3. Tags | POST to `/api/tags` for each WP `wp:tag` | 8 items |
| 4. Authors | POST to `/api/users` for the 4 WP authors | Set role per table in Section 1 |
| 5. Posts | POST to `/api/posts`; resolve category/tag relationships; map `_thumbnail_id` via media map; extract Yoast SEO fields from postmeta | 15 published posts |
| 6. Pages | POST to `/api/pages`; extract plain text from `_elementor_data` JSON for richText content; flag Elementor-heavy pages for manual rebuild | 69 published pages |
| 7. Case Studies | POST to `/api/case-studies`; extract ACF postmeta fields (`about_text`, `challenge_text`, `solution_text`, `results_text`); map featured image | Pages tagged as case studies |
| 8. Resources | POST to `/api/resources`; extract ACF fields (`resources_url`, `description`) | Resource pages |
| 9. Redirects | POST to `/api/redirects` for any slug changes detected | Handles URL preservation |

### Elementor Content Handling

69 pages have layout stored as `_elementor_data` JSON. Strategy:
- Extract all text nodes from Elementor JSON recursively
- Concatenate into a single `richText` body as a fallback
- Flag page in Payload with a `needsRebuild: true` custom field
- ~20–25 complex service/location pages require manual block reconstruction post-migration
- ~44 simple pages (Privacy Policy, Terms, legal, etc.) will migrate cleanly as richText

### Media Map Persistence

Save `cms/scripts/media-map.json` after Phase 1 completes. All subsequent phases read this file. Allows re-running later phases without re-downloading/re-uploading media.

---

## 4. Frontend Rebuild (Astro)

All pages are rebuilt pixel-perfect from the Figma file: `https://www.figma.com/design/bZPtQN0hU43f7FgPRICCC2/Savior--Copy-`  
All frames are 1920px wide desktop-first. Mobile/tablet responsiveness is derived from the desktop designs.  
No shared component library or design tokens exist in Figma — all styles are embedded per frame.

### Figma Frame → Astro Page Mapping

#### Core Pages (8)
| Figma Frame | Astro Route | Layout/Component |
|---|---|---|
| Home | `/en/` | `HomeLayout.astro` |
| About Us | `/en/about-us` | `PageLayout.astro` |
| Blog | `/en/blog` | `CollectionLayout.astro` (existing) |
| Blog_Single page | `/en/blog/[slug]` | `PostLayout.astro` (existing) |
| Contact us | `/en/contact` | `PageLayout.astro` + `ContactFormBlock` |
| FAQ | `/en/faq` | `PageLayout.astro` |
| Sitemap | `/en/sitemap` | `PageLayout.astro` |
| 404 | `404.astro` | `NotFoundLayout.astro` |

#### Service Pages (6)
| Figma Frame | Astro Route | Layout |
|---|---|---|
| Services_Web Design Development | `/en/web-design-development` | `ServiceLayout.astro` |
| Services_Hero SEO | `/en/seo` | `ServiceLayout.astro` |
| Services_Digital Marketing | `/en/digital-marketing` | `ServiceLayout.astro` |
| Services_Landing page development | `/en/landing-page-development` | `ServiceLayout.astro` |
| Services_PPC Management | `/en/ppc` | `ServiceLayout.astro` |
| Services_Support and Maintenance | `/en/support-and-maintenance` | `ServiceLayout.astro` |

All service pages share the same `ServiceLayout.astro` — the Figma frames follow a consistent structure (hero, features, process, testimonials, CTA).

#### Portfolio / Work Pages (4)
| Figma Frame | Astro Route | Layout |
|---|---|---|
| Main Portfolio | `/en/website-portfolio` | `PortfolioLayout.astro` |
| Our Work | `/en/case-studies` | `CaseStudiesCollectionLayout.astro` |
| Our Work_Single page | `/en/case-studies/[slug]` | `CaseStudyLayout.astro` |
| Single Website Portfolio | `/en/website-portfolio/[slug]` | `PortfolioItemLayout.astro` |

#### Location Pages (2 designs → 17 pages)
| Figma Frame | Astro Route | Layout |
|---|---|---|
| Main Location (template) | `/en/[city]-web-design` | `LocationLayout.astro` |
| Location_Atlanta (example) | `/en/atlanta-web-design` | `LocationLayout.astro` |

One `LocationLayout.astro` handles all 17 city pages. City-specific content (name, hero image, local copy) comes from the `Pages` collection `LocationBlock`.

#### Lead Generation / Tool Pages (4)
| Figma Frame | Astro Route | Notes |
|---|---|---|
| Web Analyzer Landing Page v3 | `/en/web-analyzer` | Static page with embedded third-party analyzer tool |
| Web Analyzer v3 - Home Improvement | `/en/web-analyzer-home-improvement` | Variant landing page |
| Web Analyzer v3 - Roofing Contractors | `/en/web-analyzer-roofing` | Variant landing page |
| Calendar booking page | `/en/calendar-booking` | Embeds booking widget (Calendly or similar) |

#### Multi-Step Estimate Form (14 frames → 1 interactive flow)
| Figma Frames | Astro Route | Notes |
|---|---|---|
| Multi-Step Estimate Form 1–6 + service variants (5_1–5_8) | `/en/get-estimate` | Client-side multi-step form. Steps 1–4 are universal; Step 5 branches by service type (8 variants, 1–3 sub-steps each); Step 6 is confirmation. Built as a single Astro page with an island (`EstimateForm.tsx` React component for interactivity). Submits to `/api/contact` Payload endpoint. |

#### Careers (static, 2 frames)
| Figma Frame | Astro Route | Notes |
|---|---|---|
| Careers | `/en/careers` | Static page — no live job listings, no CMS collection needed |
| Single Careers Popup | Modal triggered from Careers page | Client-side modal, hardcoded content |

#### Auth Pages (4)
| Figma Frame | Astro Route | Notes |
|---|---|---|
| Log In | `/en/login` | Redirects to Payload admin or client portal |
| Sign Up | `/en/signup` | TBD — may redirect to Payload admin |
| Forgot Password | `/en/forgot-password` | Payload handles password reset |
| Client Login | `/en/client-portal-login` | Redirects to external client portal |

#### Resources (1)
| Figma Frame | Astro Route | Layout |
|---|---|---|
| Resources | `/en/resources` | `ResourcesLayout.astro` |

#### Legal / Info (existing Pages collection)
- `/en/privacy-policy`
- `/en/terms-of-use`
- `/en/fulfillment-policy`
- `/en/proposal-terms-and-conditions`

### Skipped Figma Frames (out of scope)
- Free SEO Analyzer (5 frames) — skip
- Onboarding Flow (4 frames) — skip for now
- Checkout / Payment pages — skip
- Facebook Ads templates (32 frames) — not web pages
- Report PDF pages (7 frames) — not web pages
- India Location page — skip
- VSL Page, GMBA/HMS squeeze pages — marketing-only, skip

### New layout components

| File | Purpose |
|---|---|
| `web/src/layout/HomeLayout.astro` | Home page — unique hero, sections, CTAs |
| `web/src/layout/NotFoundLayout.astro` | 404 page |
| `web/src/layout/ServiceLayout.astro` | Shared layout for all 6 service pages |
| `web/src/layout/LocationLayout.astro` | Shared layout for all 17 location pages |
| `web/src/layout/collections/CaseStudyLayout.astro` | Single case study |
| `web/src/layout/collections/CaseStudiesCollectionLayout.astro` | Case studies index with industry filter |
| `web/src/layout/collections/PortfolioLayout.astro` | Website portfolio index |
| `web/src/layout/collections/PortfolioItemLayout.astro` | Single portfolio item |
| `web/src/layout/collections/ResourcesLayout.astro` | Resources index with category tabs |

### New block components

| File | Purpose |
|---|---|
| `web/src/components/blocks/CaseStudiesBlock.astro` | Filterable case study grid |
| `web/src/components/blocks/ResourcesBlock.astro` | Resource cards with external links |
| `web/src/components/blocks/TestimonialsBlock.astro` | Testimonial grid/carousel |
| `web/src/components/blocks/ContactFormBlock.astro` | Contact form → `/api/contact` |
| `web/src/components/blocks/LocationBlock.astro` | City-specific content section |

### New interactive components (React islands)

| File | Purpose |
|---|---|
| `web/src/components/EstimateForm.tsx` | Multi-step estimate form with service branching (14 Figma frames → 1 interactive island). Steps 1–4 universal, Step 5 branches to 8 service variants. Submits to `/api/contact`. |

### Dynamic routing

Existing `web/src/pages/[lang]/[...path].astro` handles all pages. New collections (CaseStudies, Resources) require:
- New entries in Payload `static-paths` endpoint
- New entries in `page-props` endpoint
- Corresponding layout components rendered by collection type

### Contact form endpoint

New Payload custom endpoint at `cms/src/endpoints/contact.ts`:
- Accepts POST with form fields (shared by ContactFormBlock and EstimateForm)
- Validates input (name, email, message required)
- Sends email via Resend SDK
- Fires webhook POST to Zapier/Make URL (stored as env var)
- Returns `{ success: true }` or error

---

## 5. Media Migration

- **Source:** 724 files at `https://savior.im/wp-content/uploads/YYYY/MM/filename.ext`
- **Destination:** Hetzner S3 (already configured in `cms/src/payload.config.ts`)
- **Process:** Download original file (not WP-generated thumbnails) → upload to Payload `/api/media` → Payload generates its own sizes and stores to S3
- **After cutover:** Add Vercel rewrite rule for `/wp-content/uploads/:path*` → old WP server URL during transition period (WP stays live read-only)
- **Image re-optimization:** Payload does not use WP Smush data — images should be run through a compression step before upload, or use Cloudflare Image Resizing / Vercel Image Optimization at the CDN layer

---

## 6. SEO & Redirects

### URL structure change

WP URLs are language-prefix-free. Astro site uses `/en/` or `/de/` prefix.

**Global redirect rule** in `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/:path((?!en|de).*)",
      "destination": "/en/:path",
      "permanent": true
    }
  ]
}
```

This preserves all existing Google-indexed URLs as permanent 301s.

### Per-URL redirects

Any slug that changes during migration gets a `Redirects` document in Payload (already built). The `web/src/cms/getRedirects.ts` system consumes these at build time.

### Sitemap

Existing Payload `sitemap` endpoint needs `CaseStudies` and `Resources` added to its collection query.

### Meta tags

`SEOMetadata.astro` already exists. Feed it `metaTitle`, `metaDescription` from each collection's `meta` group. Falls back to `title` if `metaTitle` is empty.

---

## 7. Authentication & Roles

4 WordPress users → 4 Payload users. Existing role system (`admin`, `editor`, `developer`) covers all needed roles. No new access policies required.

Form submissions use the existing API key auth pattern. The `/api/contact` endpoint is public (no auth required — it's a contact form).

---

## 8. Deployment

| Service | Purpose | Notes |
|---|---|---|
| **Render** | Payload CMS (Next.js) | Auto-deploy from `main`; set `NODE_ENV=production` |
| **MongoDB Atlas** | Database | M0 free tier sufficient (media on S3, not Mongo) |
| **Hetzner S3** | Media storage | Already configured |
| **Vercel** | Astro frontend | Already configured with ISR + SSR preview |
| **Resend** | Transactional email | Contact form notifications |
| **Zapier / Make** | CRM webhook forwarding | Contact form third-party integration |

### Environment variables (Render)

```
MONGODB_URI=
PAYLOAD_SECRET=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=
S3_REGION=
RESEND_API_KEY=
CONTACT_WEBHOOK_URL=   # Zapier or Make webhook
```

### Cutover sequence

1. Freeze WordPress (set all editor roles to read-only or enable maintenance mode)
2. Run migration script against **staging** Payload instance → validate all content
3. Deploy Payload to Render (`cms.savior.im`)
4. Run migration script against **production** Payload
5. Trigger Astro build on Vercel → static site built from Payload data
6. Point `savior.im` DNS → Vercel
7. Enable global redirect rule in `vercel.json` (WP URL → `/en/` prefix)
8. Monitor 404s and crawl errors for 48h
9. WordPress set to full read-only / archived

---

## 9. Risks & Gotchas

| Risk | Severity | Mitigation |
|---|---|---|
| Elementor page content is in opaque JSON blobs | High | Accept that ~20–25 pages need manual rebuild; script extracts text as fallback; flag with `needsRebuild` field |
| 724 media files — slow download/upload | Medium | Run media phase in staging first; persist `media-map.json`; re-run is safe |
| WP still live during build — content drift | Medium | Freeze WP to read-only 48h before cutover |
| All WP URLs lack `/en/` prefix | High | Global Vercel redirect rule `/:path → /en/:path` (permanent 301) — implement before DNS cutover |
| MongoDB Atlas M0 has 512MB storage limit | Low | Media lives on Hetzner S3; Mongo only stores document data — M0 is fine |
| Yoast internal scores (`content_score`, `linkdex`) have no equivalent | Low | Drop them — no action needed |
| `lab-category-1/2/3` are placeholder terms | Low | Labs is out of scope — nothing to migrate |
| Resend / Zapier credentials not set before launch | Medium | Add to Render env vars in staging; test contact form end-to-end before DNS cutover |
| `case_study_category` industry terms must match Payload select options exactly | Medium | Define select options in `CaseStudies` collection before running migration script Phase 7 |
| Figma has no design tokens — colors/fonts are embedded per frame | Medium | Extract a manual design token file (`web/src/styles/tokens.css`) from the Figma frames before building components; establish Tailwind config values upfront |
| Service pages are very tall (10,000–14,000px) — many sections per page | High | `ServiceLayout.astro` must be composed of reusable section blocks; don't hardcode each service page separately |
| Multi-step estimate form has 14 Figma frames of branching logic | High | Build as a single React island (`EstimateForm.tsx`) with a state machine; map each Figma frame to a step/state |
| No mobile designs in Figma — desktop-only at 1920px | Medium | Derive responsive breakpoints from desktop designs using standard mobile-first Tailwind breakpoints |
