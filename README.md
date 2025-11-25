# Product Dashboard

Product is an Angular 19 dashboard that lists products from the `dummyjson.com` API, supports filtering/sorting/pagination, and shows product sales insights with charts. The UI uses Angular Material with light/dark themes, RxJS-powered view models, and a feature-based architecture.

## Prerequisites

- Node.js 20+
- npm 9+

Install project dependencies once:

```bash
npm install
```

## Run the app

```bash
npm run start
```

Then open `http://localhost:4200`. The dev server uses HMR-style reloads on code changes.

## Build for production

```bash
npm run build
```

Compiled assets live in `dist/dashboard-product`. The Angular CLI may warn about the default bundle budget; raise the budget if needed.

## Run tests

```bash
npm test
```

Currently the test suite contains the default Angular spec scaffolding—add service/component specs under `src/app/**`.

## Project structure

Key folders:

- `src/app/core`: singletons (interceptors, services, repositories, models)
- `src/app/shared`: reusable components/pipes + Angular Material module
- `src/app/features/products`: lazy-loaded dashboard + detail feature

