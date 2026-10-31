# Made by Saige™

Celebration dinners and New York itineraries. Live at **https://saigegoding.github.io**

Two signatures:
- **Course by Course**: a celebration dinner where every course happens somewhere new.
- **Like a Regular**: New York itineraries for people who'd rather belong than be shown around.

## What's in here

| File | What it does |
|---|---|
| `index.html` | All the text and the page structure |
| `css/style.css` | Colours, fonts and layout |
| `js/main.js` | Scroll effects: the envelope opening, colour changes, the sideways evening, zooms |
| `images/` | Event photos, Saige's portrait, favicon and the preview image for shared links |

## Changing text

Open `index.html` on GitHub, click the pencil icon, edit the words between the tags, and click **Commit changes**. The live site updates within a minute or two.

## Placeholder photos (important)

Every `<img class="stock" ...>` in `index.html` is a free Unsplash placeholder, loaded straight from images.unsplash.com.
They're there for the look only, so replace them with photos of Saige's own work as soon as she has them:

1. Upload the photo into `images/` (keep it under ~400 KB, about 1600 px on the long side).
2. In `index.html`, change that image's `src="https://images.unsplash.com/..."` to `src="images/your-photo.jpg"`, update the `alt` description, and remove `class="stock"` (that class adds the warm filter used to blend the stock photos in).

Where they are:
- **Course by Course**: the four evening stops (first pour, long table, toast, last room)
- **Like a Regular**: the two photos beside the intro
- **Scenes from the table**: five of the seven photos (the two `images/event-*.jpg` ones are real)

To add more photos to "Scenes from the table", copy a `<figure class="scene">` block.

## Contact form

The form sends RSVPs to saigeara@gmail.com through FormSubmit (free, no account).
The **first time** someone submits the form, FormSubmit emails saigeara@gmail.com an activation link. Click it once, and every inquiry after that arrives in the inbox.

## Custom domain later

1. Buy the domain (e.g. madebysaige.com).
2. In this repository: **Settings → Pages → Custom domain**, enter the domain and save.
3. At the domain seller, add the DNS records GitHub shows you.
4. Update the `https://saigegoding.github.io` links in `index.html` (the `og:` tags and the form's `_next` field) to the new domain.
