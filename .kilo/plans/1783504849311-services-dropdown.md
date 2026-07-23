# Services Dropdown Implementation Plan

## Overview
Add a dropdown menu that appears when hovering over "Services" in the header. The dropdown has two blocks:
- **Left Block**: Service links in 2 columns (first item highlighted in orange)
- **Right Block**: Background image with orange overlay + testimonial

## Design Specifications (from Figma)

### Layout
- Full-width white background (1920px × 305px)
- Dropdown appears 88px from top (below header)
- Left block: 330px from left edge, 511px wide
- Right block: 1030px from left edge, 890px wide

### Left Block (Services)
- 2 columns of service links
- Font: Open Sans, 14px, semibold
- First item color: `#ef4924` (orange)
- Other items: black
- Horizontal line separator (202px wide) under first item
- Arrow icon (rotated 42°) next to items

### Right Block (Testimonial)
- Background image with orange overlay (`rgba(239,73,36,0.77)`)
- Testimonial text: white, Open Sans 14px
- Author name: white, semibold
- Author title: white, regular
- Quote icon (70×70px)
- Person's photo: 25×42px in rounded border (50px radius)

---

## Implementation Tasks

### 1. CMS Schema Changes (`cms/src/globals/Header.ts`)

Extend the `links` array to support optional dropdowns:

```typescript
{
  type: 'array',
  name: 'links',
  maxRows: 10,
  fields: [
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'label',
      type: 'text',
      localized: true,
      required: true,
      admin: { width: '50%' },
    },
    // NEW: Optional dropdown configuration
    {
      name: 'dropdown',
      type: 'group',
      admin: {
        description: 'Configure dropdown menu for this link (optional)',
      },
      fields: [
        {
          name: 'services',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'link',
              type: 'relationship',
              relationTo: 'pages',
            },
            {
              name: 'highlighted',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Show in orange color (first item style)',
              },
            },
          ],
        },
        {
          name: 'testimonial',
          type: 'group',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              localized: true,
              required: true,
            },
            {
              name: 'authorName',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'authorTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'authorImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Background image for the right side of dropdown',
          },
        },
      ],
    },
  ],
}
```

### 2. Regenerate Types

Run: `pnpm --filter cms payload generate:types`

### 3. Create Dropdown Component (`web/src/components/ServicesDropdown.astro`)

Create a new Astro component for the dropdown:

**Props interface:**
```typescript
interface Props {
  services: Array<{
    title: string
    link?: string
    highlighted?: boolean
  }>
  testimonial?: {
    quote: string
    authorName: string
    authorTitle?: string
    authorImage?: Media
  }
  backgroundImage?: Media
}
```

**Structure:**
- Full-width container with white background
- Left section: Service links in 2-column grid
- Right section: Image with overlay + testimonial
- Use Tailwind classes matching the design

**Key styles:**
- Container: `absolute top-full left-0 w-full bg-white shadow-lg`
- Left block: `grid grid-cols-2 gap-x-8`
- Service link: `font-body text-sm font-semibold`
- Highlighted link: `text-[#ef4924]`
- Normal link: `text-black hover:text-[#ef4924]`
- Right block: `relative overflow-hidden`
- Overlay: `bg-[rgba(239,73,36,0.77)]`
- Testimonial text: `text-white text-sm`

### 4. Update Header Component (`web/src/layout/Header.astro`)

Modify the desktop navigation to show dropdown on hover:

```astro
{header.links?.map((link) => (
  <li class="relative group">
    <Link 
      path={(link.page as Page)?.path} 
      class="..."
    >
      {link.label}
    </Link>
    
    {/* Dropdown - only if dropdown data exists */}
    {link.dropdown && (
      <div class="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <ServicesDropdown
          services={link.dropdown.services?.map(s => ({
            title: s.title,
            link: (s.link as Page)?.path,
            highlighted: s.highlighted,
          })) || []}
          testimonial={link.dropdown.testimonial ? {
            quote: link.dropdown.testimonial.quote,
            authorName: link.dropdown.testimonial.authorName,
            authorTitle: link.dropdown.testimonial.authorTitle,
            authorImage: link.dropdown.testimonial.authorImage as Media,
          } : undefined}
          backgroundImage={link.dropdown.backgroundImage as Media}
        />
      </div>
    )}
    
    {/* Active/hover underline */}
    <span class="absolute -bottom-1 left-0 w-0 h-px bg-primary rounded-full transition-all group-hover:w-full" />
  </li>
))}
```

### 5. Add Hover Delay

To prevent dropdown from closing when moving mouse, add a small delay using CSS or JavaScript:

```css
/* In Header.astro <style> block */
.group:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.dropdown-menu {
  transition: opacity 0.2s, visibility 0.2s;
}
```

### 6. Mobile Considerations

The dropdown should only appear on desktop (lg: breakpoint). Mobile menu already has its own structure.

### 7. Accessibility

- Add `aria-expanded` attribute to links with dropdowns
- Ensure keyboard navigation works (Tab to focus, Enter/Space to open)
- Add proper ARIA labels

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `cms/src/globals/Header.ts` | Edit | Add `dropdown` group field to links array |
| `cms/src/payload-types.ts` | Auto | Regenerate via `payload generate:types` |
| `web/src/components/ServicesDropdown.astro` | Create | New dropdown component |
| `web/src/layout/Header.astro` | Edit | Add dropdown rendering and hover logic |

---

## Validation Steps

1. **Type Check**: Run `pnpm --filter web run check`
2. **Lint**: Run `pnpm --filter web run lint`
3. **Visual Test**: 
   - Start dev server: `pnpm --filter web dev`
   - Hover over "Services" link in header
   - Verify dropdown appears with correct layout
   - Check responsive behavior (should not show on mobile)
4. **CMS Test**:
   - Open Payload admin
   - Edit Header global
   - Add dropdown to Services link
   - Add services, testimonial, background image
   - Save and verify on frontend

---

## Open Questions

1. Should the dropdown be configurable per link, or only for "Services"?
   - **Recommendation**: Make it configurable per link for flexibility
   
2. Should the testimonial be required or optional?
   - **Recommendation**: Optional (some dropdowns might not need it)

3. Should we add animation/transition effects?
   - **Recommendation**: Simple fade-in on hover (already in plan)

---

## Implementation Order

1. Update CMS schema (`Header.ts`)
2. Regenerate types
3. Create `ServicesDropdown.astro` component
4. Update `Header.astro` to render dropdown
5. Test and validate
