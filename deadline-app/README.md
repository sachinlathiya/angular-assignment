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
- If you see a duplicate `"test"` key warning during `ng serve`, check parent folders for another `package.json` with repeated script names.
