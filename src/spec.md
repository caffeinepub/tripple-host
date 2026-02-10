# Specification

## Summary
**Goal:** Restore Version 7 parity in the current Version 8 build, focusing on reliable admin access/bootstrap, admin management tooling, and CTA label consistency.

**Planned changes:**
- Restore missing/broken Version 7 end-user and admin-facing flows in Version 8, prioritizing the admin entry/access experience (Admin entry point, Admin Panel access, and Admin Setup when no admins exist).
- Reinstate Admin Panel management areas for pricing plans CRUD, site content customization, and logo upload/replace, with clear English success/error states.
- Add a backend query to reliably determine whether any admins exist and update the frontend to use it for admin bootstrap and correct Header button visibility.
- Restore website-based admin allowlist management: Admin Panel section to view/add/remove admin principals, persisted and enforced by the backend (admin-only writes).
- Rename all site-wide “Talk to Sales” labels to “Purchase Plans” while preserving the existing behavior of opening https://discord.gg/NMcBdXYVFe in a new browser tab.

**User-visible outcome:** Admins can again access the Admin Panel from the Header to manage plans, content, logos, and the admin list; first-time setups can claim the first admin role when no admins exist; non-admin users retain normal signed-in/profile functionality and see a clear access-denied message when attempting admin-only actions; the CTA now reads “Purchase Plans” and still opens the same Discord link.
