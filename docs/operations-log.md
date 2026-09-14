# Operations log

This is a public technical log. Business metrics and private reports belong in private storage and owner-only communication.

## 2026-09-14 — Automation setup

- Confirmed GitHub repository and Netlify production architecture. Main began at `b09919a3a837a1655ecb8ac53e4906587142355f`.
- Reviewed and merged existing Tokyo→Yokohama guide PR #12 at head `325a4ebdeab33969ab8bd87db7a4cdf7798741f9`; merge commit `0b218a199d1900f15af3e66d1255844f8c4727b5`. Required CI and deploy-preview checks passed. Official terminal/railway source review and read-only preview product checks passed.
- Added bounded public health checks, private daily click summaries, known operator-test exclusion, aggregate retention, and recurring-operation instructions.
- GSC and Viator booking/commission baselines are unavailable. Netlify connection was confirmed by the owner; an authenticated private report read is still needed.
- Production deployment, first live health run, scheduled-task IDs and private scheduled-function execution must be recorded after verification. Do not interpret this setup entry as proof of successful scheduled execution.

- First production HTTP baseline at 2026-09-14T04:15:50Z passed all 8 checks: four pages, robots, sitemap and two product endpoints. The Tokyo guide is live, indexable, self-canonical and present in the sitemap. No sponsored links were clicked.
