# Startup Benefits Platform

A premium SaaS benefits platform designed for startups to access exclusive deals and discounts.

## End-to-End Application Flow

1. **Onboarding**: Users arrive at the Landing Page, greeted by a high-performance, animated hero section. They can explore the value proposition or proceed to registration.
2. **Authentication**: Users sign up or log in using the secure JWT-based auth system. The UI provides real-time feedback and validation.
3. **Discovery**: Authenticated users browse the Deals Marketplace. They can search by keywords or filter by categories. Deals are presented with rich visuals and key information.
4. **Verification**: Some deals are "Locked". In a production environment, this would require KYC or startup verification. Currently, the system checks if the deal is locked and manages access permissions.
5. **Claiming**: Users view deal details and click "Claim". The system validates eligibility (e.g., ensuring not already claimed) and generates a unique license key.
6. **Management**: Users track their claimed deals, status, and license keys in the robust Dashboard.

## Authentication & Authorization Strategy

- **Backend**: Implemented using `jsonwebtoken` (JWT) and `bcryptjs`.
  - Passwords are hashed before storage.
  - JWTs are signed with a secret and include `userId` and `role`.
  - Middleware intercepts requests to protected routes, verifying the token signature and expiration.
- **Frontend**: 
  - Tokens are stored in `localStorage`.
  - An `api` interceptor automatically attaches the Bearer token to every outgoing request.
  - Client-side checks (e.g., in Navbar) control visibility of UI elements based on auth state.

## Internal Flow of Claiming a Deal

1. User clicks "Claim Deal" on the frontend.
2. Frontend sends `POST /api/deals/:id/claim` with the user's auth token.
3. Backend Middleware verifies the user.
4. Controller fetches the Deal and User from MongoDB.
5. **Validation**:
   - Checks if the deal exists.
   - Checks if the deal is "Locked" (requires specific logic, simplified here).
   - Checks if a Claim record already exists for this User + Deal pair.
6. If valid, a new `Claim` document is created with a generated `claimCode`.
7. Response returns the Claim object.
8. Frontend updates the UI to show success and redirects to Dashboard.

## Interaction Between Frontend & Backend

- **API Layer**: The frontend uses a centralized `axios` instance (`src/lib/api.ts`) configured with the base URL and interceptors.
- **Data Flow**:
  - React components allow for local state management (loading, error, data).
  - `useEffect` hooks trigger data fetching on mount.
  - `Next.js` App Router handles client-side routing.

## Known Limitations & Weak Points

- **Security**: Storing JWT in `localStorage` is susceptible to XSS. HttpOnly cookies would be safer (requires more complex setup).
- **Verification**: The "Locked" concept is implemented but the actual business logic for unlocking (e.g., uploading documents) is mocked/simplified for this assignment.
- **Scalability**: MongoDB connection is established on server start. Connection pooling is handled by Mongoose default, but for high scale, optimization might be needed.

## Improvements for Production

1. **Security**: Move to HttpOnly cookies for auth tokens. Implement Rate Limiting on API routes.
2. **Validation**: Add Zod validation schemas for all API inputs.
3. **Performance**: Implement React Query or SWR for better caching and optimistic updates on the frontend.
4. **Resilience**: Add comprehensive error logging (e.g., Sentry).

## UI & Performance Considerations

- **Styling**: Tailwind CSS v3 used for a highly optimized, utility-first styling approach.
- **Motion**: `motion` (formerly Framer Motion) is used for declarative, hardware-accelerated animations. `layout` props are used for expensive layout thrashing avoidance updates.
- **Components**: Glassmorphism effects (`backdrop-blur`) can be performance-heavy; used selectively on high-impact areas.
- **Responsiveness**: Mobile-first design ensures functionality across all device sizes.
