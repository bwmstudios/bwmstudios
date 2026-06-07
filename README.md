# Build With Me — Portfolio Website
**Designer/Developer:** Peter Badu
**Contact:** peterbadu971@gmail.com | WhatsApp: +971 50 877 0385
**Version:** 1.0

---

## Project Structure
```
buildwithme/
├── index.html        ← Full single-page website
├── css/
│   └── style.css     ← All styles, colours, layout, responsive
├── js/
│   └── main.js       ← Nav, cursor, animations, form validation
├── images/           ← Add your project screenshots here
└── README.md
```

---

## Quick Edit Guide

| What to change | Where to find it |
|---|---|
| Business name | Search "Build With Me" in index.html |
| Contact email | Search "peterbadu971@gmail.com" |
| Phone/WhatsApp | Search "+971508770385" |
| Prices | Find the `.pkg-num` spans in Packages section |
| Testimonials | Find `<section class="testimonials">` |
| Portfolio cards | Find `<section class="work">` |

---

## Making the Form Send Emails
The form is already connected to Formspree (https://formspree.io/f/xzdwljad).
Verify your email in Formspree after the first submission and you'll receive all enquiries.

---

## Deployment (Free Options)

**Netlify (Recommended):**
1. Go to netlify.com → sign up free
2. Drag and drop the entire `buildwithme/` folder
3. Your site is live instantly

**GitHub Pages:**
1. Create repo on github.com
2. Upload all files
3. Settings → Pages → Deploy from main branch

---

## Adding Real Portfolio Screenshots
1. Save your screenshot as a JPG in the `images/` folder
2. In index.html, find the relevant `.work-card` (e.g. `.wc-salon`)
3. Replace the `.wc-bg` div with: `<img src="images/your-image.jpg" alt="Project Name"/>`
4. Add CSS: `.wc-salon img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.5; }`
