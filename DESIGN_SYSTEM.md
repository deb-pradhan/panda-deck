# PANDA Terminal Design System Specification (v2.0)

This comprehensive document defines the visual, structural, and behavioral language of the PANDA Terminal. It is engineered for precision, high-density data visualization, and seamless programmatic implementation.

---

## 1. Design Philosophy & Core Aesthetics
The PANDA Terminal utilizes a **High-Density Professional Dark Mode (HD-PDM)**.
- **Utilitarian Precision**: Every pixel must serve a functional purpose. Information density is prioritized over "white space."
- **Technical Trust**: The use of monochromatic surfaces paired with high-contrast semantic indicators (Bullish/Bearish) builds user confidence in data accuracy.
- **Layered Elevation**: Depth is conveyed through surface color shifts rather than heavy shadows.

---

## 2. Color Architecture (HEX & Functional Tokens)

### 2.1 Neutral Foundation (The "Dark" Scale)
| Token Name | HEX | Usage Context |
| :--- | :--- | :--- |
| `bg-base` | `#000000` | Global background, underlying canvas. |
| `bg-surface-low` | `#0B0B0B` | Default widget containers, inactive sections. |
| `bg-surface-mid` | `#121212` | Active widget backgrounds, card bodies. |
| `bg-surface-high` | `#1A1A1A` | Popovers, tooltips, hover states on cards. |
| `border-dim` | `#1F1F1F` | Grid lines, subtle separators, inactive borders. |
| `border-med` | `#2A2A2A` | Default component borders, input outlines. |
| `border-bright` | `#3F3F3F` | Focused borders, dividers in high-active areas. |

### 2.2 Semantic & Accent Palette
| Token Name | HEX | Functional Meaning |
| :--- | :--- | :--- |
| `brand-primary` | `#2563EB` | Interactive elements, active nav, primary CTAs. |
| `status-bull` | `#10B981` | Positive delta, Buy actions, green candles. |
| `status-bear` | `#EF4444` | Negative delta, Sell actions, red candles. |
| `status-warn` | `#F59E0B` | Low liquidity, pending orders, risk alerts. |
| `status-info` | `#3B82F6` | Informational badges, neutral news. |

### 2.3 Typographic Scale (Contrast)
| Token Name | HEX | Hierarchy |
| :--- | :--- | :--- |
| `text-primary` | `#FFFFFF` | Main headers, active tickers, primary values. |
| `text-secondary`| `#9CA3AF` | Labels, inactive text, unit descriptions (e.g., "USDT"). |
| `text-muted` | `#6B7280` | Timestamps, log metadata, placeholder text. |

---

## 3. Typography & Text Handling

### 3.1 Font Families
- **Interface Sans**: `Inter`, `-apple-system`, `sans-serif`. (Optimized for legibility at small sizes).
- **Data Mono**: `JetBrains Mono`, `IBM Plex Mono`, `monospace`. (Strictly for all numbers, prices, and tickers to prevent "jumping" during data updates).

### 3.2 Font Weight Scale
- `Regular`: 400 (Secondary text).
- `Medium`: 500 (UI Labels, buttons).
- `Semi-Bold`: 600 (Section headers).
- `Bold`: 700 (Primary price displays).

### 3.3 Text Hierarchy
| Level | Size | Weight | Color |
| :--- | :--- | :--- | :--- |
| **Widget Header** | 14px | 600 | `text-primary` |
| **Data Label** | 11px | 500 | `text-secondary` |
| **Table Row** | 12px | 400 | `text-primary` |
| **Large Price** | 22px | 700 | `text-primary` (Mono) |
| **Small Metadata** | 10px | 400 | `text-muted` |

---

## 4. Spacing, Layout & Elevation

### 4.1 The 4px Scale
PANDA uses a strict **4px baseline grid**.
- `space-xs`: 4px
- `space-sm`: 8px (Default gutter/gap)
- `space-md`: 16px (Widget internal padding)
- `space-lg`: 24px
- `space-xl`: 32px

### 4.2 Layout Architecture
- **Sidebar Width**: 64px (Icon-only collapsed), 200px (Expanded).
- **Top Header Height**: 48px.
- **Bottom Status Height**: 28px.
- **Gutter Width**: 8px fixed spacing between all dashboard modules.

### 4.3 Elevation & Shadows
- **Level 0 (Base)**: `#000000` (No shadow).
- **Level 1 (Widget)**: `#0B0B0B` background + 1px border `#1F1F1F`.
- **Level 2 (Modal/Popover)**: `#1A1A1A` background + Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.5)`.

---

## 5. UI Components Detail

### 5.1 Border Radius
- **Container**: 8px
- **Component (Button/Input)**: 6px
- **Tag/Indicator**: 4px

### 5.2 Interactive States
- **Hover**: Background shifts one level higher (e.g., `bg-surface-mid` -> `bg-surface-high`).
- **Active/Selected**: Border changes to `brand-primary`.
- **Disabled**: Opacity reduced to 40%; `cursor: not-allowed`.
- **Focus**: `outline: 2px solid #2563EB; outline-offset: 1px`.

### 5.3 Buttons
- **Primary**: Solid `brand-primary`, white text.
- **Secondary**: `bg-surface-high`, white text, `border-med`.
- **Ghost**: Transparent bg, `text-secondary`, border only on hover.

---

## 6. Data Visualization Standards

### 6.1 Chart Styling
- **Grid Lines**: `border-dim` (`#1F1F1F`), dashed or ultra-thin solid.
- **Candlestick Bull**: Body `#10B981`, Wick `#10B981`.
- **Candlestick Bear**: Body `#EF4444`, Wick `#EF4444`.
- **Volume Bars**: Same color as candle but with 30% opacity.

### 6.2 Data Tables (High Density)
- **Row Height**: 32px (standard), 24px (compact).
- **Header Row**: Sticky, `bg-surface-low`, `text-secondary`, 11px font.
- **Row Hover**: Background `#1A1A1A` highlight.
- **Cell Alignment**: Text left-aligned; Numbers/Currency right-aligned (using Data Mono).

---

## 7. Iconography Specs
- **Library**: Lucide Icons or custom SVG set.
- **Stroke**: 1.5px to 2px.
- **Size**: 18px (standard), 14px (inline).
- **Color**: Default `text-secondary`. On hover/active `text-primary` or `brand-primary`.

---

## 8. Z-Index Registry
- **Base UI**: 1
- **Sticky Headers**: 10
- **Overlay/Sidebar**: 100
- **Dropdowns/Tooltips**: 1000
- **Modals/Dialogs**: 5000
- **Global Toast Alerts**: 9999

---

## 9. Responsive Breakpoints
- **Desktop (XL)**: >1440px (Full multi-column dashboard).
- **Desktop (MD)**: 1024px - 1440px (Adaptive widget resizing).
- **Tablet**: 768px - 1023px (Sidebar collapses, single-column widgets).
- **Mobile**: <768px (Mobile navigation, vertical stack only).

---

## 10. Implementation Blueprints for LLMs

### 10.1 Tailwind CSS Configuration Snippet
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        panda: {
          base: '#000000',
          surface: { low: '#0B0B0B', mid: '#121212', high: '#1A1A1A' },
          border: { dim: '#1F1F1F', med: '#2A2A2A', bright: '#3F3F3F' },
          brand: '#2563EB',
          bull: '#10B981',
          bear: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      }
    }
  }
}
```

### 10.2 Common UI Patterns
- **The "Widget" Pattern**: A container with `bg-surface-mid`, `border-med`, and `rounded-lg`. Headers within widgets should have a bottom `border-dim`.
- **The "Data Row" Pattern**: Used in Orderbooks. A flex container with `justify-between`, `items-center`, and `px-md`. Use `hover:bg-surface-high`.
- **The "Status Badge" Pattern**: Small font (10px), semi-bold, 4px radius, with a background color at 15% opacity and matching text color at 100% opacity.

---
*Generated for: PANDA Terminal Engineering Teams*
