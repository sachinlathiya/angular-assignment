# Deadline Countdown (Angular)

Small Angular app that reads `/api/deadline` and shows a live countdown: **Seconds left to deadline: X**.

The backend returns `{ secondsLeft: number }` once. The UI keeps counting down locally every second so we are not hitting the API on each tick.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
cd deadline-app
npm install
```

## Run locally

Start the mock API and the Angular dev server together:

```bash
npm run dev
```

Open [http://localhost:4200](http://localhost:4200).

You can also run them in separate terminals:

```bash
npm run server   # mock API on http://localhost:3000
npm start        # Angular app on http://localhost:4200 (proxies /api to port 3000)
```

## Run tests

```bash
npm test
```

Tests run once in headless Chrome.

## Architecture

The app is intentionally split into small units:

- `DeadlineApiService`: talks to `/api/deadline` and normalizes API data.
- `DeadlineCountdownService`: transforms one API response into a local 1-second countdown stream.
- `DeadlineCountdownComponent`: renders `loading`, `ok`, and `error` states with `OnPush` and `async` pipe.
- `CountdownBreakdownPipe`: converts total seconds into days/hours/minutes/seconds for display.

Flow:

1. API returns initial `secondsLeft`.
2. Service converts it to an absolute target timestamp.
3. RxJS `timer(0, 1000)` emits countdown updates every second.
4. UI updates only on emitted values.

## Project layout

```
src/app/
  components/deadline-countdown/   # UI component (OnPush + async pipe)
  services/
    deadline-api.service.ts        # HTTP call to /api/deadline
    deadline-countdown.service.ts  # one fetch, then local 1s ticks
  models/deadline-response.model.ts
server/
  server.js                        # mock Express API
```

## Notes

- The mock server uses a fixed deadline of `2026-12-31T23:59:59Z`.
- `DeadlineCountdownService` converts the first response into a target timestamp and uses RxJS `timer(0, 1000)` for updates.
- `DeadlineCountdownComponent` uses `ChangeDetectionStrategy.OnPush` and the async pipe to avoid manual subscriptions.

## Performance Considerations

- API is called exactly once for each countdown stream, then updates happen locally.
- `OnPush` reduces unnecessary change detection work.
- `async` pipe manages subscription lifecycle automatically.
- `distinctUntilChanged` prevents duplicate terminal `0` emissions.
- Countdown completes when deadline is reached, so no idle timer keeps running forever.

## Review Summary (Before Refactor)

Original implementation was solid for a take-home and already used:
- standalone components
- `OnPush`
- `async` pipe
- good service/component separation

Main production issues identified:

1. **Infinite terminal emissions**
   - The stream used `takeWhile(seconds >= 0, true)` while values were clamped with `Math.max(0, ...)`.
   - Result: once it hit `0`, it could emit `0` forever.
   - Why it matters: unnecessary CPU work, unnecessary UI checks, and persistent subscriptions.

2. **Weak API boundary validation**
   - API payload was trusted as `{ secondsLeft: number }` without runtime guards.
   - Why it matters: backend drift or malformed responses can break UX and tests.

3. **Edge-case coverage gaps**
   - Missing tests for null/invalid payloads and terminal behavior.
   - Why it matters: regressions can easily slip into production.

## Improvements Made

- Added response normalization in `DeadlineApiService`:
  - null payload => `0`
  - non-number/NaN/infinite => `0`
  - negative value => clamped to `0`
  - decimal value => floored
- Fixed countdown completion logic:
  - `distinctUntilChanged()` + `takeWhile(seconds > 0, true)`
  - emits `0` exactly once, then completes.
- Added/expanded unit tests for:
  - negative/null/invalid API responses
  - emits `0` once then completes
  - loading state rendering
- Kept UI responsive and accessible for desktop/mobile:
  - semantic sections
  - `aria-live` and `aria-atomic`
  - readable hierarchy and error messaging

## Tradeoffs Considered

- **RxJS stream vs signal-native countdown engine**
  - RxJS was kept as the core timing primitive because it is concise and test-friendly for timer-based flows.
  - Signals can still be layered later for richer app-level state orchestration.

- **Silent normalization vs hard validation errors**
  - Normalization to `0` was chosen to preserve UX under bad payloads.
  - In stricter domains, throwing and surfacing explicit data-contract errors may be preferred.

- **One endpoint call vs polling**
  - One call is enough because the deadline is constant.
  - Polling would increase backend load without value for this requirement.
