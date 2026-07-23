# Client Login Page Implementation Plan

## Overview
Figma design (node 238:436) se Client Login page banana hai. Ye page existing Pages collection ke format mein fit hoga with a custom LoginBlock.

## Design Analysis

**Page Structure:**
- Full-screen hero section with background image + dark overlay
- Centered login form with:
  - Title: "Dashboard Login"
  - Email input field
  - Password input field
  - "Forgot password?" link
  - Login button (orange #ef4924)
- Header with logo (left) and register link (right)

**Key Components:**
1. Hero section (already exists in project)
2. Login form block (NEW - needs to be created)

## Implementation Steps

### Phase 1: CMS Block Schema
**File:** `cms/src/blocks/LoginBlock.ts`

Create Payload block schema with fields:
- `title` (text, required) - "Dashboard Login"
- `emailPlaceholder` (text) - "Email Address"
- `passwordPlaceholder` (text) - "Password"
- `forgotPasswordLabel` (text) - "Forgot password?"
- `forgotPasswordLink` (relationship to pages) - Optional link
- `buttonLabel` (text) - "Login"
- `buttonAction` (select: 'submit' | 'link') - Form submit ya redirect
- `buttonLink` (relationship to pages) - Agar link select ho
- `registerLabel` (text) - "register"
- `registerLink` (relationship to pages) - Register page link

### Phase 2: Register Block in Pages Collection
**File:** `cms/src/collections/Pages.ts`

- Import LoginBlock
- Add to `sections.blocks` array

### Phase 3: Regenerate Types
**Command:**
```bash
pnpm --filter cms payload generate:types
```

### Phase 4: Astro Frontend Component
**File:** `web/src/components/blocks/LoginBlock.astro`

Create Astro component that:
- Accepts all props from LoginBlock schema
- Renders login form with proper styling
- Uses existing design tokens
- Responsive design (mobile-first)
- Form handling (client-side or server endpoint)

**Styling Requirements:**
- Background: Full-screen with image + dark overlay (rgba(22, 25, 25, 0.77))
- Form container: Centered, max-width 620px
- Input fields: 
  - Height: 70-71px
  - Border-radius: 50px (pill shape)
  - Background: rgba(0, 0, 0, 0.22)
  - Border: 1px solid white
  - Text: White, 18px Open Sans
- Login button:
  - Background: #ef4924 (orange)
  - Height: 70px
  - Border-radius: 50px
  - Text: White, 20px, uppercase, semibold
- Typography:
  - Title: 40px Montserrat (Regular + SemiBold mix)
  - Labels: 18px Open Sans Regular
  - Button: 20px Open Sans SemiBold uppercase

### Phase 5: Block Routing
**File:** `web/src/components/SectionBlock.astro`

Add case for 'login' blockType:
```typescript
case 'login':
  return <LoginBlock {...(props as LoginBlockType)} />
```

### Phase 6: Type Checking
**Command:**
```bash
pnpm --filter web run check
```

## Design Tokens to Add
**File:** `web/src/styles.css`

Check if these tokens exist, add if missing:
```css
@theme {
  --color-login-orange: #ef4924;
  --color-login-overlay: rgba(22, 25, 25, 0.77);
  --color-login-input-bg: rgba(0, 0, 0, 0.22);
}
```

## Page Creation Workflow
After implementation, user can:
1. Go to Payload Admin → Pages collection
2. Create new page (e.g., "Client Login")
3. Add Hero section with background image
4. Add Section with LoginBlock
5. Configure all text and links
6. Publish page

## Technical Considerations

**Form Handling:**
- Login form needs backend endpoint
- Options:
  a. External auth service (Auth0, Firebase, etc.)
  b. Custom API endpoint in `cms/src/endpoints/`
  c. Third-party integration
- **Decision needed:** Login authentication method?

**Security:**
- Password field should use `type="password"`
- CSRF protection for form submission
- HTTPS required in production
- Rate limiting for login attempts

**Accessibility:**
- Proper form labels (aria-label or visible labels)
- Focus states for inputs and button
- Keyboard navigation support
- Screen reader friendly

## Files to Create/Modify

### New Files:
1. `cms/src/blocks/LoginBlock.ts` - Block schema
2. `web/src/components/blocks/LoginBlock.astro` - Frontend component

### Modified Files:
1. `cms/src/collections/Pages.ts` - Register block
2. `web/src/components/SectionBlock.astro` - Add routing case
3. `web/src/styles.css` - Add design tokens (if needed)

### Generated Files:
1. `cms/src/payload-types.ts` - Auto-generated after type generation

## Open Questions

1. **Authentication Backend:** ✅ DECIDED - UI pehle, backend baad mein
   - Login form sirf UI hoga initially
   - Form submission handler placeholder hoga
   - Backend integration separate phase mein hoga

2. **Form Action:** Login button click pe kya hoga?
   - Initial: Console log / placeholder function
   - Later: API integration add karna

3. **Background Image:** Hero section ki background image kahan se aayegi?
   - CMS se upload (Hero section field use karenge)

4. **Register Link:** "register" link kahan le jayega?
   - CMS se configurable (Pages relationship field)

## Validation Checklist

- [ ] Block schema created with all fields
- [ ] Block registered in Pages collection
- [ ] Types regenerated successfully
- [ ] Astro component renders correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Form inputs have proper labels
- [ ] Button styling matches Figma (#ef4924)
- [ ] Background overlay opacity correct (77%)
- [ ] Typography matches (Montserrat + Open Sans)
- [ ] All text is editable via CMS (not hardcoded)
- [ ] Links work correctly
- [ ] Type checking passes

## Implementation Order

1. Create LoginBlock schema (CMS)
2. Register in Pages.ts
3. Regenerate types
4. Create Astro component
5. Add routing in SectionBlock.astro
6. Add design tokens to styles.css
7. Test type checking
8. Create test page in CMS
9. Visual verification against Figma
10. Responsive testing

## Dependencies

- Existing Hero section component
- Existing design system (Tailwind)
- Payload CMS running
- Astro dev server running

## Notes

- Ye page static nahi hai - CMS se content aayega
- Login form ka backend separate concern hai - UI pe focus karo pehle
- Hero section already exists, uske saath integrate karna hai
- Mobile-first approach follow karna hai
