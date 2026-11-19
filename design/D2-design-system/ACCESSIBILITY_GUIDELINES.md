# ACCESSIBILITY GUIDELINES (D2)
**Typing Trainer — Windows Desktop Application**
*Document Version: 1.0.0 | Stage: D2 Design System*

---

## 1. Compliance Standard: WCAG 2.2 Level AA

Typing Trainer is engineered to provide an accessible, fatigue-free experience for typists of all physical abilities, sensory needs, and neurodivergent profiles.

---

## 2. Accessible Focus Architecture

1. **Persistent Visual Focus:** All interactive elements feature a high-contrast 2px focus ring with a 2px offset:
   - Dark Theme: `outline: 2px solid #3B82F6; outline-offset: 2px;`
   - Light Theme: `outline: 2px solid #2563EB; outline-offset: 2px;`
2. **Predictable Tab Navigation Order:** The tab sequence proceeds linearly: Window Controls $\rightarrow$ Sidebar Navigation $\rightarrow$ Utility Bar $\rightarrow$ Content Canvas Action Buttons $\rightarrow$ Status Bar.
3. **Modal Focus Trapping:** When dialogs (`SCR-002` Command Palette, `SCR-003` Pause Menu) are open:
   - Initial focus lands on the primary input or first action.
   - `Tab` cycles exclusively within the modal boundary.
   - `Esc` immediately closes the dialog and returns focus to the triggering element.
4. **Typing Focus Capture:** In active typing modes, keystrokes are captured exclusively by the typing engine. Accidental presses of `Space` do not scroll the viewport, and `Backspace` does not trigger browser navigation.

---

## 3. Visual Contrast & Color-Blind Defenses

### 3.1 Contrast Verification
- All text styles in both Dark and Light themes exceed WCAG 2.2 AA thresholds:
  - Heading & Display text: $\ge 8.5:1$.
  - Primary Body text: $\ge 14.5:1$.
  - Muted Secondary text: $\ge 5.8:1$ (exceeding 4.5:1 standard).
  - Active button borders and focus rings: $\ge 3.8:1$.

### 3.2 Non-Color-Dependent Signifiers
Typing Trainer **never** conveys meaning through color alone:
- **Typing Errors:** Character turns red **and** gains a red wavy underline **and** triggers an optional low-pitched audio buzz.
- **Completed Lessons:** Marked with green color **and** a checkmark badge (`✓`) **and** star rating.
- **Active Navigation:** Highlighted with accent color **and** a 3px vertical border bar **and** `aria-current="page"`.
- **Streaks & Shields:** Displayed with high-contrast text numbers alongside graphical icons.

---

## 4. Screen Reader (NVDA, JAWS, Narrator) Support

- **Typing Stream Mute Rule:** Active character-by-character typing uses `aria-live="off"`. Screen readers cannot verbalize 100+ WPM without causing audio chaos.
- **Session Results Announcement:** Upon test completion, `SCR-203` announces the final metrics cleanly via an `aria-live="polite"` container:
  > *"Test complete. Net Speed: 104 words per minute. Accuracy: 98.8 percent. 2 keystroke errors."*
- **Accessible Tooltips:** All icon-only buttons (theme toggle, sound toggle, sidebar collapse) carry explicit `aria-label` tags.

---

## 5. Cognitive & Sensory Comfort Controls

- **Reduced Motion:** When Windows "Show animations" is toggled off:
  - Spring-glide caret translation is replaced with instant coordinates.
  - Dialog scaling and fade animations are disabled.
  - Arcade game floating particle effects are disabled.
- **Zen Focus Mode (`Ctrl + H`):** Hides live WPM and accuracy counters during tests, mitigating performance anxiety and sensory overload for neurodivergent typists.
