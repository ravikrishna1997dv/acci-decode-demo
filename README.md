# Acci-Decode — Static Interactive Demo

A responsive, no-build-step website prototype for the Acci-Decode accident investigation concept.

## What's included

- Investigation overview dashboard
- Interactive incident playback slider and vehicle marker
- Synthetic acceleration chart and telemetry explorer
- Scenario controls for speed, road surface, and event type
- Event timeline
- Exportable demo incident summary and print-to-PDF option
- Responsive layout for desktop and mobile

## Important prototype limitations

This is a **front-end demo only**. It uses illustrative, synthetic values and a schematic map. It is not connected to sensors, GPS devices, MongoDB, Unity, or a validated vehicle physics engine. Do not use it as forensic evidence or to determine accident causation or fault.

## Run locally

No Node.js, package installation, or build command is required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local HTTP server (optional), from this directory run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy with GitHub Pages

1. Create a new GitHub repository, for example `acci-decode-demo`.
2. Upload **the contents of this folder** to the repository root. Ensure `index.html`, `styles.css`, and `app.js` are at the top level.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for the Pages deployment to finish. GitHub will show the public demo URL in the Pages section, typically:
   `https://YOUR-GITHUB-USERNAME.github.io/acci-decode-demo/`

If you use a different repository name, the URL will use that name. A user/org repository named `YOUR-GITHUB-USERNAME.github.io` uses the root domain instead.

## Suggested next implementation milestones

1. Define the accident-event and sensor-data schema.
2. Add a backend API and persist raw readings with timestamps and source metadata.
3. Synchronize IMU, GPS and OBD-II timestamps and document calibration/uncertainty.
4. Connect the dashboard to recorded datasets.
5. Build a validated reconstruction/simulation pipeline and label assumptions in exported reports.
