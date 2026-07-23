---
trigger: always_on
---

# Savior Site Rules

## 1. Design System & Breakpoints

### Responsive Breakpoints

| Name | Width  | Use Case                 |
| ---- | ------ | ------------------------ |
| xl   | 1920px | Ultra-wide displays (4K) |
| lg   | 1440px | Large desktop monitors   |
| md   | 1024px | Desktop/Laptop screens   |
| sm   | 768px  | Tablets (iPad, etc.)     |
| xs   | 420px  | Mobile phones            |

## 2. Tailwind Usage

Use `xl:`, `lg:`, `md:`, `sm:`, `xs:` prefixes in your components.

## 3. Container Width

Use the width `1170px` consistently for components which are not in full width.

## 4. CSS & Styling Guidelines

- Use Tailwind CSS only
- Extract reusable class combinations
- Maintain consistent spacing scale
- Use responsive breakpoints carefully
- Match Figma pixel-perfectly
- Use exact font-family, font-size, line-height and spacing from Figma

## 5. Implementation Workflow

1. Analyze the Figma design thoroughly
2. Identify all reusable UI patterns
3. Identify CMS-managed sections
4. Plan component architecture first
5. Then generate implementation step-by-step
