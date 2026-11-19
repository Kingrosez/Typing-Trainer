# COMPONENT INVENTORY (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Master Component Catalog Index

This inventory documents all 32 foundational and specialized components engineered for the Typing Trainer design system. Every component is defined with its variants, properties, and technical implementation mapping in shadcn/ui and React.

---

## 2. Core Controls & Forms (Components 01–08)

### CMP-01: Button
- **Variants:** `Primary`, `Secondary`, `Tertiary / Ghost`, `Destructive`, `Icon-Only`.
- **Sizes:** `sm` (32px), `md` (40px, default), `lg` (48px).
- **Properties:** `label`, `iconLeft`, `iconRight`, `shortcutHint` (e.g. `Tab + Enter`), `disabled`, `loading`.
- **Mapping:** shadcn/ui `Button` component with custom Tailwind variants.

### CMP-02: Input Field
- **Variants:** `Default`, `Error`, `Success`, `Disabled`.
- **Properties:** `placeholder`, `value`, `prefixIcon`, `clearable`, `helperText`.
- **Mapping:** shadcn/ui `Input`.

### CMP-03: Search Field
- **Variants:** `Header Search`, `Command Palette Search`, `Catalog Filter`.
- **Properties:** Built-in search magnifying glass icon, keyboard shortcut badge (`Ctrl + K`), instant clear button.

### CMP-04: Dropdown Menu
- **Variants:** `Single Select`, `Grouped Select with Dividers`.
- **Properties:** Radix UI `DropdownMenu` with keyboard arrow key navigation and focus trapping.

### CMP-05: Select Menu
- **Variants:** `Form Select`, `Compact Selector` (e.g., Duration: 15s / 30s / 60s).
- **Mapping:** shadcn/ui `Select`.

### CMP-06: Checkbox
- **Variants:** `Unchecked`, `Checked`, `Indeterminate`, `Disabled`.
- **Properties:** Accessible 18 × 18px checkbox with high-contrast checkmark glyph.

### CMP-07: Radio Button Group
- **Variants:** `Standard Circle`, `Pill Button Radio` (used in test mode selectors).
- **Mapping:** shadcn/ui `RadioGroup`.

### CMP-08: Toggle Switch
- **Variants:** `Small` (20px), `Standard` (24px).
- **Properties:** Smooth spring sliding dot (`checked` vs `unchecked`), ideal for "Sound Effects" and "Hand Guide" toggles.
- **Mapping:** shadcn/ui `Switch`.

---

## 3. Navigation & Structure (Components 09–11)

### CMP-09: Segmented Tabs
- **Variants:** `Underline Tabs`, `Pill Capsule Tabs` (Time, Words, Quote, Zen).
- **Properties:** Animated sliding active indicator pill.
- **Mapping:** shadcn/ui `Tabs`.

### CMP-10: Navigation Item (Sidebar Row)
- **Variants:** `Expanded Row` (208 × 40px with icon + text + count badge), `Collapsed Rail Item` (48 × 40px icon-only with tooltip).
- **States:** `Default`, `Hover`, `Active` (15% accent tint + 3px blue border), `Disabled`.

### CMP-11: Sidebar Section
- **Properties:** Group header label ("OVERVIEW", "PRACTICE ARENAS", "MASTERY") + collapsible nav list.

---

## 4. Containers, Data & Feedback (Components 12–25)

### CMP-12: Card Container
- **Variants:** `Default Surface`, `Elevated Surface`, `Interactive Hover Card` (subtle border glow).
- **Properties:** Header, Content, Footer slots.
- **Mapping:** shadcn/ui `Card`.

### CMP-13: Statistic Card (Score Card)
- **Variants:** `Hero Metric` (WPM, Accuracy), `Secondary Metric` (Raw WPM, Consistency).
- **Properties:** Large tabular value, unit badge, trend comparison pill (e.g., `+8 from avg`).

### CMP-14: Progress Bar
- **Variants:** `Continuous Linear`, `Segmented Step Bar` (Curriculum lesson progress).
- **Properties:** `value` (0–100%), `accentColor` (Electric Blue, Emerald, Amber).

### CMP-15: Circular Progress Ring
- **Variants:** `Daily Goal Ring` (Center shows "12 / 15 mins"), `Session Countdown Ring`.
- **Properties:** SVG stroke-dasharray animation with glowing endpoint dot.

### CMP-16: Badges & Tags
- **Variants:** `Neutral`, `Primary Blue`, `Success Emerald`, `Warning Amber`, `Error Red`.
- **Mapping:** shadcn/ui `Badge`.

### CMP-17: XP Progress Indicator
- **Properties:** Displays current Level number badge, current XP / next Level XP, and smooth gradient fill.

### CMP-18: Achievement Badge / Trophy
- **Variants:** `Locked` (padlock + progress meter), `Unlocked` (luminous metallic 3D icon), `Celebration Toast`.

### CMP-19: Tooltip
- **Properties:** Keyboard accelerator hint display (e.g. `"Restart Test [Tab + Enter]"`), 150ms delay, collision-aware.
- **Mapping:** shadcn/ui `Tooltip`.

### CMP-20: Modal Dialog
- **Variants:** `Standard Dialog`, `Pause Menu Dialog`, `Settings Modal`.
- **Properties:** Accessible overlay backdrop with blur (`backdrop-blur-sm`), focus trap, `Esc` dismiss.
- **Mapping:** shadcn/ui `Dialog`.

### CMP-21: Confirmation Dialog
- **Properties:** Destructive confirmation dialog (e.g., "Reset All Local Stats? This action cannot be undone.").
- **Mapping:** shadcn/ui `AlertDialog`.

### CMP-22: Toast Notification
- **Variants:** `Achievement Unlocked`, `Streak Shield Saved`, `System Notification`.
- **Properties:** Floating non-intrusive alert; auto-dismiss after 4000ms.
- **Mapping:** shadcn/ui `Sonner` / `Toast`.

### CMP-23: Empty State Display
- **Properties:** Centered SVG line illustration, title, descriptive message, primary action CTA (e.g. "Take First Test").

### CMP-24: Loading Skeleton State
- **Properties:** Shimmer placeholder matching exact card and text geometries (`w-full h-24 rounded-xl animate-pulse`).

### CMP-25: Error State Banner
- **Variants:** `Inline Alert`, `Full-Screen Local Error`.
- **Properties:** Red boundary, descriptive diagnostic text, "Retry Connection" action button.

---

## 5. Typing & Ergonomic Components (Components 26–32)

### CMP-26: Keyboard Keycap Component
- **Variants:** `Standard Alpha/Numeric` (42 × 42px), `Wide Modifier` (Shift, Enter, Tab), `Spacebar` (260 × 42px).
- **States:** `Resting`, `Target Next Key` (Luminous pulse), `Actuated / Depressed` (y + 2px spring), `Home Row Anchor` (Tactile bump).
- **Finger Colors:** Soft Mint (Index), Soft Cream (Middle), Soft Rose (Ring), Soft Lavender (Pinky).

### CMP-27: Virtual Keyboard Layout Component
- **Variants:** `QWERTY US 65%`, `QWERTY Full`, `Dvorak`, `Colemak`.
- **Properties:** Renders complete key matrix with responsive scaling and live finger placement zones.

### CMP-28: Typing Exercise Text Stream Component
- **Properties:** Container rendering lines of text with character-level DOM nodes.
- **Character Nodes:**
  - `Correct`: Emerald green text.
  - `Incorrect`: Coral red text with red wavy underline.
  - `Current`: White bold text with active floating caret.
  - `Pending`: Slate gray muted text.

### CMP-29: Live WPM Indicator
- **Properties:** Real-time speed ticker using tabular JetBrains Mono font. Supports "Hidden during test" setting.

### CMP-30: Live Accuracy Indicator
- **Properties:** Percentage calculation ($Acc = \frac{Correct}{Total} \times 100$) updated on every keystroke.

### CMP-31: Typing Timer Component
- **Variants:** `Elapsed Countdown` (e.g. `0:42`), `Progress Line` (collapsing horizontal bar at top of screen).

### CMP-32: Chart Container (Recharts Wrapper)
- **Properties:** Responsive container for WPM speed curves, accuracy heatmaps, and error spike dots with custom SVG tooltip.
