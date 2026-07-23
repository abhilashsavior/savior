# Services - Web Design Development Page

## Overview

Build the "Services - Web Design Development" page from Figma (`node-id=64:2`). The page has 13 content sections. 9 map to existing blocks, 4 require new blocks.

The page uses the standard layout (`hidePageShell: false`) — the existing `heroSection` field on Pages handles the hero.

---

## Section-to-Block Mapping (top to bottom)

| # | Figma Section | Y-Pos | Block | Status |
|---|---|---|---|---|
| 1 | Hero | 0 | `heroSection` field (Pages) | **Existing** |
| 2 | "Online Business Solutions Featured In" | 829 | `BrandsBlock` | **Existing** |
| 3 | "You Are Probably Here Because" (4 numbered items) | 1172 | `PainPointsBlock` | **NEW** |
| 4 | About (image + heading + description) | 2134 | `AboutBlock` | **Existing** |
| 5 | "Consider Us Your Dedicated Team" (role list + banner) | 3011 | `DedicatedTeamBlock` | **NEW** |
| 6 | "This is Why Business Owners Love Working with Us" (6 pain points grid) | 4223 | `TransparencyBlock` | **Existing** |
| 7 | Testimonials (3-card grid) | 4938 | `TestimonialsBlock` | **Existing** |
| 8 | "Secrets We've Honed Over 10+ Years" (3 secrets + CTA) | 5729 | `FoundationalSecretsBlock` | **NEW** |
| 9 | "Our Online Business Website Growth Formulas" (6 accordion items) | 6580 | `WhyChooseBlock` | **Existing** |
| 10 | "Hear What Our Clients Have to Say" (carousel) | 8326 | `TestimonialsBlock` | **Existing** |
| 11 | "5 Reasons Why Our Solutions Scaled Businesses" (5 check items) | 8839 | `ReasonsBlock` | **NEW** |
| 12 | "Over 300+ Websites Completed" (portfolio carousel) | 10380 | `PortfolioCarouselBlock` | **Existing** |
| 13 | "Ready for your new online business website?" (CTA) | 11432 | `CtaBlock` | **Existing** |

---

## New Blocks to Create

### 1. PainPointsBlock
**Figma:** "You Are Probably Here Because" — dark background, 4 numbered items with horizontal lines

**CMS Schema** (`cms/src/blocks/PainPointsBlock.ts`):
```
slug: 'pain-points'
fields:
  - heading: text (required, localized)
  - backgroundImage: upload → media
  - items: array (minRows: 1)
    - number: text (required)
    - title: text (required, localized)
```

**Astro Component** (`web/src/components/blocks/PainPointsBlock.astro`):
- Dark background image
- Centered heading (Montserrat 55px)
- 4-column grid of numbered items with horizontal line separators
- Mobile: stack vertically

---

### 2. DedicatedTeamBlock
**Figma:** "Consider Us Your New Dedicated, Done-For-You, Online Business Growth Team" — heading + description on left, list of roles to fire on right, bottom CTA banner

**CMS Schema** (`cms/src/blocks/DedicatedTeamBlock.ts`):
```
slug: 'dedicated-team'
fields:
  - heading: text (required, localized) — mixed bold/regular
  - boldHeading: text (localized) — the bold portion of heading
  - description: textarea (required, localized)
  - rolesTitle: text (localized) — "So you can immediately fire your:"
  - roles: array (minRows: 1)
    - title: text (required, localized)
  - bannerHeading: text (required, localized) — "It's Time to Focus on Your Business Growth"
  - bannerDescription: textarea (localized)
```

**Astro Component** (`web/src/components/blocks/DedicatedTeamBlock.astro`):
- Dark background
- Two-column layout: left = heading + description, right = roles list with strikethrough icons
- Bottom: full-width orange banner with heading + description
- Mobile: stack columns

---

### 3. FoundationalSecretsBlock
**Figma:** "Secrets We've Honed Over 10+ Years in The Web Industry" — 3 items with large background numbers (01, 02, 03) + CTA

**CMS Schema** (`cms/src/blocks/FoundationalSecretsBlock.ts`):
```
slug: 'foundational-secrets'
fields:
  - heading: text (required, localized)
  - items: array (minRows: 1)
    - number: text (required) — "01", "02", "03"
    - title: text (required, localized) — "Foundational Secret #1:"
    - description: textarea (required, localized)
  - ctaButton: group
    - label: text (required, localized)
    - link: relationship → pages
    - externalUrl: text
  - phoneCta: group
    - label: text (required, localized)
    - phone: text (required)
```

**Astro Component** (`web/src/components/blocks/FoundationalSecretsBlock.astro`):
- Light/cream background
- Heading at top
- 2-column grid of items (first row: 2 items, second row: 1 item + CTA)
- Each item: large faded number behind, title, description
- CTA: "Request A Proposal" button + phone CTA

---

### 4. ReasonsBlock
**Figma:** "5 Reasons Why Our Online Business Solutions have Scaled Countless Businesses!" — dark background, 5 items with check icons and horizontal line separators

**CMS Schema** (`cms/src/blocks/ReasonsBlock.ts`):
```
slug: 'reasons'
fields:
  - heading: text (required, localized)
  - boldHeading: text (localized) — bold portion of heading
  - backgroundImage: upload → media
  - items: array (minRows: 1)
    - title: text (required, localized)
    - description: textarea (required, localized)
  - ctaButton: group
    - label: text (required, localized)
    - link: relationship → pages
    - externalUrl: text
  - phoneCta: group
    - label: text (required, localized)
    - phone: text (required)
```

**Astro Component** (`web/src/components/blocks/ReasonsBlock.astro`):
- Dark background image
- Centered heading
- List of items, each with: check icon (60px), title, description, horizontal line separator
- 3rd item includes CTA button + phone CTA inline
- Mobile: stack

---

## Implementation Steps

### Step 1: Create CMS Block Schemas
Create 4 new schema files in `cms/src/blocks/`:
- `PainPointsBlock.ts`
- `DedicatedTeamBlock.ts`
- `FoundationalSecretsBlock.ts`
- `ReasonsBlock.ts`

### Step 2: Register Blocks in Pages Collection
Add the 4 new blocks to the `blocks` array in `cms/src/collections/Pages.ts` (line 97).

### Step 3: Regenerate Payload Types
```bash
pnpm --filter cms payload generate:types
```

### Step 4: Create Astro Components
Create 4 new Astro components in `web/src/components/blocks/`:
- `PainPointsBlock.astro`
- `DedicatedTeamBlock.astro`
- `FoundationalSecretsBlock.astro`
- `ReasonsBlock.astro`

Follow existing patterns:
- Import types from `cms/src/payload-types`
- Use `font-heading`, `font-body` classes
- Use existing color tokens (`#ef4924`, `bg-white`, `text-slate-900`, etc.)
- Mobile-first responsive design
- Use `Img` component for images, `Link` component for links

### Step 5: Register in SectionBlock.astro
Add imports and switch cases for the 4 new blocks in `web/src/components/SectionBlock.astro`.

### Step 6: Type Check
```bash
pnpm --filter web run check
```

---

## Token Reference (from Figma)

**Colors:**
- Primary orange: `#ef4924`
- White: `#ffffff`
- Slate 900: `#0f172a`
- Body text gray: `#606060`
- Dark bg sections: dark background images

**Typography:**
- Headings: Montserrat (Regular 400, Medium 500, SemiBold 600, Bold 700)
- Body: Open Sans (Regular 400, SemiBold 600, Bold 700)
- Hero heading: 56px/68px Montserrat
- Section headings: 55px/67px Montserrat
- Body text: 18px/30px Open Sans
- Small text: 14px/19px Open Sans

**Spacing:**
- Section padding: 136-196px vertical
- Content max-width: ~1170-1795px
- Grid gaps: 29-46px

---

## Open Questions

1. **Hero section**: The Figma hero includes a full nav bar. Should the page use `hidePageShell: true` (hero block includes nav) or `hidePageShell: false` (standard layout with hero section field)?
   - **Recommendation**: Use `hidePageShell: false` — the existing `heroSection` field + standard layout handles this. The nav in Figma is just showing context.

2. **TestimonialsBlock reuse**: Sections 7 and 10 both use `TestimonialsBlock` but with different layouts (3-card grid vs single carousel). The existing block already handles the single carousel variant. Does it need a layout variant field for the 3-card grid?
   - **Recommendation**: The existing `TestimonialsBlock` renders a carousel. Section 7 (3-card grid) may need a `layout` field (`'carousel' | 'grid'`) or could be a separate block.
