# DESIGN SYSTEM DECISIONS & TRADE-OFFS (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Decision Log

### Decision 01: Color Palette Calibration — "Midnight Slate" & "Daylight Studio"
- **Context:** Deciding on the primary canvas colors for both Dark and Light themes.
- **Decision:**
  - *Dark Theme:* Selected deep obsidian/slate (`#0B0F19`) rather than pure black (`#000000`). Pure black creates extreme optical glare when paired with high-contrast text and neon accents, leading to eye strain over 30-minute practice sessions. Deep slate softens contrast while preserving a gaming feel.
  - *Light Theme:* Selected cool off-white (`#F8FAFC`) with soft slate card surfaces (`#FFFFFF` and `#F1F5F9`) rather than stark `#FFFFFF` background. Prevents dazzling glare while maintaining pristine clarity.

### Decision 02: Dual Typography Strategy — Inter + JetBrains Mono
- **Context:** Selecting typographic families for desktop UI vs. typing surfaces.
- **Decision:**
  - Standardized on `Inter` for all UI chrome (navigation, dialogs, buttons) due to its outstanding legibility and modern geometric weight distribution.
  - Standardized on `JetBrains Mono` for all typing streams, code syntax, and numeric HUD statistics.
  - *Key Benefit:* Tabular figures (`tabular-nums`) eliminate horizontal layout jitter when WPM numbers and countdown timers update at 60 FPS.

### Decision 03: Pastel Mechanical Keyboard Aesthetics
- **Context:** Choosing the visual identity of the on-screen virtual keyboard.
- **Decision:** Adopted a custom 65% mechanical keyboard aesthetic with soft pastel finger-zoning keycaps (Soft Mint, Soft Cream, Soft Rose, Soft Lavender) on a dark chassis.
- *Rationale:* Standard monochrome keyboards feel clinical and dull. Overly aggressive neon cyber keyboards look childish. Pastel keycaps look modern, artistic, and inviting, while clearly communicating tactile finger placement zones without visual aggression.

### Decision 04: Realistic Human Hand Anatomy over Stylized 3D
- **Context:** How to illustrate hand positioning and finger reach.
- **Decision:** Mandated anatomically accurate human hand posture (correct wrist neutrality, natural gentle curve of fingers, exact anchor points on `F` and `J`).
- *Rationale:* Touch typing is a physical discipline. Cartoon gloves or distorted 3D models teach improper ergonomic habits that can contribute to repetitive strain injury (RSI).

### Decision 05: Elevation via Surface Lightness and Luminous Borders
- **Context:** How to express visual hierarchy in a dark gaming desktop environment.
- **Decision:** In Dark Theme, cards and popovers express elevation by stepping up from `#0B0F19` $\rightarrow$ `#131B2E` $\rightarrow$ `#1E293B`, accompanied by subtle 1px border outlines and luminous accent glows rather than heavy black drop shadows. In Light Theme, standard soft ambient shadows are utilized.

### Decision 06: Drop-In Alignment with Tailwind CSS & shadcn/ui
- **Context:** Ensuring 100% implementation feasibility without inventing proprietary UI paradigms.
- **Decision:** Every token and component maps 1:1 with standard Tailwind utility classes and shadcn/ui primitives. Radix UI accessibility attributes (`aria-*`, `data-state`) are baked into all component specifications.
