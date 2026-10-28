# Made by Saige™

Website for Made by Saige: private birthdays, dinners, destination itineraries and New York programs.
Live at **https://saigegoding.github.io**

## What's in here

| File | What it does |
|---|---|
| `index.html` | All the text and the page structure |
| `css/style.css` | Colours, fonts and layout |
| `js/main.js` | Scroll effects (zooms, colour changes, sideways scrolling) |
| `images/` | Photos (already colour-graded and compressed), favicon and the preview image for shared links |
| `.nojekyll` | Tells GitHub to serve the files as they are |

## Changing text

Open `index.html` on GitHub, click the pencil icon, edit the words between the tags, and click **Commit changes**. The live site updates within a minute or two.

## Swapping a photo

Upload a new photo into `images/` with exactly the same file name as the one it replaces. Keep photos under ~400 KB (e.g. resize to 1800 px tall and save as JPG at ~80% quality) so scrolling stays smooth.

## Contact form

The form sends inquiries to saigeara@gmail.com through FormSubmit (free, no account).
The **first time** someone submits the form, FormSubmit emails saigeara@gmail.com an activation link. Click it once, and every inquiry after that arrives in the inbox. Send a test inquiry yourself right after the site goes live.

## Custom domain later

1. Buy the domain (e.g. madebysaige.com).
2. In this repository: **Settings → Pages → Custom domain**, enter the domain and save.
3. At the domain seller, add the DNS records GitHub shows you.
4. Update the two `https://saigegoding.github.io` links in `index.html` (the `og:` tags and the form's `_next` field) to the new domain.
