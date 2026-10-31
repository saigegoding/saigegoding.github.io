# Made by Saige™

Celebration dinners and New York itineraries. Live at **https://saigegoding.github.io**

Two signatures:
- **Course by Course**: a celebration dinner where every course happens somewhere new.
- **Like a Regular**: New York itineraries for people who'd rather belong than be shown around.

## What's in here

| File / folder | What it does |
|---|---|
| `index.html` | The homepage |
| `how-it-works.html` | The "How it works" page: two to-do lists, five steps, example plan, quiz, questions |
| `portfolio.html` | The "Past events" page |
| `css/style.css` | Colours, fonts and layout for all pages |
| `js/main.js` | Effects: the envelope opening, colour changes, brand names sliding, photo zooms, phone booking bar |
| `js/how.js` | The to-do list that crosses itself off, and the quiz |
| `js/portfolio.js` | Filters and pop-ups on the past events page |
| `images/` | Photos, favicon and the preview image for shared links |

## Uploading changes

Keep the folders: files in `css/`, `js/` and `images/` must stay inside those folders on GitHub.
The safest way is to open the folder on GitHub (e.g. click `css`), then **Add file → Upload files** and drop the file in there.

After changing anything in `css/` or `js/`, raise the number after `?v=` where it's linked in **all three** HTML files (e.g. `?v=10` → `?v=11`). That makes every browser load the new version instead of an old saved copy.

## Changing text

Open a file on GitHub, click the pencil icon, edit the words between the tags, and click **Commit changes**. The live site updates within a minute or two.

## Past events page

Each event has two parts in `portfolio.html`, linked by the same id:
1. a card: `<button class="pf-card" ... data-case="burgundy">` (photo, label, title, one line)
2. its details: `<div class="case" id="case-burgundy" hidden>` (photos, the occasion, the route, how it felt)

To add a real event, copy both parts, give them a new id, and swap the text and photos.
`data-cat` decides which filter it shows under: `course`, `regular` or `brand`.

**Sample events:** five of the six events are invented examples, marked with a "Sample event" badge and a note in the pop-up.
Replace them with real events as soon as possible, and remove the badge and note only for real ones.

## Placeholder photos

Every `<img class="stock" ...>` is a free Unsplash placeholder loaded from images.unsplash.com.
To swap one: upload your photo into `images/`, change its `src` to `images/your-photo.jpg`, update the `alt` text, and remove `class="stock"`.

## Contact form

The form sends RSVPs to saigeara@gmail.com through FormSubmit (free, no account).
The **first time** someone submits the form, FormSubmit emails saigeara@gmail.com an activation link. Click it once, and every inquiry after that arrives in the inbox.

## Custom domain later

1. Buy the domain (e.g. madebysaige.com).
2. In this repository: **Settings → Pages → Custom domain**, enter the domain and save.
3. At the domain seller, add the DNS records GitHub shows you.
4. Update the `https://saigegoding.github.io` links in `index.html` (the `og:` tags and the form's `_next` field) to the new domain.
