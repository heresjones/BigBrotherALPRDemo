# BigBrotherALPRDemo

Demo ALPR (Automated License Plate Recognition) pipeline: an AWS serverless
backend, a local TypeScript React dashboard, and a basic Android app for
uploading vehicle photos.

Deploys entirely into your own AWS account using your own local AWS
credentials and API keys — nothing here is shared or pre-provisioned.

See [`docs/PRD.md`](docs/PRD.md) for what this product does and doesn't do
(and why), and [`.claude/skills/alpr-demo-infra/SKILL.md`](.claude/skills/alpr-demo-infra/SKILL.md)
for the concrete architecture, API contract, and deploy steps.

## Current status

Only the frontend exists so far — a full SaaS shell (Overview, Vehicle
Search, Alerts, Investigations, Insights & Audit, Users & Roles, Org
Settings, plus an illustrative Sharing mock) running entirely on mock/
session data. No backend is deployed yet; see `docs/PRD.md` §8 for exactly
what's implemented vs. still just spec.

```
cd frontend
npm install
npm run dev
```
