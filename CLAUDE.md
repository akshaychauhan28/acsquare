# AC Square website

Static one-page site. No build step, no framework, no dependencies. Open `index.html` in a browser.

## Files
- `index.html` — all page content and copy, in section order: header, hero, why now, what we do, placement (phone mockup), about, FAQ, contact, footer.
- `css/styles.css` — all styles. Brand tokens (colours, font, spacing) live in `:root` at the top. Sections are numbered to match the comment index at the top of the file.
- `js/main.js` — interactions. Editable data sits in the CONFIG block at the top:
  - `CONTACT_EMAIL`: public contact email shown on the page (footer/contact-direct)
  - `FORM_ENDPOINT`: Formspree endpoint the contact form posts to
  - `ROTATE_EVERY`: hero rotation speed in ms
  - `HERO_EXAMPLES`: the rotating trades plus their example question and three names
- `assets/` — `panel.png` (image in the phone mockup ad) and `logo/` (SVG + PNG logo and favicons).

## Conventions
- Use CSS custom properties from `:root`. Don't hard-code new colours.
- Mobile first: layouts use flex-wrap/grid and reflow. Breakpoints are 860px (nav becomes a menu), 820px (phone section stacks), 700px (sticky CTA shows) and 560/520/480px (small phones).
- Tap targets are at least 44px.
- Class names are plain BEM-ish (`.platform`, `.platform-name`). No utility framework.
- FAQ content lives in the HTML (`#faq-source`). JS turns it into a chat, and without JS it shows as a plain list.
- The contact form posts to Formspree (`FORM_ENDPOINT` in `js/main.js`), via `fetch` in `initContact()`. The form's `action`/`method` attributes in `index.html` point at the same endpoint as a no-JS fallback (native POST, redirects to Formspree's default thank-you page). Notification emails land wherever the Formspree account is configured to send them — that's set on formspree.io, not in code.

## Brand
- Name: AC Square. Tagline: "The Next Square in Advertising".
- Logo: 2×2 grid, three ink squares and a teal bottom-right square (`assets/logo/ac-square-mark.svg`).
- Colours: ink `#101413`, teal `#0E7C6B`, mint `#4FD1B4` (on dark), paper `#FBFBFA`.
- Font: Public Sans (Google Fonts).
- Founders: Akshay Chauhan (builds and runs every campaign), Aryan Chopra (strategy & client relationships).
- Contact: 437-688-3515 · ac36693@gmail.com · Ottawa, Ontario.
