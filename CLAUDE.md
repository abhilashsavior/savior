# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Repository Overview

This is a mono-repository consisting of:

- **CMS** (`/cms`): Payload CMS v3 with Next.js 15 for content management
- **Frontend** (`/web`): Astro 5-based static site, styled with Tailwind CSS v4

## Essential Commands

### CMS Development (`/cms`)

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm generate:types   # Generate Payload CMS TypeScript types (payload-types.ts)
pnpm generate:importmap  # Generate import map for Payload admin
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm devsafe          # Clean .next and start dev
```

### Frontend Development (`/web`)

```bash
pnpm dev              # Start Astro dev server
pnpm build            # Build static site
pnpm check            # TypeScript check
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm preview          # Preview production build locally
```

### Monorepo Notes

- Both projects use `pnpm` workspaces.
- Run `pnpm i` in both `cms/` and `web/` after cloning or changing dependencies.
- The web project depends on the CMS via `workspace:*` (imports `cms` types directly).

## Architecture Overview

### CMS Architecture

Payload v3 with Next.js 15. Key directories:

| Directory | Purpose |
|---|---|
| `/cms/src/collections/` | Content types: Pages, Posts, Authors, Media, ApiKeys, Redirects, Users |
| `/cms/src/blocks/` | Reusable blocks: AuthorsBlock, BlogPostsBlock, CodeBlock, RichTextBlock |
| `/cms/src/globals/` | Site-wide settings: Header, Footer, Labels |
| `/cms/src/endpoints/` | Custom API endpoints: globalData, pageProps, sitemap, static-paths |
| `/cms/src/fields/` | Reusable fields (e.g., `heroSection`) |
| `/cms/src/shared/access/` | Access control policies: isAdmin, isEditor, isDeveloper, isSelf, etc. |
| `/cms/src/shared/CollectionGroups.ts` | Grouped collection categories for CMS admin UI |

Key architectural patterns:

- **Localization**: Two locales — `de` (default) and `en`. All translatable content uses this config.
- **Collection groups**: Collections are organized into groups (Content, Media, Pages, System) for CMS admin navigation.
- **Rich Text**: Lexical editor with custom features. Relationship feature is disabled globally and `LinkFeature` is enabled with specific page collections.
- **Database**: MongoDB adapter with Vercel connection pooling (`attachDatabasePool`).
- **Storage**: Hetzner S3 Object Storage for media files.
- **Authentication**: API Key collection for token-based auth. Website and AI agents authenticate via `Authorization` header (`api-keys API-Key <key>`).
- **Endpoints**: Custom endpoints expose data for astro (static-paths, page-props, global-data, sitemap).
- **Seed script**: Located at `/cms/src/seed.ts`. Uncomment `onInit` in `payload.config.ts` to run.

### Frontend Architecture

Astro 5 with Vercel adapter (ISR + SSR for preview). Key directories:

| Directory | Purpose |
|---|---|
| `/web/src/cms/` | CMS integration: SDK, caching, locales, data fetching |
| `/web/src/cms/sdk.ts` | Payload SDK instance with API key auth and opt-in caching |
| `/web/src/layout/collections/` | Layout components per collection type (PageLayout, PostLayout, AuthorLayout, CollectionLayout) |
| `/web/src/components/blocks/` | Block components mirroring CMS blocks |
| `/web/src/schema/` | JSON-LD structured data schemas (schema-dts) |
| `/web/src/pages/[lang]/[...path].astro` | Dynamic route for localized pages |
| `/web/src/pages/preview/[lang]/[...path].astro` | SSR preview route |
| `/web/src/globalState.ts` | Global layout state (locale, header, footer, labels) |
| `/web/src/config.ts` | `websiteConfig` — site metadata, domains, assets |

Key architectural patterns:

- **Static site generation** with SSR only for `/preview` pages.
- **SDK caching**: Opt-in layer at `web/src/cms/sdk/cachedFetch.ts` — set `X-Use-Cache: 'true'` header to enable. Caching is safe since data is baked into static builds.
- **Global state**: Use `initGlobalState(Astro)` from `globalState.ts` — it deduplicates calls per request.
- **Localization**: Path-based locale detection (`/de/...` or `/en/...`) with fallback to `Accept-Language` header.
- **Redirects**: Generated at build via `web/src/cms/getRedirects.ts` and used in `astro.config.mjs`.
- **View Transitions**: `<ClientRouter />` enabled. Wrap client-side scripts in `astro:page-load` event.
- **Tailwind CSS v4** with Vite plugin, using `tw-animate-css` for animations.

## Rules & Conventions

### Payload Types

- If CMS schema was modified, run `pnpm generate:types` in `cms/` to update TypeScript types.
- Frontend imports types from `cms/src/payload-types.ts` via the workspace dependency.

### Astro Environment Variables

Always use Astro's type-safe environment variables instead of `import.meta.env`:

1. Define env vars in `astro.config.mjs` under `env.schema`
2. Import from `astro:env/client` or `astro:env/server`
3. Never use `import.meta.env.VARIABLE_NAME` directly

### Structured Data Schemas

JSON-LD schemas in `/web/src/schema/`:

1. One file per entity (e.g., `article.ts`, `author.ts`)
2. Export function as `{entity}Schema`
3. Return `WithContext<SchemaType>` from `schema-dts`
4. URL construction: always `new URL(path, SITE_URL)`
5. Render with `<Schema item={schema} />` in layout files

### TypeScript

Strict mode enabled across the monorepo. Always reuse existing types.
