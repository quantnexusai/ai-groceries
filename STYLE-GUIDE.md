# AI Groceries Style Guide

Design system documentation for the AI Groceries template. Built around "The Harvest Table" philosophy -- abundance without noise, rooted in warmth and real-food authenticity.

---

## Design Principles

- **Abundance without Noise** -- the interface should feel plentiful and inviting without overwhelming the user. White space is generous; content breathes.
- **Light-first** -- the default experience is bright and warm. Dark surfaces are used sparingly for contrast and grounding, not as the primary mode.
- **Harvest warmth** -- colors are drawn from sunlit fields, leafy greens, and rich earth. The palette evokes a farmers market, not a warehouse.
- **Legibility over decoration** -- typography and layout choices prioritize readability. Decorative elements support content, never compete with it.

---

## Color Palette

| Token        | Name        | Hex       | Usage                                       |
| ------------ | ----------- | --------- | ------------------------------------------- |
| `sunbeam`    | Sunbeam     | `#F0E491` | Primary accent, highlights, badges, CTAs     |
| `leaf`       | New Leaf    | `#BBC863` | Secondary accent, success states, tags        |
| `orchard`    | Orchard     | `#658C58` | Tertiary, icons, active states, links         |
| `deep-earth` | Deep Earth  | `#31694E` | Dark accent, headers, emphasis, footers       |
| `cream`      | Cream       | `#FFFDF5` | Background, cards, light surfaces             |

### Extended Neutrals

- **White**: `#FFFFFF` -- base background
- **Cream**: `#FFFDF5` -- card backgrounds, subtle sections
- **Light border**: `#E8E4D9` -- card borders, dividers
- **Muted text**: `#6B7280` -- secondary text, captions
- **Body text**: `#374151` -- primary body copy
- **Headings**: `#1F2937` -- headings and strong text

### Usage Guidelines

- Use `sunbeam` for primary buttons and key call-to-action elements.
- Use `leaf` for secondary actions, success indicators, and category tags.
- Use `orchard` for links, active navigation states, and icon accents.
- Use `deep-earth` for section headers, the footer, and high-contrast emphasis.
- Use `cream` as the default card and section background to maintain warmth.

---

## Typography

### Fonts

| Role    | Family      | Weight Range | Usage                              |
| ------- | ----------- | ------------ | ---------------------------------- |
| Display | Fraunces    | 600 -- 800   | Headings, hero text, brand moments |
| Body    | Quicksand   | 400 -- 600   | Body copy, UI text, labels         |

### Scale

| Class / Size | Font       | Weight | Use for                  |
| ------------ | ---------- | ------ | ------------------------ |
| `text-4xl`   | Fraunces   | 700    | Hero headings            |
| `text-3xl`   | Fraunces   | 700    | Page titles              |
| `text-2xl`   | Fraunces   | 600    | Section headings         |
| `text-xl`    | Fraunces   | 600    | Card titles              |
| `text-lg`    | Quicksand  | 600    | Subheadings, emphasis    |
| `text-base`  | Quicksand  | 400    | Body text                |
| `text-sm`    | Quicksand  | 400    | Captions, secondary text |
| `text-xs`    | Quicksand  | 500    | Badges, labels, metadata |

### Guidelines

- Headings always use **Fraunces** with `font-display`.
- Body text always uses **Quicksand** with `font-body`.
- Never use Fraunces below `text-xl` -- switch to Quicksand semibold for smaller emphasis.
- Line height for body text should be relaxed (`leading-relaxed` or `leading-7`).

---

## Component Classes

### Cards

```html
<div class="bg-cream border border-[#E8E4D9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <!-- Card content -->
</div>
```

Cards use `rounded-2xl` for soft edges. Background is `cream` with a subtle border. Shadow lifts on hover.

### Buttons

**Primary (Sunbeam)**

```html
<button class="btn-primary">
  Add to Cart
</button>
```

```css
.btn-primary {
  @apply bg-sunbeam text-deep-earth font-body font-semibold
         px-6 py-3 rounded-xl
         hover:brightness-105 active:scale-[0.98]
         transition-all duration-200;
}
```

**Secondary (Orchard outline)**

```html
<button class="btn-secondary">
  View Details
</button>
```

```css
.btn-secondary {
  @apply border-2 border-orchard text-orchard font-body font-semibold
         px-6 py-3 rounded-xl
         hover:bg-orchard hover:text-white
         transition-all duration-200;
}
```

**Ghost**

```html
<button class="btn-ghost">
  Cancel
</button>
```

```css
.btn-ghost {
  @apply text-orchard font-body font-medium
         px-4 py-2 rounded-lg
         hover:bg-orchard/10
         transition-colors duration-200;
}
```

### Form Elements

**Input**

```html
<input class="input" type="text" placeholder="Enter ZIP code" />
```

```css
.input {
  @apply w-full px-4 py-3 rounded-xl border border-[#E8E4D9]
         bg-white font-body text-gray-800
         placeholder:text-gray-400
         focus:outline-none focus:ring-2 focus:ring-sunbeam/50 focus:border-sunbeam
         transition-colors duration-200;
}
```

**Textarea**

```html
<textarea class="textarea" rows="4" placeholder="Add a note..."></textarea>
```

```css
.textarea {
  @apply w-full px-4 py-3 rounded-xl border border-[#E8E4D9]
         bg-white font-body text-gray-800
         placeholder:text-gray-400
         focus:outline-none focus:ring-2 focus:ring-sunbeam/50 focus:border-sunbeam
         resize-none transition-colors duration-200;
}
```

**Label**

```html
<label class="label">ZIP Code</label>
```

```css
.label {
  @apply block text-sm font-body font-semibold text-gray-700 mb-1.5;
}
```

---

## Animations

Custom keyframe animations defined in the Tailwind config:

### softDrop

A gentle downward entrance with fade-in. Used for cards and content blocks appearing on page load.

```css
@keyframes softDrop {
  0% { opacity: 0; transform: translateY(-12px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**Usage**: `animate-softDrop` -- apply to cards and sections as they enter the viewport.

### grow

A subtle scale-up from slightly smaller. Used for badges, tags, and small UI elements.

```css
@keyframes grow {
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}
```

**Usage**: `animate-grow` -- apply to badges, toasts, and notification elements.

### bokehDrift

A slow horizontal drift for decorative background elements. Creates an organic, ambient feel.

```css
@keyframes bokehDrift {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(30px) scale(1.1); }
}
```

**Usage**: `animate-bokehDrift` -- apply to decorative blurred background shapes on hero sections.

### slideUp

A vertical slide entrance from below. Used for the Provenance Drawer and bottom sheets.

```css
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**Usage**: `animate-slideUp` -- apply to the Provenance Drawer and modal overlays.

---

## Iconography

All icons use [Lucide React](https://lucide.dev). Default stroke width is `1.5`. Icon size follows context:

| Context         | Size     | Class      |
| --------------- | -------- | ---------- |
| Inline with text | 16px    | `w-4 h-4` |
| Buttons          | 20px    | `w-5 h-5` |
| Card icons       | 24px    | `w-6 h-6` |
| Feature icons    | 32px    | `w-8 h-8` |

Icon color should match the surrounding text color or use `orchard` / `deep-earth` for accent.

---

## Spacing and Layout

- Page max-width: `max-w-7xl mx-auto`
- Section padding: `px-4 sm:px-6 lg:px-8` horizontal, `py-12 sm:py-16` vertical
- Card padding: `p-5` or `p-6`
- Card gap in grids: `gap-6`
- Standard border radius: `rounded-2xl` for cards, `rounded-xl` for buttons and inputs

---

## Responsive Breakpoints

Follow Tailwind's default breakpoints:

| Breakpoint | Min width | Usage                          |
| ---------- | --------- | ------------------------------ |
| `sm`       | 640px     | Stack to side-by-side          |
| `md`       | 768px     | Two-column grids               |
| `lg`       | 1024px    | Three-column product grids     |
| `xl`       | 1280px    | Full-width layouts, max-w cap  |

Product grids use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` as the standard pattern.
