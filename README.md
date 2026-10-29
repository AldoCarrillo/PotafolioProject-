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
    budget-baller/              Personal finance tracker
    code-quiz/                  Timed JavaScript quiz
    fitness-tracker/            Workout tracker
    note-taker/                 Note-taking UI, behavior, and styles
    password-generator/        Password generator UI, behavior, and styles
    weather-dashboard/         Weather dashboard UI, behavior, and styles
    work-day-scheduler/         Hourly workday planner
  pages/                       Home and standalone project pages
  styles/                      Shared site and global styles
public/
  assets/projects/             Profile photo and project artwork
  favicon.svg                  Site favicon
projects/                      Original project source archives
```

The `projects/` folder contains the original source for the portfolio projects. These files are tracked with the repository; dependency folders, generated build output, and environment files are excluded. The runnable React versions are in `src/features/` and are linked from the selected projects section.
