# alegra DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 9
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![alegra Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography pairs **Inter** for display/headings with **Lexend** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. The palette is predominantly monochromatic with **#00d6bc** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| tw-ring-offset-color | `#ffffff` | background | Page background, darkest surface |
| lovable-color-primary-50 | `#f1f5f9` | surface | Card and panel backgrounds |
| text-primary | `#0f172a` | text-primary | Headings and body text |
| text-muted | `#9ca3af` | text-muted | Captions, placeholders, secondary info |
| border | `#475569` | border | Dividers, card borders, outlines |
| accent | `#00d6bc` | accent | CTAs, links, focus rings, active states |
| success | `#e2fee2` | success | Success states, positive indicators |
| info | `#001e3b` | info | Informational highlights |
| lovable-color-primary-600 | `#30aba9` | unknown | Palette color |
| lovable-muted | `#64748b` | unknown | Palette color |
| unknown | `#334155` | unknown | Palette color |
| lovable-border | `#e5e7eb` | unknown | Palette color |
| unknown | `#000000` | unknown | Palette color |
| unknown | `#18283f` | unknown | Palette color |
| lovable-color-primary-vibrant | `#06ecd0` | unknown | Palette color |
| lovable-color-primary-900 | `#1a7e7f` | unknown | Palette color |
| unknown | `#0d3341` | unknown | Palette color |
| lovable-color-primary-100 | `#cff2f1` | unknown | Palette color |
| unknown | `#42b983` | unknown | Palette color |
| lovable-color-primary-700 | `#299e9c` | unknown | Palette color |

### CSS Variable Tokens

```css
--tw-border-spacing-x: 0;
--tw-border-spacing-y: 0;
--tw-border-spacing-x: 0;
--tw-border-spacing-y: 0;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
--tw-border-opacity: 1;
```


---

## 3. Typography Rules

**Font Stack:**
- **Lexend** — Heading 1, Heading 2, Heading 3
- **Inter** — Body, Caption
- **SFMono-Regular** — Code

**Font Sources:**

```css
@font-face {
  font-family: "Inter";
  src: url("https://alegra.com/fonts/inter/Inter_18pt-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Inter";
  src: url("https://alegra.com/fonts/inter/Inter_18pt-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Lexend";
  src: url("https://alegra.com/fonts/lexend/Lexend-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Lexend";
  src: url("https://alegra.com/fonts/lexend/Lexend-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Montserrat";
  src: url("https://alegra.com/fonts/montserrat/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("https://alegra.com/fonts/montserrat/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Mulish";
  src: url("https://alegra.com/fonts/mulish/Mulish-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Mulish";
  src: url("https://alegra.com/fonts/mulish/Mulish-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Roboto";
  src: url("https://alegra.com/fonts/roboto/Roboto-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Roboto";
  src: url("https://alegra.com/fonts/roboto/Roboto-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Poppins";
  src: url("https://alegra.com/fonts/poppins/Poppins-Bold.ttf") format("truetype");
  font-weight: 700;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Lexend | 113.859px | 700 |
| Heading 2 | Lexend | 104px | 700 |
| Heading 3 | Lexend | 72px | 700 |
| Body | Inter | .875rem | 400 |
| Caption | Inter | .75rem | 400 |
| Code | SFMono-Regular | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **Lexend** for body/UI text, **Inter** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`
- Variants: `-container`, `-title--container`, `-title`, `-text`

**Badge** — `html`

**List** — `html`

### Data Input (1)

**Button** — `html`
- Animation: 

### Overlay (1)

**Modal** — `html`

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **Border radius:** .125rem, .25rem, .375rem, .5rem, .75rem, 1rem, 1.5rem, 2px, 2.6em, 3px, 3em, 4px, 5px, 6px, 7px, 8px, 9px, 9.193px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 24px, 25px, 30px, 32px, 34px, 35px, 38px, 43px, 64px, 99px, 100px, 100%, 475px, 999px, inherit
- **Max content width:** 1024px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 1px #e4e9f6 inset`
- `0 0 0 1px inset #00000014`
- `0 1px 1px #0000004d`

### Raised — cards, buttons, interactive elements

- `0 4px 6px -1px #0000001a,0 2px 4px -1px #0000000f`
- `0 4px 4px #00000040`
- `0 1px 3px #0000001a`

### Floating — dropdowns, popovers, modals

- `0 2px 6px -2px #0000000d,0 10px 15px -3px #0000001a`
- `0 10px 15px -3px #0000001a`
- `0 10px 15px -5px #0000001a`

### Overlay — full-screen overlays, top-level dialogs

- `0 10px 25px -5px #0000001a,0 4px 10px -6px #00000014`
- `0 20px 60px -12px #0f172a29`
- `0 0 24px #06ecd0a6,inset 0 0 16px #06d0ec80`

### Z-Index Scale

`0, 1, 2, 3, 5, 8, 9, 10, 20, 40, 50, 100, 200, 9999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes pulse`
- `@keyframes zoom-in`
- `@keyframes border-pulsate`
- `@keyframes slideLogos`
- `@keyframes slideLogosExtend`
- `@keyframes opacity2`
- `@keyframes opacity1`
- `@keyframes cards-simple-inline-grad`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#00d6bc` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **Lexend** (body) with **Inter** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .125rem, .25rem, .375rem, .5rem, .75rem
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Lexend and Inter and SFMono-Regular
- Don't use arbitrary spacing values — stick to multiples of 5px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 350px | css |
| xs | 360px | css |
| xs | 373px | css |
| xs | 400px | css |
| xs | 431px | css |
| xs | 450px | css |
| xs | 480px | css |
| sm | 490px | css |
| sm | 520px | css |
| sm | 540px | css |
| sm | 548px | css |
| sm | 550px | css |
| sm | 600px | css |
| sm | 639px | css |
| sm | 640px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 790px | css |
| lg | 799px | css |
| lg | 839px | css |
| lg | 840px | css |
| lg | 860px | css |
| lg | 900px | css |
| lg | 980px | css |
| lg | 1023px | css |
| lg | 1024px | css |
| xl | 1160px | css |
| xl | 1180px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1350px | css |
| 2xl | 1439px | css |
| 2xl | 1440px | css |
| 2xl | 1500px | css |
| 2xl | 1536px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f1f5f9
Border: 1px solid #475569
Radius: 14px
Padding: 20px
Font: Lexend
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #00d6bc, text white
Ghost: bg transparent, border #475569
Padding: 10px 20px
Radius: 14px
Hover: opacity 0.9 or lighter shade
Focus: ring with #00d6bc
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1024px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f1f5f9
Label: #9ca3af (muted, 12px, uppercase)
Value: #0f172a (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #475569
Focus: border-color #00d6bc
Label: #9ca3af 12px
Spacing: 20px between fields
Radius: 14px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Lexend, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
