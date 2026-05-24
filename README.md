# Real Estate Dashboard

Interactive React dashboard for visualizing a residential master plan product mix, land allocation, setbacks, heights, and density simulations.

Live site: https://youssefg7.github.io/realestate-dashboard/

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons
- GitHub Pages
- GitHub Actions

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Updating The Dashboard

Most dashboard content and UI lives in:

```text
src/App.jsx
```

After editing the dashboard, commit and push to `main`:

```bash
git add .
git commit -m "Update dashboard"
git push
```

GitHub Actions automatically builds and deploys the latest version to GitHub Pages.

## Deployment

Deployment is handled by:

```text
.github/workflows/deploy.yml
```

Every push to `main` runs the production build and publishes the `dist` output to GitHub Pages.
