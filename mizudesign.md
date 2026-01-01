Design System: "Technical Blueprint"

Version: 2.0 (Mobile-First Layout Architecture)

Status: Active

Aesthetic Classification: Digital Industrial / High-Fidelity Wireframe / Dark Terminal

⚠️ CRITICAL: MOBILE RESPONSIVENESS

This design system MUST be implemented with mobile-first responsive design principles. Every component, layout, and typographic element must gracefully adapt across all viewport sizes from 320px mobile to 2560px desktop displays.

1. Core Philosophy

This system treats the User Interface as a technical schematic. It eschews modern "soft" UI trends (shadows, blurs, gradients) in favor of absolute clarity, rigid grids, and raw data presentation.

The 4 Laws

The Metaphor: A dark terminal screen with luminous blue data traces and grid overlays.

The Rule of Ink: If it doesn't convey data or structure, remove it.

The Rule of Edge: Containers are sharp (0px radius); controls are organic (999px radius).

The Rule of Flow: Every layout must fluidly adapt from mobile to desktop without breaking visual hierarchy or content density.

2. Color System & Harmony

The palette relies on "Cool Dark Slates" to support the Blue accent. Rather than dead achromatic blacks, the surfaces utilize low-saturation blue-greys to create a cohesive, atmospheric depth that harmonizes with the accent. This dark theme reduces eye strain while maintaining the technical blueprint aesthetic.

2.1 Accent Token (The "Live Wire")

The accent color is treated as a highlighter pen. It indicates active energy, critical data, or primary interactivity. On dark backgrounds, the blue reads as electric and luminous.

Token

Hex

Role

color-accent-main

#2D7AFF

Primary Actions, Active States, Crosshairs

color-accent-hover

#5294FF

Hover states for primary actions

color-accent-subtle

#1A2A44

Very faint accent wash (dark tinted panels)

2.2 Surface Tokens (Harmonized Dark Slates)

Theory: We use "Dark Slate" tones instead of pure black to complement and harmonize with the blue accent. Each surface layer provides subtle depth separation.

Token

Hex

Role

surface-canvas

#0A0B0E

Global background (Deep Void)

surface-card

#12141A

Primary container background (Elevated Dark)

surface-subtle

#1A1D24

Internal segmentation (Subtle Lift)

2.3 Ink Tokens (Text & Icons)

Token

Hex

Role

ink-primary

#F0F1F4

Headlines (Off-white for less harshness)

ink-secondary

#9BA1AB

Labels, body text (Cool Grey)

ink-tertiary

#5C626D

Placeholders, disabled states

ink-on-accent

#FFFFFF

Text inside primary buttons

2.4 Border Tokens

Token

Hex

Role

border-grid

#2A2D35

Structural lines (Dark Cool Grey)

border-element

#1F2229

Subtle borders within a card

2.5 Functional Signals (Semantic)

Theory: High-visibility colors tuned for dark backgrounds. Slightly brighter than light-mode equivalents to maintain readability without being garish.

Token

Hex

Role

Relation to Accent

signal-error

#F04438

Critical Failure

Complementary Tension

signal-warning

#F5B800

Attention Needed

Warm Contrast

signal-success

#12B76A

Operational

Cool Harmonious

3. Typography (Modern Minimalist Refinement)

Typography drives the elegance of the system. We use a Neo-Grotesque approach: tighter headlines, wide micro-labels, and a dedicated mono font for data density.

Primary Font: Geist Sans, Inter, or Suisse Int'l. (Rational, clean, neutral).
Data Font: JetBrains Mono or Geist Mono. (Humanist monospace).

3.1 Type Scale & Dynamics

Refinement Note: We avoid heavy weights (Bold/Black). Hierarchy is achieved through size and casing, not thickness.

Role

Weight

Size

Line Height

Tracking

Case

Display XL

Light (300)

48px

1.0 (Tight)

-2.5%

Sentence

H1 Title

Regular (400)

24px

1.2

-1.0%

Sentence

H2 Subhead

Regular (400)

16px

1.4

-0.5%

Sentence

Body Reading

Regular (400)

14px

1.5

0%

Sentence

Label/Micro

Medium (500)

11px

1.0

+6%

UPPERCASE

Data Numerical

Regular (400)

13px

1.4

0%

Tabular Nums

3.2 Typographic Rules

Tabular Figures: All numbers in data tables or dashboards must use font-variant-numeric: tabular-nums to ensure vertical alignment.

Optical Alignment: For Display XL, allow characters to hang slightly into the margin if possible for optical straightness.

No Italics: This system does not use italics. If emphasis is needed, use color (color-accent-main).

3.3 Responsive Typography

All typographic elements MUST use fluid sizing with CSS clamp() functions to ensure readability across all viewport sizes.

| Role | Mobile (320px) | Desktop (1920px) | CSS clamp() |
|------|----------------|------------------|-------------|
| Display XL | 28px | 48px | clamp(1.75rem, 4vw, 3rem) |
| H1 Title | 20px | 24px | clamp(1.25rem, 2vw, 1.5rem) |
| H2 Subhead | 14px | 16px | clamp(0.875rem, 1.5vw, 1rem) |
| Body Reading | 13px | 14px | clamp(0.8125rem, 1.2vw, 0.875rem) |
| Label/Micro | 10px | 11px | clamp(0.625rem, 1vw, 0.6875rem) |

Line Length Constraint: Body text should never exceed 65-75 characters per line. Use max-width constraints on text containers.

4. Grid Architecture (The "Bento" Logic)

The layout uses a visible modular grid.

Gap: 0px. No transparency between cards.

Separation: Cards are separated by 1px solid lines (border-grid).

Artifacts: The corners where four grid modules meet are marked with a visual artifact.

The Crosshair Artifact (+)

Every major intersection must feature a registration mark.

Symbol: Plus sign (+)

Color: color-accent-main (#2D7AFF)

Position: Absolute, overlapping the border intersection.

4.1 Panel Architecture (Two-Column Split)

The standard slide/page layout uses a weighted two-column split for visual hierarchy and balance.

Standard Proportions:

| Pattern | Left Column | Right Column | Use Case |
|---------|-------------|--------------|----------|
| Hero Split | 5/12 (41.7%) | 7/12 (58.3%) | Primary content with data visualization |
| Balanced | 6/12 (50%) | 6/12 (50%) | Equal weight content comparison |
| Data Heavy | 4/12 (33.3%) | 8/12 (66.7%) | Charts and complex visualizations |

The 5/7 Split Rule: When in doubt, use a 5:7 ratio. The narrower left panel contains headlines, labels, and navigation context. The wider right panel contains data, visualizations, and detailed content.

4.2 Content Density Principles

Anti-Empty Space Doctrine: Empty space must be intentional, not accidental. Every region should either contain content or serve as deliberate breathing room.

Vertical Fill Strategy:
- Primary content should expand to fill available height using flex-grow
- Secondary elements (stats, badges, visual artifacts) fill remaining vertical space
- Background patterns (dither, grid lines) occupy unused areas to maintain visual consistency

Content Stacking Pattern:
1. Section Label (uppercase, accent color, 11px) — top anchor
2. Headline (Display or H1) — primary focus
3. Body Content (paragraphs, lists, data) — expandable middle
4. Supporting Stats/Badges — bottom anchor with margin-top: auto

4.3 Visual Balance Techniques

Asymmetric Balance: Use unequal column widths (5/7) but balance visual weight through:
- Larger typography in narrow columns
- Denser data in wider columns
- Visual artifacts (lines, patterns) to fill negative space

Background Layering:
- Canvas layer: Base background (surface-canvas, deep void)
- Pattern layer: Dither patterns, grid lines (15-35% opacity for visibility on dark)
- Content layer: Cards, text, visualizations (elevated surfaces)

Edge Anchoring: Critical information should anchor to edges (top-left for hierarchy, bottom-right for CTAs). Avoid floating content in the center of large empty spaces.

4.4 Slide/Panel Header Pattern

Every major content panel must include a consistent header structure:

```
┌─────────────────────────────────────┐
│ SECTION_LABEL                    →  │  ← Section label (uppercase, accent)
│                                     │
│ Main Headline                       │  ← Primary title (Display/H1)
│ Supporting subtitle or context      │  ← Secondary text (ink-secondary)
└─────────────────────────────────────┘
```

Header Components:
- Section Label: 11px, uppercase, +6% tracking, accent color
- Directional Icon: Arrow or indicator, top-right, accent color
- Main Headline: Display XL or H1, ink-primary
- Subtitle: H2 or Body, ink-secondary

5. Component Library

5.1 Containers (Cards)

Shape: Strictly Rectangular.

Border Radius: 0px.

Shadows: None.

Stroke: 1px border-grid outline.

Header: Title (Top Left) + Directional Icon (Top Right, in Accent Color).

5.2 Buttons & Controls

Controls serve as the organic contrast to the rigid grid.

Shape: Full Pill (Capsule). border-radius: 999px.

Primary Action: Solid #2D7AFF background, White text.

Secondary Action: Transparent background, 1px #2D7AFF border, #2D7AFF text.

Toggles: High contrast. #2D7AFF circle thumb on a #1A1D24 track.

5.3 Iconography

Style: Linear / Stroke-based.

Stroke Width: 1.5px (Uniform).

Active State: Rendered in Accent Color.

6. Data Visualization

Data should feel like it is drawn with a plotter pen on dark paper.

Charts: 1px stroke weight.

Active Data Line: Rendered in Accent #2D7AFF.

Context Lines: Rendered in ink-secondary (#9BA1AB).

Fills: No solid fills. Use vertical hatching or dithering against dark backgrounds.

7. Imagery & Texture

The "Dither" Mandate: Photographic or 3D content must never be rendered in full gradients. It must be processed to look like 1-bit or grayscale print on dark surfaces.

Standard: Grayscale Dither (Light grey dots on Dark background).

Featured/Active: Duotone Dithering (Blue #2D7AFF dots on Dark background).

Perspective: Isometric or Orthographic preferred.

8. Mobile Responsiveness (MANDATORY)

⚠️ This section is non-negotiable. All implementations MUST be fully responsive.

8.1 Breakpoint System

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| xs | < 480px | Small phones |
| sm | 480px - 767px | Large phones, small tablets |
| md | 768px - 1023px | Tablets, small laptops |
| lg | 1024px - 1439px | Laptops, small desktops |
| xl | 1440px - 1919px | Desktop monitors |
| 2xl | ≥ 1920px | Large displays, presentations |

8.2 Layout Adaptation Rules

Two-Column to Single-Column:
- Desktop (≥768px): Standard two-column split (5/7 or custom ratio)
- Mobile (<768px): Stack columns vertically, left column becomes top section

```css
/* Example Implementation */
.split-layout {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
}

@media (min-width: 768px) {
  .split-layout {
    grid-template-columns: 5fr 7fr; /* Desktop: 5/7 split */
  }
}
```

Grid Collapse Pattern:
- 4-column grid → 2-column on tablet → 1-column on mobile
- 3-column grid → 2-column on tablet → 1-column on mobile
- 2-column grid → 1-column on mobile

8.3 Component Responsive Behavior

Data Visualizations:
- Charts must resize fluidly using percentage widths or viewBox
- Complex charts may simplify on mobile (fewer data points visible)
- Touch targets must be minimum 44x44px on mobile

Cards & Containers:
- Minimum card width: 280px
- Cards should stack vertically on mobile
- Padding scales: 32px desktop → 16px mobile

Navigation:
- Desktop: Visible navigation controls
- Mobile: Collapsed/hamburger menu or swipe gestures
- Touch-friendly: All interactive elements ≥44px touch target

8.4 Spacing Scale (Responsive)

Use CSS custom properties with responsive values:

| Token | Mobile | Desktop | CSS Variable |
|-------|--------|---------|--------------|
| space-xs | 4px | 4px | --space-xs |
| space-sm | 8px | 8px | --space-sm |
| space-md | 12px | 16px | --space-md |
| space-lg | 16px | 24px | --space-lg |
| space-xl | 24px | 32px | --space-xl |
| space-2xl | 32px | 48px | --space-2xl |
| space-3xl | 48px | 64px | --space-3xl |

8.5 Touch Interaction Guidelines

Minimum Touch Targets: 44x44px (Apple HIG) / 48x48px (Material Design)

Gesture Support:
- Horizontal swipe for slide/page navigation
- Pull-to-refresh where applicable
- Pinch-to-zoom for data visualizations

Hover States:
- Desktop: Show hover states on mouse interaction
- Mobile: Convert hover states to active/pressed states
- Use @media (hover: hover) to detect hover capability

```css
/* Hover-capable devices only */
@media (hover: hover) {
  .button:hover {
    background: var(--color-accent-hover);
  }
}

/* Touch devices */
.button:active {
  background: var(--color-accent-hover);
}
```

8.6 Performance Considerations

Mobile Optimization:
- Lazy load off-screen content and images
- Reduce animation complexity on mobile (prefer: reduced-motion)
- Use CSS transforms over position changes for animations
- Optimize images with responsive srcset

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

9. Developer Handoff (CSS Variables)

:root {
  /* Surface (Dark Slates) */
  --surface-canvas: #0A0B0E;
  --surface-card:   #12141A;
  --surface-subtle: #1A1D24;

  /* Ink (Light Tones on Dark) */
  --ink-primary:   #F0F1F4;
  --ink-secondary: #9BA1AB;
  --ink-tertiary:  #5C626D;
  --ink-on-accent: #FFFFFF;

  /* Accent (Electric Blue) */
  --color-accent-main:   #2D7AFF;
  --color-accent-hover:  #5294FF;
  --color-accent-subtle: #1A2A44;

  /* Functional Signals (Tuned for Dark) */
  --signal-error:   #F04438;
  --signal-warning: #F5B800;
  --signal-success: #12B76A;

  /* Borders (Dark) */
  --border-grid:    #2A2D35;
  --border-element: #1F2229;
  --border-accent:  #2D7AFF;
  
  /* Typography Stack */
  --font-sans: 'Geist Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  /* Responsive Spacing (Mobile defaults) */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  12px;
  --space-lg:  16px;
  --space-xl:  24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* Responsive Typography */
  --text-display: clamp(1.75rem, 4vw, 3rem);
  --text-h1:      clamp(1.25rem, 2vw, 1.5rem);
  --text-h2:      clamp(0.875rem, 1.5vw, 1rem);
  --text-body:    clamp(0.8125rem, 1.2vw, 0.875rem);
  --text-label:   clamp(0.625rem, 1vw, 0.6875rem);
}

/* Desktop spacing overrides */
@media (min-width: 768px) {
  :root {
    --space-md:  16px;
    --space-lg:  24px;
    --space-xl:  32px;
    --space-2xl: 48px;
    --space-3xl: 64px;
  }
}

/* Utility Class: Grid Intersections */
.grid-cell {
  position: relative;
  background: var(--surface-card);
  border: 1px solid var(--border-grid);
}

.grid-cell::after {
  content: "+";
  position: absolute;
  top: -8px; 
  right: -8px;
  color: var(--color-accent-main);
  font-family: monospace;
  z-index: 10;
  background: transparent;
}

/* Utility: Split Layout (5/7 Ratio) */
.split-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100%;
}

@media (min-width: 768px) {
  .split-layout {
    grid-template-columns: 5fr 7fr;
  }
}

/* Utility: Panel with consistent header */
.panel {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-grid);
}

.panel-header {
  margin-bottom: var(--space-md);
}

.panel-label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent-main);
  margin-bottom: var(--space-sm);
}

.panel-title {
  font-size: var(--text-display);
  font-weight: 300;
  line-height: 1.0;
  letter-spacing: -0.025em;
  color: var(--ink-primary);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Utility: Content stacking with auto-fill */
.stack-fill {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stack-fill > *:last-child {
  margin-top: auto;
}

/* Utility: Responsive grid */
.grid-responsive {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Utility: Touch-friendly interactive elements */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Utility: Dither background pattern (dark-optimized) */
.dither-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%232D7AFF' fill-opacity='0.25'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

