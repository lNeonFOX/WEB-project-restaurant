# WEB-restaurant
**Project Name:** Olive&ember

**Topic:** Restaurant Website

## Group Members

- Torekhan Taimas
- Bikanov Aibar
- Abay Amirkhan

## Description

Olive&ember is a responsive restaurant website. Visitors can explore featured dishes, search and filter the menu, view a photo gallery, read about the restaurant, book a table, place a delivery order, read the FAQ, create an account, sign in, and browse real recipes loaded from a public API.

The project was built in three stages. The midterm delivered the static, responsive website. The endterm added JavaScript and jQuery features. The final project adds accounts with sign-in and sign-out stored in localStorage, a refactored Register page, an FAQ with jQuery animations, and an integration with the TheMealDB public API. All earlier pages, layouts, and responsive behavior remain intact. There is no server: accounts, the login state, and reservations are stored only in the visitor's browser.

## Midterm Features Implemented

- Five connected pages: Home, Menu, About, Booking, and Delivery.
- Shared navigation, header, and footer.
- Food images, dish cards, and a menu price table.
- Booking and delivery forms.
- External CSS and CSS variables.
- Flexbox, CSS Grid, and Bootstrap layouts.
- Hover and focus effects.
- Media queries for tablet and mobile screens.

## Endterm Fearures Implemented

- **Registration form with validation (Register page):**
  - Required-field checks for name, email, and password.
  - Email format verification using a regular expression (RegEx).
  - Password strength indicator (weak, medium, strong) with a colored progress bar.
  - Password confirmation check.
  - Real-time success and error feedback while typing.
  - Form submission is blocked until all fields are valid.
- **Live search and category filter (Menu page):** dishes are filtered as the user types, case-insensitively, and the filter works together with the category buttons (All, Starter, Main course).
- **Image gallery with lightbox (Menu page):** thumbnail grid, enlarged view on click, previous and next arrows, keyboard control, and fade transitions using jQuery effects.
- **Dynamic table with CRUD (Booking page):** reservations can be added, displayed, edited in a modal, and deleted with a confirmation prompt. Data persists after a page refresh.

## Final Project Features Implemented

- **Refactored Register page:** the page is now an account page with two Bootstrap tabs, Register and Sign in, plus a separate signed-in view. The existing registration validation was kept and extended so that a valid form now creates a real account in localStorage.
- **Sign-in with localStorage:**
  - Sign-in form with real-time validation (required fields, email RegEx, minimum password length).
  - Registered accounts are saved in localStorage (`olive_users`). Passwords are stored only as SHA-256 hashes (Web Crypto API), never as plain text. Duplicate emails are blocked.
  - After a successful sign-in, only non-sensitive data (name, email, sign-in time) is saved as the login state (`olive_session`). The password is never saved there.
  - The user stays signed in after a page refresh because the login state is read from localStorage on every page load.
  - Signed-in interface: a welcome panel on the Register page, and "Hi, Name" with a Sign out button in the header on every page.
  - The Sign out button clears the saved login state. Open browser tabs stay in sync through the `storage` event.
  - A generic "Invalid email or password" message is shown on failure, so the form does not reveal which emails are registered.
- **Show / hide password buttons** on the password fields of the Register and Sign in forms.
- **FAQ section (jQuery, FAQ page):** six questions about the restaurant. Clicking a question opens or closes its answer with a smooth `.slideToggle()` animation, a + / − indicator shows the state, and only one answer stays open at a time.
- **API integration (Home page, Recipe explorer):**
  - Uses the free public TheMealDB API through JavaScript `fetch()` and processes the JSON responses.
  - Recipe cards are built dynamically from the data. A Bootstrap modal shows the full recipe (ingredients, instructions, video link).
  - User interaction: live search (with a typing delay), category filter, click a card for details, a Random dish button, and a Reload button.
  - Error handling: HTTP status check, 8-second timeout, invalid-data handling, an empty-results message, a loading indicator, and an error alert with a Try again button. Outdated responses are ignored when the user types quickly.
  - All API text is escaped before it is inserted into the page.
  - The API uses HTTPS and needs no key, so it works on the deployed GitHub Pages site.
  - **Light / Dark theme toggle:** a button switches between light and dark themes, the choice is saved in localStorage, restored after a refresh, and applied across all pages.

## Technologies Used

- HTML5
- CSS
- Bootstrap 5 (CSS and JS)
- JavaScript (ES6, async/await)
- jQuery 3.7
- Fetch API and the TheMealDB public API
- localStorage
- Web Crypto API (SHA-256)
- GitHub Pages


## Individual Contributions

| Member | Contribution |
| --- | --- |
| Torekhan Taimas | Midterm: developed Home and contributed to About. Implemented CSS, Bootstrap, and media queries for his pages, plus media queries for Menu. Prepared the README, project architecture, and deployment. Endterm: Tasks for each member provided, created the Register page and its JavaScript (registration module): required-field checks, RegEx email validation, password strength indicator, password confirmation, real-time feedback, and submission blocking. README description updated. Final: refactored the Register page into Register and Sign in tabs with a signed-in view. Implemented sign-in functionality with localStorage: sign-in form with validation, account storage with hashed passwords, duplicate email check, saved login state, persistence after refresh, signed-in interface (welcome panel and header greeting), and a sign-out button that clears the login state. Added show / hide password buttons. Integrated the TheMealDB API on the Home page (Recipe explorer) using fetch(): live search, category filter, recipe details modal, random dish, reload, loading state, and error handling with retry. Resolved Git merge conflicts when combining the group's work, and updated the README. |
| Bikanov Aibar | Midterm: Developed Menu and prepared all images. Implemented CSS and Bootstrap for his page and contributed to About. Endterm: Developed the real-time search and multi-category filtering system for the Menu page. Built the responsive image gallery and custom lightbox viewer with smooth visual transitions, image navigation, and gallery visibility toggling. Prepared and optimized all food imagery and styled new interactive elements. |
| Abay Amirkhan | Developed Delivery and Booking. Implemented CSS and media queries for both pages.Updated form validation logic with RegEx phone and address checks, dynamic quantity verification, and order submission handling for the Delivery page. Updated table reservation logic in the Booking page with form validation, dynamic data persistence using localStorage, and interactive CRUD management. |

## Published Website
https://lneonfox.github.io/WEB-project-restaurant/
