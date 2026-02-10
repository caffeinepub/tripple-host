# Specification

## Summary
**Goal:** Update landing-page CTAs so the primary CTA reads “PLANS” everywhere, and make “Talk to Sales” open the provided Discord invite link.

**Planned changes:**
- Update centralized copy in `frontend/src/content/siteCopy.ts` so every UI label currently showing “Start Free Trial” displays exactly “PLANS”.
- Ensure hero and final/contact CTA sections read “PLANS” via the centralized copy (no hardcoded component text).
- Change the “Talk to Sales” button click behavior to open `https://discord.gg/NMcBdXYVFe` in a new tab with safe external-link handling (e.g., `noopener,noreferrer`), while keeping its current outline styling and label.

**User-visible outcome:** Users see “PLANS” as the primary CTA label across the landing page, and clicking “Talk to Sales” opens the Discord invite in a new browser tab.
