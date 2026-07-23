# Fix: Carousel Sliding Bug (Testimonials + Portfolio + Case Study)

## Problem
Multiple carousel blocks on the same page cannot slide because they all use the same generic `data-carousel-root` selector via `document.querySelector()`. The first carousel's script initializes on the first matched element, and subsequent carousels never get initialized.

## Root Cause
- `TestimonialsBlock.astro:131` — `document.querySelector('[data-carousel-root]')`
- `PortfolioCarouselBlock.astro:166` — `document.querySelector('[data-carousel-root]')`
- `CaseStudyCarouselBlock.astro:144` — `document.querySelector('[data-carousel-root]')`

All three use the same global selector. When 2+ are on the same page, only the first one found in DOM order gets initialized.

Each block already generates a unique `carouselId` but the JS doesn't use it for scoping.

## Fix

### Task 1 — Fix `TestimonialsBlock.astro`
- Change `<section ... data-carousel-root>` to `<section ... id={carouselId}>`
- In the `<script is:inline>` block:
  - Replace `document.querySelector('[data-carousel-root]')` with `document.getElementById('${carouselId}')`
  - Replace `carousel.querySelector(...)` calls — they will now correctly scope to the testimonials section
  - Remove the `carousel.dataset.initialized` check (no longer needed since we target by unique ID), OR keep it but scope it properly

### Task 2 — Fix `PortfolioCarouselBlock.astro`
- Same pattern: replace `data-carousel-root` attribute with `id={carouselId}` on the section
- Update the inline script to use `document.getElementById('${carouselId}')` instead of `document.querySelector('[data-carousel-root]')`

### Task 3 — Fix `CaseStudyCarouselBlock.astro`
- Same pattern as above

### Task 4 — Verify
- Run `pnpm --filter web run check` to validate TypeScript
- Confirm each carousel's HTML uses a unique `id` and the JS scopes to that `id`

## Files Changed
1. `web/src/components/blocks/TestimonialsBlock.astro`
2. `web/src/components/blocks/PortfolioCarouselBlock.astro`
3. `web/src/components/blocks/CaseStudyCarouselBlock.astro`
