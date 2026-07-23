---
name: figma-to-code
description: Use this skill whenever the task involves converting a Figma design (frame, screen, component, design system) into code for this project. Triggers include "convert this Figma", "implement the design", "build the homepage from the mockup", "match the Figma", "design to code", any Figma URL or screenshot, and any request mentioning pixel accuracy or responsive breakpoints. Use this BEFORE writing any markup so the design tokens are extracted first. Skip for tasks that don't involve visual design (pure logic, API work, infra).
---

# Figma → Code — Pixel-accurate, mobile-first, structure-aware

The goal is **100% visual fidelity** to Figma at every breakpoint, with all editable content wired to Payload (never hardcoded). To hit that bar consistently you cannot eyeball — you must extract tokens, identify components, and follow a strict order of operations.

## 📁 Workspace Directory & Key Files Map

| Component/Purpose | File/Folder Path | Purpose |
|-------------------|------------------|---------|
| **Design Tokens & Theme** | [web/src/styles.css](/web/src/styles.css) | Global Tailwind v4 `@theme` configuration using CSS variables. Add all custom color definitions here. |
| **CMS Block Schemas** | [cms/src/blocks/](/cms/src/blocks/) | Directory where all block schemas (e.g. `WorkWithUsBlock.ts`, `WhyChooseUsBlock.ts`) are defined. |
| **CMS Collection Mapping** | [cms/src/collections/Pages.ts](/cms/src/collections/Pages.ts) | List of registered schemas. Register new blocks in the `sections.blocks` array. |
| **Frontend Astro Blocks** | [web/src/components/blocks/](/web/src/components/blocks/) | Astro frontend template blocks (e.g. `WorkWithUsBlock.astro`) representing section logic. |
| **Block Routing Switch** | [web/src/components/SectionBlock.astro](/web/src/components/SectionBlock.astro) | Dynamic router that selects and renders components based on CMS block types. |
| **Workspace TypeScript Types**| `cms/src/payload-types.ts` | Shared TypeScript types derived from Payload schemas. |

---

## Prerequisites — verify before starting

1. **Figma Dev Mode MCP is connected.** Run a quick MCP probe to confirm. If unavailable, ask the user to enable it: Figma Desktop → Preferences → "Enable Dev Mode MCP Server", then `claude mcp add figma -t http http://127.0.0.1:3845/mcp`.
2. **You have the Figma URL or file ID,** not just screenshots. Screenshots are last-resort only — token extraction needs the actual file.
3. **You know which breakpoints exist in the design.** Standard for this project: 375 (mobile), 768 (tablet), 1280 (desktop), 1440+ (wide). If Figma has different ones, follow Figma.

## Step 1 — Token extraction (always first)

Before any markup, harvest the design system into a single source of truth. Inspect the Figma file's published styles + variables and extract:

- **Colors** — every named color and every hex used. Group by role: brand, neutral, semantic (success/warn/error/info), surface, text.
- **Typography** — for each text style: font-family, font-weight, size, line-height, letter-spacing, and the breakpoints at which they change.
- **Spacing scale** — every spacing value used (4, 8, 12, 16, 24, 32, 48, 64 etc.). Reject any unique value that doesn't fit the scale — it's almost always a Figma mistake; flag it to the user.
- **Radii** — corner radius values.
- **Shadows** — elevation system.
- **Breakpoints** — confirmed from the design.

Output them as CSS variables inside the Tailwind v4 `@theme` extension block in [styles.css](/web/src/styles.css):

```css
/* web/src/styles.css — Theme extension example */
@theme {
  --color-black: #000000;
  --color-lavender: #edf0ff;
  --color-orange: #f69220;
  --color-green: #127332; /* Newly added brand green token */
}
```

If the Figma has CSS variables published, mirror their names exactly. Consistent naming between Figma and code is what makes future updates frictionless.

## Step 2 — Component audit

List every distinct UI piece in the design, grouped by reuse pattern:

- **Atoms** — buttons, inputs, badges, icons. Build these once in `web/src/components/ui/`.
- **Molecules** — cards, list items, form rows. Build in `web/src/components/`.
- **Section blocks** — hero, feature grid, CTA banner, testimonial carousel. These map 1:1 to Payload blocks. Build in `web/src/components/blocks/` AND `cms/src/blocks/`. See `dynamic-content-blocks` skill.
- **Layouts** — page chrome, headers, footers. Build in `web/src/layouts/`.

Write this audit down before coding. The audit determines what's a Payload block vs a static component.

## Step 3 — Identify dynamic content

For each section in the design, ask: "Will a content editor want to change this without a deploy?" If yes → Payload block. If no → static. See `dynamic-content-blocks` skill for the classification rules and the starter block library.

Flag anything that's listed in Figma as a "variant" of a section — those almost always need to be Payload blocks with variant fields.

## Step 4 — Build mobile-first, one breakpoint at a time

Open the 375px frame in Figma. Build the component to match exactly. Test in the browser at 375px wide. Only when mobile is pixel-accurate do you move to tablet, then desktop.

Concretely:

```astro
---
// Build the markup with mobile-default classes.
// Add larger breakpoints as enhancements with Tailwind prefixes.
---
<section class="px-4 py-12 md:px-8 md:py-16 lg:px-16 lg:py-24">
  <h1 class="text-display-2 md:text-display-1 leading-tight">
    {heading}
  </h1>
</section>
```

Never write `md:` overrides without first verifying the mobile version is correct.

## Step 5 — Pixel-accuracy validation loop

For each section, do this loop until satisfied:

1. Take a screenshot of the rendered component at the target viewport.
2. Place it side-by-side with the Figma frame.
3. Measure: spacing, font size, line height, color, alignment.
4. Fix discrepancies.
5. Repeat.

If Playwright MCP is available, automate step 1:

```bash
# Example via Playwright MCP
playwright_screenshot --url http://localhost:4321/preview --viewport 375x800
```

For visual regression on subsequent changes, commit the screenshot as a baseline (see `testing` skill).

## Step 6 — Wire content from Payload

The component should accept all dynamic content via props, with sensible defaults that match the Figma copy. The Astro page does the fetch and passes data in.

```astro
---
// web/src/components/blocks/Hero.astro
interface Props {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { url: string; alt: string };
}
const { eyebrow, heading, subheading, primaryCta, secondaryCta, image } = Astro.props;
---
```

Use `set:html` or `<RichTextLexical />` for any Payload rich text field — that's the convention.

## ⚙️ Order of Operations Checklist (Execution)

1. **Tokens Configuration**: Check [styles.css](/web/src/styles.css) and configure any missing theme colors or font classes.
2. **Schema Creation**: Author block schemas under [cms/src/blocks/](/cms/src/blocks/).
3. **Schema Registration**: Register the block inside `sections.blocks` within [Pages.ts](/cms/src/collections/Pages.ts).
4. **Regenerate Types**: Run Payload's type generator so typescript maps the new props:
   ```bash
   pnpm --filter cms payload generate:types
   ```
5. **Component Scaffolding**: Create the corresponding Astro front-end block template in [web/src/components/blocks/](/web/src/components/blocks/).
6. **Block Routing**: Map the new block case in [SectionBlock.astro](/web/src/components/SectionBlock.astro) to import and switch on it.
7. **Type-Checking & Validation**: Validate workspace file structure and compile correctness:
   ```bash
   pnpm --filter web run check
   ```

## Common failure modes — refuse these

- **"Close enough" spacing.** A 14px gap where Figma says 16px is wrong. Fix it.
- **Inline hex values.** `style="color: #1a1a1a"` instead of a token. Never do this.
- **Desktop-first.** Building 1440 first, then crushing it for mobile. Always reverse the order.
- **Hardcoded copy.** Hero headline pasted into the component file. The copy belongs in Payload — even if the project starts with one entry, the field has to exist.
- **One mega-component.** A 600-line Hero.astro doing the work of five components. Split.
- **Skipping the token extraction.** "I'll use Tailwind defaults" leaks gray-500 into a design that uses a specific neutral-500. Extract first.