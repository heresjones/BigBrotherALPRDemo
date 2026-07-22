---
name: alpr-demo-infra
description: Defines the BigBrotherALPRDemo architecture — Terraform-provisioned AWS serverless backend, a local TypeScript React frontend, and a basic Android upload app — plus the shared data model, API contract, and local deploy process. Load before making infra, backend, frontend, or Android changes in this repo so all three components stay in sync, and before writing setup docs for a new user deploying to their own AWS account.
---

# BigBrotherALPRDemo infrastructure

Demo ALPR (Automated License Plate Recognition) pipeline: a client uploads a
photo of a vehicle, the backend reads the plate and best-effort vehicle
attributes, and stores a timestamped record. Two upload clients exist (a
local React dashboard and a basic Android app); one backend contract serves
both.

Everything is designed so a stranger can `git clone` this repo and deploy a
fully working stack into **their own** AWS account using only their own
local AWS credentials and API keys — nothing is provisioned or paid for by
the repo owner, and nothing secret is ever committed.

## Repo layout

```
BigBrotherALPRDemo/
  infra/       Terraform — all AWS resources
  backend/     TypeScript Lambda source (ingest + records handlers)
  frontend/    React + TypeScript (Vite), runs locally with `npm run dev`
  android/     Basic Kotlin app: pick/take a photo, upload it
```

## Architecture

```
Android app  ─┐
               ├─▶ POST /uploads ──▶ [ingest Lambda] ──▶ Rekognition (DetectText, DetectLabels)
React app    ─┘         │                   │
                         │                   ├──▶ S3 (store photo)
                         │                   └──▶ DynamoDB (write record)
                         │
              GET /records ◀── [records Lambda] ◀── DynamoDB (scan/filter)
```

- **API Gateway (HTTP API, v2)** — two routes, `POST /uploads` and `GET /records`.
- **Ingest Lambda** — one synchronous function does the whole ingest+process
  pipeline (accept photo → store in S3 → call Rekognition → write DynamoDB
  item → return the record). No async fan-out, no S3 event trigger. This is
  a deliberate simplification for a demo: it keeps Terraform small and keeps
  failures visible in the upload response instead of hidden in a queue.
  Revisit only if upload volume ever requires decoupling.
- **Records Lambda** — reads DynamoDB, returns records with fresh presigned
  S3 GET URLs (URLs are not stored — generate on read so they don't expire
  in the database).
- **S3 bucket** — photo storage, public access blocked, read only via
  presigned URLs.
- **DynamoDB table** (`alpr_records`) — pay-per-request, no GSIs. Table is
  small for a demo; `Scan` + in-memory filter is fine. Don't add a GSI or
  switch to Query until there's an actual reason to.

## Plate/vehicle detection: what Rekognition can and can't do

Rekognition is **not** a purpose-built ALPR product — there is no
make/model classifier. Be honest about this in code and UI rather than
faking confidence:

- **Plate text** — `DetectText`, filtered to short alphanumeric strings that
  look like plates, highest-confidence line wins. This is the OCR step.
- **Vehicle type / color** — `DetectLabels`, best-effort. Labels like `Car`,
  `Pickup Truck`, `Sedan` and sometimes a color label if present.
- **Make/model** — not populated. Store the field as `null` with a comment
  noting Rekognition has no make/model classifier, rather than omitting the
  field (frontend/Android should render "unknown", not hide the field).
  If this demo ever needs real make/model detection, that's a vendor swap
  (e.g. Plate Recognizer) behind the same ingest Lambda — don't build that
  speculatively now.

## Location

Photos are uploads, not a live camera feed, so don't rely on EXIF GPS
parsing (adds a dependency, unreliable across devices/apps). Instead the
uploading client sends `latitude`/`longitude` explicitly as part of the
upload request:
- Android app reads device location at capture time and includes it.
- React frontend (used for manual test uploads) leaves it blank or lets a
  developer type a value in — it's a test tool, not a real capture device.

Both fields are optional on the backend.

## API contract

This is the one thing all three components (backend, frontend, Android)
must agree on. If you change it, update this doc and grep for the other two
consumers in the same change.

**`POST /uploads`**
Headers: `x-api-key: <API_KEY>`
Body (JSON):
```json
{
  "imageBase64": "string, required",
  "contentType": "string, required, e.g. image/jpeg",
  "capturedAt": "string, optional ISO-8601, defaults to server time",
  "latitude": "number, optional",
  "longitude": "number, optional"
}
```
Response `200`:
```json
{
  "recordId": "uuid",
  "plateText": "string | null",
  "plateConfidence": "number | null",
  "vehicleType": "string | null",
  "vehicleColor": "string | null",
  "vehicleMakeModel": null,
  "capturedAt": "ISO-8601",
  "latitude": "number | null",
  "longitude": "number | null"
}
```
Response `401` if `x-api-key` is missing or wrong.

Clients must downscale/compress images before upload (e.g. max ~1600px,
JPEG quality ~80) to stay well under the API Gateway payload limit — this is
a client-side responsibility, the backend does not resize.

**`GET /records?plate=<optional>&limit=<optional>`**
Headers: `x-api-key: <API_KEY>`
Response `200`:
```json
{
  "records": [
    {
      "recordId": "uuid",
      "plateText": "string | null",
      "plateConfidence": "number | null",
      "vehicleType": "string | null",
      "vehicleColor": "string | null",
      "vehicleMakeModel": null,
      "imageUrl": "presigned S3 GET URL, short TTL",
      "capturedAt": "ISO-8601",
      "latitude": "number | null",
      "longitude": "number | null",
      "createdAt": "ISO-8601"
    }
  ]
}
```

## Auth model

Demo-grade only, not production: a single shared secret, not a real
identity system.

- Terraform generates the key (`random_password.api_key`) and passes it to
  both Lambdas as the `API_KEY` env var.
- Each Lambda handler checks `event.headers['x-api-key']` against
  `process.env.API_KEY` itself and returns `401` on mismatch — there is no
  API Gateway-level key/usage-plan resource. This keeps the setup portable
  across HTTP API (v2) without needing the REST API Gateway (v1) key
  machinery.
- After `terraform apply`, get the value with `terraform output -raw
  api_key` and put it in `frontend/.env.local` and the Android app's local
  config. Never commit it.

## Credentials: always the deployer's own

Nothing in this repo ever contains real AWS credentials or API keys.
- Terraform's AWS provider uses the standard credential chain (`aws
  configure`, SSO profile, or env vars) — never static keys in `.tf` files.
- `infra/terraform.tfvars.example`, `frontend/.env.example`, and an Android
  local-config example file are committed; the real
  `terraform.tfvars` / `.env.local` / local config are gitignored.
- Terraform state is local (`infra/terraform.tfstate`, gitignored) by
  default — no shared backend to configure before a first-time deploy
  works. Fine for a demo; don't add an S3 backend unless someone actually
  needs shared state.

## Deploy flow (what a new user does)

1. Prereqs: AWS account with local credentials configured, Terraform, Node
   20+, and Android Studio only if building the Android app.
2. `cd infra && cp terraform.tfvars.example terraform.tfvars` (set
   `aws_region`), then `terraform init && terraform apply`.
3. `terraform output` for `api_base_url`, and
   `terraform output -raw api_key` for the key.
4. `cd frontend && cp .env.example .env.local`, fill in the two values from
   step 3, `npm install && npm run dev`.
5. Android: copy the example local config, fill in the same two values,
   build/run from Android Studio.
6. `terraform destroy` in `infra/` when done, so nobody leaves a Lambda +
   API Gateway + DynamoDB table running on their own AWS bill.

## When making changes

- Changing the DynamoDB item shape or the API contract above means updating
  this doc plus all three consumers (ingest Lambda, records Lambda,
  frontend, Android) in the same change — don't let them drift.
- Don't add resources (queues, GSIs, Cognito, CloudFront) speculatively.
  This is a demo; add complexity only when a real requirement shows up.
- Keep the Rekognition-limitation note in `vehicleMakeModel` handling
  wherever that field is read — future contributors will otherwise "fix"
  it by inventing fake make/model data.
