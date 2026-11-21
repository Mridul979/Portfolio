# Mridul Sharma — Portfolio (Next.js)

## Run it
```bash
npm install      # first time only
npm run dev      # open http://localhost:3000
```

## Edit your content
All text (projects, skills, certifications, contact) is in **`data/content.js`** — change it there and the site updates.

## Project structure
```
app/
  layout.js        fonts, page title, <html>/<body>
  page.js          puts all the sections together
  globals.css      all styling + animations
components/        one file per section (Hero, About, Work, Skills, ...)
  Interactions.js  cursor, scroll reveal, magnetic buttons, tilt cards
data/
  content.js       ← your resume content
  visuals.js       animated project illustrations
public/
  favicon.svg
```

## Deploy (free)
Push this folder to GitHub, then import the repo at https://vercel.com — it detects Next.js automatically.
