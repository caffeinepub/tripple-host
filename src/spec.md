# Specification

## Summary
**Goal:** Make the Reviews section easy to find from the header navigation and restore a reliable admin management experience with correct admin entry points in the header.

**Planned changes:**
- Add a visible “Reviews” navigation link to both desktop and mobile header navigation that navigates/scrolls to the existing landing page section with id="reviews", using centralized copy config (frontend/src/content/siteCopy.ts) for labels/targets rather than hardcoding in Header.tsx.
- Fix/restore the admin allowlist management in the Admin Panel so admins can view current admin principals, add a new principal, and remove an existing principal with clear English success/error messages and immediate UI refresh after each change.
- Update header admin entry points to reflect backend state: show “Set up admin access” only when no admins exist yet; show “Admin” only to signed-in admins; hide these options when conditions are not met.

**User-visible outcome:** Users can reach the landing-page Reviews section from the header on desktop and mobile, and admins can reliably manage admin access (add/remove/list) with immediate updates while the header shows the correct admin/setup actions based on actual backend admin state.
