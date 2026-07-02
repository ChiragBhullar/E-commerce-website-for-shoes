StepNova — E-commerce Website for Shoes

A simple front-end e-commerce site for a shoe store, built with plain HTML, CSS, and JavaScript. Started as a first project to practice HTML/CSS fundamentals, later extended with a working shopping cart, wishlist, search, order history, profile, and account settings.

Features


Product catalog — 12 shoe listings with images, ratings, descriptions, and prices
Live search — filters the product grid as you type
Shopping cart — add/remove items, adjust quantities, running total, and checkout flow
Wishlist — save favorites with a toggle heart button, view them in a dedicated section
Order history — checking out creates an order record with a generated order ID and status
Profile — save name, email, and shipping address
Settings — toggle preferences for email notifications, order updates, and newsletter
FAQ — expandable accordion for common questions
Support — contact form with confirmation on submit


All cart, wishlist, order, profile, and settings data is saved with localStorage, so it persists across page reloads with no backend required.

Tech Stack


HTML5 — page structure and content
CSS3 — styling, responsive layout, animations (no frameworks)
Vanilla JavaScript — all interactivity, no libraries or build tools


Getting Started

No installation or build step needed — this is a static site.


Clone the repository:


bash   git clone https://github.com/ChiragBhullar/E-commerce-website-for-shoes.git


Open ecommerce website/page.html directly in your browser, or serve it locally:


bash   cd "ecommerce website"
   python -m http.server 8000

Then visit http://localhost:8000/page.html.

Project Structure

ecommerce website/
├── page.html       # Main site markup (all sections: products, cart, wishlist, etc.)
├── style.css        # All styling
├── script.js        # Cart, wishlist, search, orders, profile, settings, FAQ, support logic
└── images/           # Product photos and hero banner

Usage


Browse products and use the search bar to filter by name
Click Add to Cart to add an item, or the ♡ icon to save it to your wishlist
Visit the Cart section to adjust quantities and checkout
Completed orders appear under Orders
Update your details under Profile, and preferences under Settings


Notes


This is a front-end demo — there's no real backend, payment processing, or server-side inventory. Checkout simply logs an order locally.
Data is stored per-browser via localStorage; clearing browser storage will reset the cart, wishlist, orders, and profile.


License

This project is open source and available for educational use.
