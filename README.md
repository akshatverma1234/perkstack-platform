# Perkstack

**Exclusive SaaS benefits for early-stage startups**

Perkstack is a startup benefits and partnerships platform designed to help early-stage teams, founders, and indie hackers access premium SaaS tools at a fraction of the usual cost. The platform focuses on clarity of flow, strong access control, and a high-quality, motion-driven user experience.

---

## 📌 Business Context

Early-stage startups often struggle to afford essential SaaS tools such as cloud infrastructure, marketing platforms, analytics software, and productivity systems. Perkstack bridges this gap by partnering with SaaS providers to offer curated, startup-only benefits.

Some deals are publicly accessible, while others are restricted and require verification to preserve partner value.

---

## 🔁 End-to-End Application Flow

### Landing & Discovery

Users arrive on a premium SaaS-style landing page featuring motion-driven storytelling and a clear value proposition. Public content is accessible without authentication.

### Authentication

Users register or log in using a JWT-based authentication system. The UI provides clear loading and error feedback during the process.

### Deals Marketplace

Authenticated users can browse all available deals. The interface supports search and filtering by category and access level (locked / unlocked).

### Access Control & Verification

Certain deals are marked as **Locked**. For this assignment, access control is enforced at the API level based on deal properties and user eligibility. In a production system, this would be extended to include startup verification workflows.

### Claiming a Deal

Eligible users can claim a deal directly from the deal details page. The backend validates eligibility and prevents duplicate claims.

### Dashboard & Management

Claimed deals appear in the user dashboard with status tracking (e.g., pending, approved) and associated claim metadata.

---

## 🔐 Authentication & Authorization Strategy

### Backend

- JWT-based authentication using `jsonwebtoken`
- Password hashing with `bcryptjs`
- Tokens include essential user metadata (`userId`, `role`)
- Protected routes are guarded using Express middleware that validates token integrity and expiration

### Frontend

- JWT stored in `localStorage` (noted as a limitation)
- Centralized Axios instance automatically attaches the Bearer token to authenticated requests
- UI elements (Navbar actions, protected pages) respond to authentication state

---

## 🔄 Internal Flow: Claiming a Deal

1. User clicks **“Claim Deal”** on the frontend
2. Frontend sends `POST /api/deals/:id/claim` with the JWT token
3. Authentication middleware validates the token
4. Controller retrieves the Deal and User from MongoDB
5. Validation logic checks:
   - Deal existence
   - Deal access level (locked vs unlocked)
   - Whether the user has already claimed the deal
6. If valid, a new `Claim` document is created
7. The API returns the claim details
8. Frontend updates UI state and reflects the claim in the Dashboard

---

## 🔗 Frontend ↔ Backend Interaction

### API Layer

A centralized Axios client (`lib/api.ts`) manages:

- Base URL configuration
- Authorization headers
- Error propagation

### Frontend State Flow

- Component-level state manages loading, success, and error states
- Data fetching occurs via `useEffect` hooks
- Navigation handled using Next.js App Router

---

## 🎨 UI, Motion & Performance Decisions

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS for fast iteration and consistent design tokens

### Motion

- Page-level and component-level animations implemented using `motion`
- Scroll-based text reveals are used only for long-form storytelling content
- Critical UI actions (auth, CTAs) avoid heavy animation for clarity and speed

### Visual Design

- Glassmorphism and backdrop blur used selectively
- Motion is intentionally restrained to avoid overwhelming the user

---

## ⚠️ Known Limitations

### Token Storage

JWTs are stored in `localStorage`, which is vulnerable to XSS. This was chosen for simplicity within the assignment scope.

### Verification Logic

The concept of locked deals is implemented, but real startup verification (documents, domain checks, KYC) is intentionally simplified.

### Scalability

MongoDB connection management relies on default Mongoose behavior. High-scale production systems would require additional tuning and monitoring.

---

## 🚀 Improvements for Production Readiness

- Move authentication to HttpOnly cookies
- Add request validation using Zod
- Introduce rate limiting and abuse protection
- Implement structured logging and monitoring (e.g., Sentry)
- Add caching and background revalidation for deal data
- Extend verification workflows with real startup validation

---

## 🧠 Design Philosophy

This project prioritizes:

- Clear user flows over feature volume
- Explicit access control and validation
- Motion as a tool for clarity, not decoration
- Code readability and separation of concerns

## Deployment

The frontend is deployed on Vercel using the Next.js App Router.
The backend is deployed separately and accessed via environment-based API configuration.

Environment variables are used to switch between local and production APIs.


Perkstack is intentionally scoped to demonstrate full-stack reasoning, not to simulate a production-scale platform.
