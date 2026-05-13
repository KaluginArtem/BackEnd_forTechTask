# BackEnd - Job Processing API

Backend for a multi-step onboarding wizard with real-time job processing via WebSocket and HTTP polling.

**Live:** https://backendfortechtask-production.up.railway.app

---

## Part 0 - Design

### User Scenarios

**Scenario 1 - WebSocket flow:**
1. User completes 4-step onboarding (wish, weight, goal weight)
2. Frontend calls `POST /jobs` with user data
3. Backend creates a job (`queued`), immediately returns job ID
4. Frontend opens WebSocket connection
5. Backend runs pipeline in background, pushes progress updates (33% → 66% → 100%)
6. Frontend shows real-time progress bar
7. On completion, shows result

**Scenario 2 - HTTP polling flow:**
1. Same steps 1-3
2. Frontend starts polling `GET /jobs/:id` every 3 seconds
3. Backend shows indeterminate spinner (no percentage)
4. When status is `done` - polling stops, result is shown

### Job Processing

```
POST /jobs
    ↓
Create job (status: queued)
    ↓
Update status → processing
    ↓
Run pipeline in background (non-blocking)
    ├── step1: ~3s (data validation stub)
    ├── step2: ~4s (processing stub)
    └── step3: ~5s (finalization stub)
         ↓ onProgress callback after each step
         ├── Update progress in DB (33 → 66 → 100)
         ├── Push via WebSocket (if connected)
         └── Available via GET /jobs/:id (polling)
    ↓
Update status → done
```

### Flow Diagram

```
Client                    Server                    DB
  │                          │                       │
  ├── POST /jobs ──────────► │                       │
  │                          ├── INSERT job ────────►│
  │ ◄──── { id, status } ───┤                       │
  │                          │                       │
  ├── WS connect ──────────► │                       │
  │                          ├── runPipeline()        │
  │                          │   step1 done           │
  │                          ├── UPDATE progress=33 ─►│
  │ ◄── WS: progress 33% ───┤                       │
  │                          │   step2 done           │
  │                          ├── UPDATE progress=66 ─►│
  │ ◄── WS: progress 66% ───┤                       │
  │                          │   step3 done           │
  │                          ├── UPDATE status=done ─►│
  │ ◄── WS: progress 100% ──┤                       │
```

---

## Architecture

### Structure

```
src/
  jobs/
    dto/create-job.dto.ts    # Input validation
    jobs.controller.ts        # HTTP routes
    jobs.service.ts           # Business logic, pipeline orchestration
    jobs.gateway.ts           # WebSocket gateway
    jobs.module.ts
  pipeline/
    pipeline.ts               # 3-step processing pipeline
  prisma/
    prisma.service.ts
    prisma.module.ts
  app.module.ts
  main.ts
```

### Key Decisions

**Pipeline via callback** - Pipeline doesn't know about WebSocket or HTTP. It receives an `onProgress` callback and calls it after each step. The caller (JobsService) decides how to deliver progress - WebSocket, HTTP, or anything else. Adding a new delivery method requires no changes to pipeline code.

**Non-blocking job execution** - `runPipeline()` is called without `await`, so `POST /jobs` returns immediately with the job ID. The pipeline runs in the background.

**DB as source of truth** - Progress and status are always written to DB first, then pushed to WebSocket. This means if a client reconnects mid-job, they can fetch the current state via `GET /jobs/:id`.

**UUID for job IDs** - Sequential IDs (1, 2, 3) would let anyone enumerate all jobs. UUIDs prevent this without auth.

**Job timeout** - If a job stays in `processing` for over 2 minutes, it's automatically moved to `failed`. Prevents stuck jobs.

---

## API

### POST /jobs
Create a new job.

**Request:**
```json
{ "wish": "wish1", "value": 75 }
```

**Response:**
```json
{
  "id": "uuid",
  "status": "queued",
  "progress": 0,
  "result": { "wish": "wish1", "value": 75 },
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Validation:** `wish` must be one of `wish1-wish5`, `value` must be > 0. Rate limited to 10 requests/minute.

### GET /jobs/:id
Get job status.

**Response:**
```json
{
  "id": "uuid",
  "status": "queued | processing | done | failed",
  "progress": 0,
  "result": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

Returns 404 if job not found.

### WebSocket
Connect to `wss://backendfortechtask-production.up.railway.app`.

Listen for event `progress`:
```json
{ "jobId": "uuid", "progress": 33 }
```

---

## Running Locally

```bash
# Start PostgreSQL
docker run --name jobs_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jobs_db \
  -p 5432:5432 -d postgres:15

# Install dependencies
npm install

# Create .env
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobs_db"' > .env
echo 'FRONTEND_URL=http://localhost:5173' >> .env

# Run migrations
npx prisma migrate deploy

# Start dev server
npm run start:dev
```

---

## Tech Stack

- **NestJS** - framework
- **PostgreSQL + Prisma** - database
- **socket.io** - WebSocket
- **class-validator** - DTO validation
- **@nestjs/throttler** - rate limiting
- **Railway** - hosting

---

## What I'd improve with more time

- Add authentication (JWT) so jobs are tied to users
- Add `GET /jobs` endpoint with pagination
- Add retry logic for failed jobs
- Use a proper job queue (BullMQ) instead of setTimeout for production
- Add integration tests for the pipeline
- Set up CI/CD with GitHub Actions
