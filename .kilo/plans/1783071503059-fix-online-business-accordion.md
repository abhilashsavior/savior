# Fix: OnlineBusinessBlock Accordion Not Opening

## Problem
The accordion items in `OnlineBusinessBlock.astro` don't open when clicking the right-side arrow button.

## Root Cause
In the JavaScript at lines 138-149, `content.scrollHeight` returns `0` because the content element has `max-height: 0` from the Tailwind class `max-h-0`. When we try to set `content.style.maxHeight = content.scrollHeight + 'px'`, we're setting `max-height: 0px`, which doesn't open the content.

## Fix
Update the `<script is:inline>` block in `web/src/components/blocks/OnlineBusinessBlock.astro` (lines 120-159) to:

1. Add a helper function `getFullHeight()` that:
   - Temporarily sets `content.style.maxHeight = 'none'`
   - Reads `content.scrollHeight`
   - Resets `content.style.maxHeight = '0px'`
   - Returns the calculated height

2. Use this helper before setting the expanded height:
   - On initial load for expanded items
   - On click when opening an item

## Code Change
Replace the script block with:

```javascript
<script is:inline>
  const initAccordion = () => {
    document.querySelectorAll('[id^="online-business-"]').forEach((root) => {
      if (root.dataset.initialized === 'true') return

      root.querySelectorAll('[data-accordion-item]').forEach((item) => {
        const trigger = item.querySelector('[data-accordion-trigger]')
        const content = item.querySelector('[data-accordion-content]')
        const icon = item.querySelector('[data-accordion-icon]')

        if (!trigger || !content) return

        const getFullHeight = () => {
          content.style.maxHeight = 'none'
          const height = content.scrollHeight
          content.style.maxHeight = '0px'
          return height
        }

        const isInitiallyExpanded = item.dataset.expanded === 'true'
        if (isInitiallyExpanded) {
          const fullHeight = getFullHeight()
          content.style.maxHeight = fullHeight + 'px'
          if (icon) icon.style.transform = 'rotate(180deg)'
        }

        trigger.addEventListener('click', () => {
          const isOpen = item.dataset.expanded === 'true'

          if (!isOpen) {
            const fullHeight = getFullHeight()
            item.dataset.expanded = 'true'
            content.style.maxHeight = fullHeight + 'px'
            if (icon) icon.style.transform = 'rotate(180deg)'
          } else {
            item.dataset.expanded = 'false'
            content.style.maxHeight = '0px'
            if (icon) icon.style.transform = 'rotate(0deg)'
          }
        })
      })

      root.dataset.initialized = 'true'
    })
  }

  document.addEventListener('astro:page-load', initAccordion)
  initAccordion()
</script>
```

## Files to Modify
- `web/src/components/blocks/OnlineBusinessBlock.astro` — lines 120-159

## Validation
After applying the fix:
1. Run `pnpm --filter web run check` to verify no TypeScript errors
2. Test in browser: clicking the arrow button should expand/collapse the accordion item
