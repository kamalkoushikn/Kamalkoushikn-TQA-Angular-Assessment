# Terri Quintel Astrology - Assessment Project

## Implementation Summary (Task 1 & Task 2)

A short summary of what was implemented for the frontend tasks:

- Task 1: Charts Display
   - Location: `frontend/src/app/task1/task1.component.ts`
   - Fetches charts from `GET /api/charts` using `ChartService`.
   - Responsive card grid layout with loading and error states.
   - Each card shows the chart name, birth date/time/location, Sun/Moon/Rising signs and a planets list.
   - Subscriptions are cleaned up in `ngOnDestroy()`.

- Task 2: Birth Chart Calculator + PDF Export
   - Location: `frontend/src/app/task2/task2.component.ts`
   - Reactive form with required fields: `birthDate`, `birthTime`, `birthLocation`.
   - POSTs to `/api/charts/calculate`; uses a 15s timeout and `finalize()` to avoid indefinite loading.
   - Uses `NgZone.run()` to ensure UI updates after async responses.
   - Adds client-side PDF export (uses `html2pdf.js`) that clones the result DOM and saves it as an A4 PDF named `birth-chart-{YYYY-MM-DD}.pdf`.
   - Documentation and test guides were added under `PDF_DOWNLOAD_*.md`.

