# Aldo Carrillo Portfolio

A responsive React portfolio built with Vite.

## Development

```sh
npm install
npm run dev
```

Run a production build with `npm run build`.

## Project structure

```text
src/
  components/                  Shared site header and footer
  data/                        Portfolio project-card data
  features/
    note-taker/                 Note-taking UI, behavior, and styles
    password-generator/        Password generator UI, behavior, and styles
    weather-dashboard/         Weather dashboard UI, behavior, and styles
  pages/                       Home and standalone project pages
  styles/                      Shared site and global styles
public/
  assets/projects/             Profile photo and project artwork
  favicon.svg                  Site favicon
projects-to-add/               Local drop-off for projects to integrate
```

Add project source to its own folder under `projects-to-add/`. The submitted project files are intentionally ignored by the main repository; the drop-off instructions remain tracked. After review, interactive projects can be integrated as a feature and linked from the portfolio project data.
