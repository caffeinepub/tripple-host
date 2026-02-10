# Specification

## Summary
**Goal:** Add admin authentication and an admin interface so authorized users can manage pricing plans stored in the backend.

**Planned changes:**
- Implement admin authorization in the Motoko backend using Internet Identity principals, including a bootstrap flow for the first admin and admin-only methods to manage the admin allowlist.
- Move pricing plan definitions into backend-managed stable state with public read access and admin-only CRUD methods (create/update/delete), initialized to the current Starter and Iron plans on fresh deploy.
- Add Internet Identity sign in/out controls to the frontend header and only show an Admin entry point when the logged-in principal is an admin.
- Build an admin UI to add, edit, and delete pricing plans with basic validation and clear English success/error states, persisting changes via the backend.
- Update the landing Pricing section to fetch and render backend-provided plans in the existing layout, with loading text and a safe fallback to the current frontend copy if fetching fails.

**User-visible outcome:** Visitors see the Pricing section populated from backend data (with loading/fallback behavior), and signed-in admins can access an Admin UI to manage pricing plans without changing frontend code.
