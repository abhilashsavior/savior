# Home Page Sections Plan

Figma: `bZPtQN0hU43f7FgPRICCC2` / node `1:2` (Home)

Each section is numbered **Home-1** through **Home-13** in top-to-bottom order as they appear on the page.

---

## Section Inventory

| # | Name | Figma Node | Status | Block Label |
|---|------|-----------|--------|-------------|
| Home-1 | Hero Section | `4809:55` | BUILT | `heroSection` field (global) |
| Home-2 | Brands/Client Logos | `4809:65` | BUILT | `Home-2: Brands` |
| Home-3 | About / Get to Know | `4809:73` | BUILT | `Home-3: About` |
| Home-4 | Transparency & Features | `72:196` | BUILT | `Home-4: Transparency` |
| Home-5 | Advantages of Hero | `4809:107` | BUILT | `Home-5: Advantages of Hero` |
| Home-6 | Web Design Services | `39:970` | BUILT | `Home-6: Web Design Services` |
| Home-7 | Why Choose Savior | `39:1055` | BUILT | `Home-7: Why Choose` |
| Home-8 | Testimonials | `4809:270` | BUILT | `Home-8: Testimonials` |
| Home-9 | Dynamic WordPress CTA | `4809:282` | BUILT | `Home-9: Dynamic WordPress` |
| Home-10 | Portfolio / Work Carousel | `4809:325` | BUILT | `Home-10: Portfolio` |
| Home-11 | Agency Hero Brands | `4809:349` | BUILT | `Home-11: Agency Hero Brands` |
| Home-12 | Final CTA | `4809:362` | BUILT | `Home-12: CTA` |
| Home-13 | Footer | `4809:399` | BUILT | Global footer layout |

**All 13 sections: BUILT ✅**

---

## Sections To Build (in order)

### Home-3: About / Get to Know Section
- **Figma**: `4809:73` (y=1561, h=910)
- **Content**: "Get to Know Savior Marketing" heading, long description paragraph, "Get Free Quote" CTA + phone CTA
- **Layout**: Image on left (large, ~942x927), text + CTAs on right (~531px wide)
- **Block name**: `AboutBlock`
- **CMS fields**: `image`, `heading`, `description` (rich text), `primaryCta`, `phoneCta`

### Home-4: Transparency & Features Section
- **Figma**: `72:196` (y=2037, h=1517)
- **Content**: 4 feature rows, each with:
  1. "TRANSPARENCY & ACCESSIBILITY" + description + arrow icon
  2. "FLEXIBLE AND ADAPTABLE TEAM" + description + "Let's Get Started" CTA + phone CTA
  3. "DATA-DRIVEN SOLUTIONS FOR MAXIMUM ROI" + description + arrow icon
  4. "HIGH-LEVEL CONSULTATION" + description + arrow icon
- **Layout**: White/light background, rows separated by horizontal lines, arrow icons on right, decorative GIF image
- **Block name**: `TransparencyBlock`
- **CMS fields**: `features` (array of: `title`, `description`, `showCta`, `ctaButton`, `phoneCta`), `decorativeImage`

### Home-6: Web Design Services Section
- **Figma**: `39:970` (y=4474, h=1346)
- **Content**: "Web Design Services Are Our Specialty" heading, subtitle, 6 service cards in 2 rows x 3 columns:
  1. Unique & Creative Web Design
  2. Ecommerce Web Development
  3. Website Support & Ongoing Maintenance
  4. Bespoke Web Applications
  5. Website Redesign
  6. Top-Level Consultancy
- **Each card**: Icon, title, description, "Let's Get Started" arrow link
- **Block name**: `ServicesBlock`
- **CMS fields**: `heading`, `subtitle`, `services` (array of: `icon`, `title`, `description`, `ctaLink`, `ctaLabel`)

### Home-7: Why Choose Savior Section
- **Figma**: `39:1055` (y=5974, h=1596)
- **Content**: "Why Choose Savior Web Design?" heading, 6 accordion/expandable items:
  1. Dependable Web Maintenance (expanded by default with CTA)
  2. Custom Web Design
  3. Conversion-Focused Websites
  4. Trusted & Experienced Team
  5. Online Business Partnership
  6. Dependable Web Maintenance
- **Each item**: Number (01-06), title, description, expand/collapse toggle, first item has CTA
- **Block name**: `WhyChooseBlock`
- **CMS fields**: `heading`, `items` (array of: `number`, `title`, `description`, `isExpanded`, `ctaButton`, `phoneCta`)

### Home-8: Testimonials Section
- **Figma**: `4809:270` (y=7706, h=358)
- **Content**: "Hear What Our Clients Have to Say About Savior Marketing" heading, testimonial quote with star rating, author name, carousel dots, prev/next arrows, quote icon, "Get Free CONSULT" + phone CTA
- **Layout**: Heading + CTA on left (~561px), testimonial card on right (~553px)
- **Block name**: `TestimonialsBlock`
- **CMS fields**: `heading`, `testimonials` (array of: `quote`, `author`, `role`, `rating`), `ctaButton`, `phoneCta`

### Home-9: Dynamic WordPress CTA Section
- **Figma**: `4809:282` (y=8200, h=788)
- **Content**: "Dynamic WordPress Websites For Your Business" heading, description paragraph, "Get Free CONSULT" + phone CTA
- **Layout**: Dark background image, centered text content
- **Block name**: `DynamicWordPressBlock`
- **CMS fields**: `backgroundImage`, `heading`, `boldHeading`, `description`, `ctaButton`, `phoneCta`

### Home-10: Portfolio / Work Carousel Section
- **Figma**: `4809:325` (y=9150, h=898)
- **Content**: "High-Level Expert Web Design" heading, description, "Get Free CONSULT" + phone CTA, carousel of project cards (5 cards with screenshots, one card has title overlay "med bill payments"), carousel dots, prev/next arrows, "View All Work" link
- **Layout**: Heading + CTA on top left, description on top right, full-width carousel below
- **Block name**: `PortfolioCarouselBlock`
- **CMS fields**: `heading`, `description`, `ctaButton`, `phoneCta`, `projects` (array of: `image`, `title`, `description`, `link`), `viewAllLink`

---

## Blocks Order in CMS (matches Figma top-to-bottom)

1. `Home-2: Brands` → `BrandsBlock`
2. `Home-3: About` → `AboutBlock`
3. `Home-4: Transparency` → `TransparencyBlock`
4. `Home-5: Advantages of Hero` → `AdvantagesOfHeroBlock`
5. `Home-6: Web Design Services` → `ServicesBlock`
6. `Home-7: Why Choose` → `WhyChooseBlock`
7. `Home-8: Testimonials` → `TestimonialsBlock`
8. `Home-9: Dynamic WordPress` → `DynamicWordPressBlock`
9. `Home-10: Portfolio` → `PortfolioCarouselBlock`
10. `Home-11: Agency Hero Brands` → `AgencyHeroBrandsBlock`
11. `Home-12: CTA` → `CtaBlock`

## Utility Blocks (non-Home, reusable)

12. `RichTextBlock`
13. `BlogPostsBlock`
14. `AuthorsBlock`
15. `CaseStudyCarouselBlock`
16. `LoginBlock`

## For Each Block - Standard Steps

1. Create CMS block schema in `cms/src/blocks/`
2. Register block in `cms/src/collections/Pages.ts` → `sections.blocks` array
3. Run `pnpm --filter cms payload generate:types`
4. Create Astro component in `web/src/components/blocks/`
5. Add case in `web/src/components/SectionBlock.astro` switch statement
6. Run `pnpm --filter web run check` to validate
