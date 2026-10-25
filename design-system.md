# EcoBite design system

## Product surface

EcoBite is a surplus-food delivery journey focused on checkout, order tracking, and post-delivery feedback. The desktop entry point is a concise scenario picker; customer tasks run inside a mobile-first app frame. The visual language is calm, practical, and warm, using forest green for primary actions and trusted progress states.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--primary` | `#365B48` | Requested primary brand token |
| `--secondary` | `#E0F1E4` | Requested secondary brand token |
| `--background` | `#FFFFFF` | Requested app background token |
| `--text` | `#1C1C1C` | Requested primary text token |
| `--error` | `#CE4635` | Requested error accent |
| `--success-bright` | `#58C78E` | Requested success accent |
| `--brand` | `#365B48` | Primary actions, brand marks, trusted accents |
| `--brand-hover` | `#294B39` | Hovered primary actions |
| `--brand-soft` | `#E0F1E4` | Soft brand surfaces |
| `--brand-pale` | `#F1F7F1` | Tinted backgrounds |
| `--surface` | `#FFFFFF` | Cards and app surfaces |
| `--surface-soft` | `#F7F8F6` | Quiet surface backgrounds |
| `--ink` | `#1C1C1C` | Main text |
| `--muted` | `#626A65` | Secondary text |
| `--muted-light` | `#78817B` | Nonessential metadata |
| `--border` | `#E7EAE6` | Default borders |
| `--border-strong` | `#D4DBD5` | Higher-emphasis borders |
| `--danger` | `#B9382A` | Error/destructive actions |
| `--danger-soft` | `#FFF2EF` | Error surfaces |
| `--success` | `#23764A` | Success text and progress |
| `--success-soft` | `#EAF6EE` | Success surfaces |
| `--warning` | `#835518` | Delay and refund status |
| `--warning-soft` | `#FFF7E8` | Warning surfaces |
| `--focus` | `#176B9C` | Keyboard focus ring |

The requested palette is preserved as exact tokens. Accessible text variants use darker `--danger` and `--success` values where the brighter accent colors would not provide sufficient text contrast. Brand and semantic colors are implemented in `src/styles.css` as CSS custom properties. Text and component contrast should be checked against their actual surface before production use; this project does not claim verified WCAG conformance.

## Typography

- **Display/headings:** Inter, 600–800; checkout and feedback headings use 600, overview headings use 700–800.
- **Body/UI:** Inter, 400–700; standard body copy 14–16px, compact app text 11–13px.
- **Metadata:** Inter, 10–12px; never use metadata styling for essential instructions or status.
- Keep line-height generous for multi-line status and recovery messages. Use tabular numerals for money and status times.

## Spacing and shape

- Use a 4px base rhythm; common increments: 4, 8, 12, 16, 20, 24, 32.
- Small controls/cards: 10–12px radius. Content cards: 14–16px. Dialog/phone: 24–43px.
- Keep related data grouped inside quiet surfaces; use whitespace and headings instead of decorative dividers where possible.
- Interactive targets should be comfortably tappable (approximately 40–48px high); inline links remain visibly underlined.

## Component rules

- **Buttons:** One filled primary action per task area; secondary actions use an outline; tertiary actions are text links. Destructive actions use the danger token and require confirmation. Submitting the order disables the primary button, shows a spinner and “Placing order…” status, then proceeds or displays a recoverable payment error.
- **Fields:** Every field has a visible label. Error copy sits next to the affected control and explains how to recover. Preserve typed values through failed payment attempts.
- **Payment options:** Use a native radio group with a fieldset/legend. The selected state uses both a border/surface change and the native checked control.
- **Order summary and prices:** Keep the final total and every line item/fee visible at all times. Do not hide the breakdown in an accordion.
- **Expandable sections:** Use native buttons with `aria-expanded`; show an obvious affordance and preserve focus.
- **Alerts:** Pair semantic color with text and an icon/label. Use `role="alert"` for blocking errors and status/live regions for meaningful updates.
- **Dialogs:** Use native `<dialog>`/`showModal()` for modality, Escape behavior, and focus containment. Restore focus to the selected scenario card on close.
- **Tracking:** Always show a readable status, ETA, and textual timeline in addition to the illustrative map. Keep order details visible below the timeline; status titles use no leading icons.
- **Chats:** Courier messaging and human support have separate screens and context labels. The local interaction is explicit that no live participant is connected. Quick replies are optional and messages can also be typed and sent.
- **Feedback:** Use a keyboard-operable five-star radio group. Rating is required; category chips and comment are optional. Provide an explicit confirmation state and skip action.
- **Problem reports:** Present the report form in a scrollable, keyboard-contained bottom sheet. Require a native radio selection, allow optional detail, announce validation and confirmation, and offer human support from the report flow.
- **Address editing:** Keep the saved address read-only in checkout. Open a bottom sheet with separate street, apartment, city, state, and ZIP fields; validate required fields and return focus to Edit on save or close.
- **Loading/success/error/pending:** Communicate state in text. No color-only status communication or simulated payment credential collection.

## Accessibility and interaction

- Target WCAG 2.2 AA as an implementation goal; do not claim conformance without automated and manual testing.
- Use semantic landmarks, logical heading order, native buttons and controls, explicit form labels, and descriptive accessible names.
- Maintain visible `:focus-visible` treatment, keyboard access to every action, and focus containment/restoration for dialogs and the address sheet.
- Announce meaningful status/error changes with live regions without repeatedly announcing decorative progress.
- Keep order updates, chat, and errors available as text; never rely on sound alone. Chat messages and report confirmations are exposed through readable/live content for screen-reader and deaf/hard-of-hearing users.
- Pair all map information with text. Respect reduced-motion preferences, support small viewports/reflow, and do not use color as the only state indicator.
- Keep destructive cancellation behind a clear eligibility explanation and a separate confirmation action.
- During order submission, disable the primary action, show a spinner and the text “Placing order…”, and prevent duplicate submits. For a slow connection, keep the checkout data visible and announce that the request is taking longer; honor reduced-motion preferences for the spinner.

## Scenario behavior

Journeys use local React state and fixed, realistic order data; no payment credentials or payment processor are used. Payment failures, unavailable payment methods, network interruption recovery, slow-network reassurance, wrong-address correction, restaurant cancellations, timed status transitions, delivery delay/issue recovery, courier/support chat replies, cancellation/refund progression, problem reports, and feedback submission are front-end simulations. The app does not connect to a live courier or support agent. Delivery status and refund state advance automatically; issue recovery and cancellation remain user-controlled. The cancellation scenario begins while the order is still eligible for cancellation; the normal tracking journey exposes support when cancellation is no longer available.
