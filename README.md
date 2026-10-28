# Made by Saige™

Website for Made by Saige: private birthdays, dinners, destination itineraries and New York programs.
Live at **https://saigegoding.github.io**

Everything the site needs (fonts, animation scripts, photos) is inside this folder, so it doesn't depend on any outside server.

## What's in here

| File / folder | What it does |
|---|---|
| `index.html` | All the text and the page structure |
| `css/style.css` | Colours, fonts and layout |
| `js/main.js` | Scroll effects: zooms, colour changes, sideways cards |
| `js/vendor/` | Animation libraries (GSAP, ScrollTrigger, Lenis). Don't edit these |
| `fonts/` | Bodoni Moda and Jost font files |
| `images/` | Portrait, event photos, favicon and the preview image for shared links |
| `.nojekyll` | Tells GitHub to serve the files as they are |

## Changing text

Open `index.html` on GitHub, click the pencil icon, edit the words between the tags, and click **Commit changes**. The live site updates within a minute or two.

## Adding event photos (the "Moments" section)

1. Upload the photo into `images/`, e.g. `event-3.jpg`. Keep it under ~400 KB (about 1600 px tall, JPG at ~80% quality).
2. In `index.html`, find the first placeholder block: it starts with `<figure class="moment moment-placeholder"`.
3. Replace that whole block with a copy of a real one, changing the file name, description and caption:

```html
<figure class="moment">
  <div class="moment-frame"><img src="images/event-3.jpg" alt="Short description of the photo" loading="lazy" width="1200" height="1600"></div>
  <figcaption>Name of the event, New York</figcaption>
</figure>
```

You can add as many as you like. They line up in two staggered columns automatically.

## Contact form

The form sends inquiries to saigeara@gmail.com through FormSubmit (free, no account).
The **first time** someone submits the form, FormSubmit emails saigeara@gmail.com an activation link. Click it once, and every inquiry after that arrives in the inbox.

## Custom domain later

1. Buy the domain (e.g. madebysaige.com).
2. In this repository: **Settings → Pages → Custom domain**, enter the domain and save.
3. At the domain seller, add the DNS records GitHub shows you.
4. Update the `https://saigegoding.github.io` links in `index.html` (the `og:` tags and the form's `_next` field) to the new domain.
