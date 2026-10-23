---
name: Vault Minimal
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-data:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an ultra-clean, archival, and utilitarian environment tailored for collectors and catalogers. The brand evokes curation, quiet precision, and high-density legibility without visual distraction or pastel playfulness. By paring down ornamental design elements, the system lets rich collectible imagery, scan data, and inventory metadata become the focal points.

The aesthetic blends **Modern Precision Minimalism** with archival data-density:
- **Surface purity:** High-contrast pure white containers floating seamlessly over an ultra-pale slate background.
- **Architectural control:** Precise 1px architectural dividers, crisp hairline borders, and balanced whitespace that mimics an immaculate digital museum vitrine.
- **Micro-tactility:** Restrained interactive states featuring subtle scale shifts, micro-borders, and whisper-quiet depth transitions rather than heavy saturated color shifts.

## Colors

The palette is strictly achromatic and cool-slate monochromatic, completely devoid of warm pastel tones or oversaturated accents. Visual weight and hierarchy are driven exclusively by tonal contrast, precise borders, and typographic weights.

### Palette Roles
- **Canvas / Base Background (`#F8FAFC`):** An ultra-soft cool mist that establishes subtle separation from content modules without eye strain.
- **Surface / Cards (`#FFFFFF`):** Pure white islands for cards, sidebars, modal surfaces, and data grids.
- **Borders & Dividers (`#E2E8F0`):** Subtle cool-grey structural boundaries providing crisp definition under varying display calibrations.
- **Primary Text & High Accent (`#0F172A`):** Deep charcoal slate used for primary metrics, active toggle states, primary action buttons, and dominant headers.
- **Secondary Text / Neutral Icons (`#334155`):** Mid-slate for secondary headers, table content, and interactive icon strokes.
- **Muted Text / Metadata (`#64748B`):** Cool slate-grey for subtle timestamps, serial numbers, labels, and inactive iconography.
- **Subtle Surface Hover (`#F1F5F9`):** Soft grey fill applied to interactive items, hover states, and inactive tab indicators.

## Typography

The type system is powered entirely by **Inter**, leveraging its tall x-height, neutral tone, and exceptional numeric clarity for dense dashboard inventories. 

- **Display & Headlines:** Tightly tracked headings (-0.02em to -0.025em) provide a crisp, modern editorial presence.
- **Numbers & Metrics:** Use tabular lining figures (`font-variant-numeric: tabular-nums`) across cards, counters, and statistics tables to prevent jitter across dynamic updates.
- **Labels:** Micro-labels utilize uppercase styling with subtle tracking (+0.04em) at weight 600 to distinguish metadata fields (e.g., GAME SERIES, RELEASE YEAR, MINT ID) from standard editorial body text.

## Layout & Spacing

The dashboard employs a **structured fixed-plus-fluid grid system** built around a persistent left rail and an expansive flexible content area.

### Shell Architecture
- **Sidebar Navigation:** Fixed 260px desktop width, attached flush to the left canvas, anchored by a 1px solid `#E2E8F0` vertical separator. Collapses into an off-canvas drawer below 1024px.
- **Expansive Search Header:** Sticky horizontal header spanning the viewport remainder, height fixed at 64px, featuring edge-to-edge search inputs and persistent user actions.
- **Main Viewport Grid:** Fluid 12-column sub-grid spanning between 1024px and 1600px with 24px gutters. Beyond 1600px, content retains a max-width container centered within the workspace.

### Breakpoints & Adaptations
- **Desktop (1024px+):** Full multi-column view with 260px fixed sidebar, 4-to-6 column collectible card grids, and 32px canvas margins.
- **Tablet (768px - 1023px):** Sidebar converts into a slim icon bar (72px) or sliding sheet; collectible card grid collapses to 3 columns; gutters contract to 20px.
- **Mobile (Below 768px):** Single column fluid feed; sticky global header condenses search bar to an expandable modal trigger; bottom navigation bar handles primary navigation.

## Elevation & Depth

This system avoids heavy shadows, saturated glows, or skeuomorphic treatments. Depth is achieved via **tonal layering paired with hairline edge definition and whisper shadows**.

### Elevation Scale
- **Flat (Level 0):** Canvas `#F8FAFC`. Completely un-elevated background surface.
- **Surface Rest (Level 1):** `#FFFFFF` cards, lists, and content tiles. Styled with a 1px solid `#E2E8F0` border and an ultra-diffuse ambient drop:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Raised / Hover (Level 2):** Interactive cards upon cursor focus or hover. Retains the 1px border (`#CBD5E1`) with elevated ambient dispersion:
  `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Floating / Overlay (Level 3):** Modals, dropdown menus, context popovers, and floating search preview panels.
  `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.02)`.

## Shapes

The geometry balances structured architectural precision with organic curvature:
- **Base Geometry (`roundedness: 2`):** Standard interactive elements (input fields, action buttons, dropdown items) use 8px (`0.5rem`) corner radiuses for crisp precision.
- **Large Surfaces (`rounded-lg` / `rounded-xl`):** Primary cards, analytical widgets, and modal dialogues use 16px to 24px (`1rem` to `1.5rem`) radiuses to create friendly, modern panels without looking bubbly.
- **Pills / Tags:** Micro-indicators, status chips, and counters optionally use fully rounded pill geometry (`9999px`) to create clear shape hierarchy against rectangular cards.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, border none, 8px radius. Hover: `#1E293B`. Active: subtle transform scale `0.98`.
- **Secondary:** Background `#FFFFFF`, text `#0F172A`, border 1px solid `#E2E8F0`. Hover: `#F8FAFC` surface, border `#CBD5E1`.
- **Ghost / Minimal:** Background transparent, text `#334155`. Hover: `#F1F5F9`.

### Input Fields & Expansive Search Header
- **Global Search Header:** Expansive, flat input bar embedded into the navigation bar. Background `#F8FAFC`, active state transitions to `#FFFFFF` with a crisp 1px solid `#0F172A` outline and soft Level 1 shadow. Iconography sits inside the input at `#64748B`.
- **Form Inputs:** 40px height, background `#FFFFFF`, border 1px solid `#E2E8F0`, 8px radius, text `#0F172A`. Focused state: border `#0F172A`, outline 2px solid rgba(15, 23, 42, 0.08).

### Collectible Cards
- **Structure:** Pure white `#FFFFFF` surface, 16px radius, 1px solid `#E2E8F0`, Level 1 ambient shadow.
- **Asset Display:** Centered item render over an ultra-light grey recessed viewport (`#F8FAFC`, 12px radius, zero border).
- **Metadata Layout:** Series tag in `label-sm` uppercase (`#64748B`), title in `headline-sm` (`#0F172A`), inventory count/rarity in `mono-data`.
- **Hover Behavior:** Translates -2px on Y-axis, transitions to Level 2 shadow with border shifting to `#CBD5E1`.

### Chips & Badges
- **Status Badges:** Background `#F1F5F9`, border 1px solid `#E2E8F0`, text `#334155`, fully rounded pill geometry (`9999px`), padding 2px 10px.
- **Filter Chips:** Background `#FFFFFF`, text `#334155`, border 1px solid `#E2E8F0`. When selected: background `#0F172A`, text `#FFFFFF`, border `#0F172A`.

### Selection Controls (Checkboxes & Radios)
- **Checkboxes:** 18px square with 4px radius, 1px solid `#CBD5E1`, background `#FFFFFF`. Selected: background `#0F172A`, check icon stroke `#FFFFFF`.
- **Radio Buttons:** 18px circle, 1px solid `#CBD5E1`. Selected: border `#0F172A` with an inner solid circle dot of `#0F172A` (6px diameter).

### Data Lists & Tables
- **Rows:** Minimum height 52px, background `#FFFFFF`, separated by 1px bottom border `#F1F5F9`.
- **Hover Row:** `#F8FAFC` transition across all cell backgrounds.
- **Header:** Sticky top header, background `#F8FAFC`, uppercase `label-sm` typography in `#64748B`.