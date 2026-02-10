# Specification

## Summary
**Goal:** Make Tripple Host’s Internet Computer (IC) mainnet deployment workflow reliable, fully documented, and easy to verify end-to-end.

**Planned changes:**
- Fix and complete `frontend/DEPLOYMENT.md` so it is valid, non-abrupt Markdown and provides an ordered, end-to-end mainnet deployment flow referencing `frontend/scripts/deploy-ic.sh` and `frontend/scripts/verify-deploy.sh`.
- Update `frontend/DEPLOYMENT.md` to clearly state where commands/scripts must be run from (or provide repo-root commands that work as written) and include environment setup aligned with `frontend/.env.example` (including `DFX_NETWORK=ic` and `II_URL=https://identity.ic0.app`).
- Harden `frontend/scripts/deploy-ic.sh` and `frontend/scripts/verify-deploy.sh` to be reliable when run as documented, detect incorrect invocation directory with clear English errors, and provide clear English success/failure output.
- Ensure deployment output and verification guidance includes: printing the live frontend URL as `https://<FRONTEND_CANISTER_ID>.ic0.app`, verifying canister status and HTTP accessibility (when `curl` is available), and documenting critical manual smoke tests (landing page load/no console errors, Internet Identity login/logout, initial admin claim only when no admins exist, and Admin Panel access for admins).

**User-visible outcome:** A developer can follow `frontend/DEPLOYMENT.md` to deploy the latest Tripple Host build to IC mainnet, run verification checks, see the exact live site URL, and complete the required smoke tests to confirm the deployment works.
