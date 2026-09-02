# Kurogi — Sushi Restaurant Platform

A full-stack restaurant platform built to practice production-style engineering: a public ordering/booking site plus a role-gated admin dashboard, backed by an API that treats every client-sent number as untrusted until proven otherwise.

**Live site:** [resto-snowy.vercel.app](https://resto-snowy.vercel.app)
Built solo as a portfolio project to go deep on the parts of full-stack development that tutorials usually skip: concurrency-safe writes, server-side trust boundaries, and role-based access enforced on both ends of the stack.

---

## What it does

**Public site**
- Browse a multilingual menu (English / French / Arabic, including RTL layout for Arabic) with category filtering
- Book a table with live availability per time slot
- Order food for pickup or delivery, cash on delivery, with a WhatsApp confirmation handoff
- Guests can self-cancel a booking or order via a private, token-based link — no account required anywhere on the public site

**Admin dashboard**
- Two roles: **owner** (full access) and **staff** (bookings/orders only, no menu or settings access)
- Menu editor with three-language fields per item, category management, image upload
- Delivery zone pricing by wilaya
- Live bookings/orders management with status updates
- Restaurant settings (hours, contact, socials) and staff account management
- Dashboard access sits behind a private entry URL rather than a discoverable `/admin` path

---

## Tech stack

**Frontend:** React (Vite), React Router, Tailwind, GSAP for scroll animation, i18next
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JWT in an httpOnly, sameSite cookie — no tokens touch localStorage
**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas

---

## Technical decisions worth highlighting

A few things in this codebase were deliberate engineering choices, not defaults:

**Booking capacity is enforced atomically, not check-then-write.**
A naive implementation reads current bookings for a slot, checks if there's room, then creates the booking as a second step — which leaves a race window where two concurrent requests can both pass the check and both get confirmed for the last spot. Capacity is instead reserved with a single `findOneAndUpdate` that folds the check and the increment into one atomic database operation, so two simultaneous bookings for the last table can never both succeed.

**Nothing about price is trusted from the client.**
Cart contents sent from the browser are `{ menuItemId, quantity }` only — never a price. The order total is recomputed entirely server-side from the live `MenuItem` documents at checkout, including rejecting sold-out items even if the frontend UI is bypassed and the endpoint is hit directly.

**Role access is enforced twice, deliberately.**
The dashboard UI hides owner-only sections from staff, but that's a UX convenience, not the actual boundary — every owner-only route is independently protected by `authorize('owner')` server-side, verified against the JWT, regardless of what the frontend shows or hides.

**The admin dashboard's private URL is obscurity, not access control.**
Hiding the dashboard behind a non-guessable entry path stops casual discovery, bots, and scanners from ever finding it — but it doesn't grant or deny anything by itself. Real access control is the httpOnly cookie and the role checks above; the private URL is a defense-in-depth layer on top, not a substitute.

---

## Known limitations

Being upfront about the current gaps rather than hiding them:

- **No automated tests yet** — being added as a follow-up (see project notes).
- **Uploaded images are not persistent.** Files are stored on Render's local disk, which is wiped on every redeploy. A production version of this would use Cloudinary or S3 instead of local storage.
- **Render free tier cold starts.** The backend spins down after 15 minutes of inactivity; the first request afterward is slow while it wakes up. Not an application bug — a known trade-off of free hosting.
- **No CI/CD pipeline currently.** Deployment is manual (push → Vercel/Render auto-build). A basic GitHub Actions workflow is a planned addition.

---

## Why these choices, briefly

This project started as an exercise in shipping a complete product (menu, cart, booking, checkout, multi-role admin) rather than a single isolated feature — and along the way became more about *where the trust boundaries actually are* than about the UI. Almost every "interesting" decision above exists because something naive was tried first, broke under a specific scenario (a race condition, a tampered price, a role check that only lived in the frontend), and got fixed at the layer where it actually needed to live.
