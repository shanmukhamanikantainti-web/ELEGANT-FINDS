# Design System Specification: High-End Editorial & Soft Minimalism

## 1. Overview & Creative North Star: "The Digital Atelier"

The Creative North Star for this design system is **"The Digital Atelier."** We are not building a standard storefront; we are crafting a curated editorial experience that blends the high-precision luxury of European fashion with the "soft-touch" minimalism and playful charm of modern Korean UI design. 

To achieve an "expensive" feel for affordable products, we must move away from the rigid, boxed-in nature of traditional eCommerce. This system breaks the "template" look through:
*   **Intentional Asymmetry:** Utilizing staggered grid layouts for product galleries to create a sense of movement.
*   **Vast Negative Space:** Allowing elements to "breathe" far more than standard retail density allows.
*   **Overlapping Elements:** Floating high-resolution product imagery over soft glass containers to create a 3D, layered physical presence.

---

## 2. Colors & Tonal Depth

Our palette is rooted in a sophisticated interpretation of femininity—moving away from neon "hot pinks" into a world of "Petal & Light."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. Use `surface-container-low` (#f3f3f3) against a `surface` (#f9f9f9) background to define areas.

### Color Tokens
*   **Primary (The Signature):** `#b7046c` (Used for critical brand moments and high-contrast text).
*   **Primary Container (The Energy):** `#ff4fa3` (Used for vibrant accents and CTAs).
*   **Secondary Container (The Softness):** `#fec0d9` (The "Korean Pink" base for soft UI elements).
*   **Surface Hierarchy:** 
    *   `surface-container-lowest`: `#ffffff` (Floating cards)
    *   `surface`: `#f9f9f9` (Main canvas)
    *   `surface-container-high`: `#e8e8e8` (Subtle depth)

### The "Glass & Gradient" Rule
To elevate the UI beyond a "flat" app, apply a **Backdrop Blur (12px - 20px)** on elements like navigation bars or floating action menus. Use a subtle linear gradient for main CTAs transitioning from `primary` (#b7046c) to `primary_container` (#ff4fa3) at a 135-degree angle to provide visual "soul."

---

## 3. Typography: The Editorial Contrast

The typographic identity relies on the tension between a high-contrast, classic serif and a hyper-legible, modern sans-serif.

*   **The Display Voice (Noto Serif):** Used for Headlines and High-level branding. The serif conveys authority, luxury, and a "Vogue-esque" editorial feel. 
    *   *Usage:* `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to feel premium.
*   **The Utility Voice (Plus Jakarta Sans):** Used for body text, titles, and labels. This geometric sans-serif brings the "Korean Minimalist" vibe—clean, round, and approachable. 
    *   *Usage:* `body-md` (0.875rem) with generous line-height (1.6) to ensure the layout feels airy and readable.

---

## 4. Elevation & Depth: Tonal Layering

We avoid the "card-on-gray-background" cliché. Depth is achieved through the **Layering Principle.**

*   **Tonal Stacking:** Place a `surface-container-lowest` (#ffffff) card on a `surface` (#f9f9f9) section. The difference is barely perceptible but enough to signal importance without visual clutter.
*   **Ambient Shadows:** For "floating" elements (e.g., a "Quick Buy" modal), use a signature shadow: 
    *   *Shadow Token:* `0px 20px 40px rgba(183, 4, 108, 0.06)` (A soft, tinted shadow that mimics pink-hued ambient light).
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use the `outline_variant` (#dfbec8) at **20% opacity**. It should be a suggestion of a line, not a hard stop.
*   **Refined Roundedness:** 
    *   Small UI (Buttons, Inputs): `md` (0.75rem / 12px)
    *   Large UI (Cards, Banners): `xl` (1.5rem / 24px)
    *   Full Rounding: For "Chip" style elements and badges.

---

## 5. Component Philosophy

### Buttons: The Tactile Interaction
*   **Primary:** A gradient-filled container (`primary` to `primary_container`) with `on_primary` text. No shadow on idle; a "glow" shadow on hover.
*   **Secondary:** Ghost-style. No background. `primary` text with a `primary_fixed` underline that expands on hover.
*   **Corner Radius:** Always `xl` (24px) for a soft, friendly touch.

### Cards & Product Grids
*   **Constraint:** Forbid the use of divider lines.
*   **Style:** Use `surface-container-lowest` containers. Imagery should have a `12px` internal padding from the card edge to create a "framed" look, or go full-bleed with `24px` top corners.
*   **Micro-interaction:** On hover, the image should subtly scale (1.05x) while the card container gains a soft glassmorphism overlay.

### Input Fields: The Soft Input
*   **Base:** Background `surface_container_low`, `0px` border. 
*   **Active State:** A `1px` "Ghost Border" appears in `primary`, and the background shifts to `surface_white`.
*   **Typography:** Labels use `label-md` in `on_surface_variant`.

### Floating Glass Navigation
*   The primary navigation should be a floating "dock" at the bottom or a blur-anchored header at the top. Use `surface` at 80% opacity with a `20px` backdrop blur.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 5% left, 10% right) in editorial sections to break the grid.
*   **Do** use "On-Surface" tinted colors for text (never pure #000000). Use `on_surface` (#1a1c1c).
*   **Do** prioritize white space over information density. If it feels "full," remove an element.

### Don’t:
*   **Don't** use 1px solid black or grey borders. This immediately destroys the premium feel.
*   **Don't** use harsh drop shadows. If it looks like a "box shadow," it’s too heavy. It should look like "light displacement."
*   **Don't** use standard "Select" or "Radio" components. Custom-build them using the rounded scale and soft-pink fills to maintain the "Korean Minimalist" charm.
*   **Don't** use icons with sharp corners. Every icon must be "Rounded" or "Outline-Rounded" to match the `12px-24px` corner logic.
