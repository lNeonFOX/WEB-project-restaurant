# WEB-restaurant
**Project Name:** Olive&ember

**Topic:** Restaurant Website

## Group Members

- Torekhan Taimas
- Bikanov Aibar
- Abay Amirkhan

## Description

Olive&ember is a responsive restaurant website. Visitors can explore featured dishes, search and filter the menu, view a photo gallery, read about the restaurant, create an account through a validated registration form, and manage a sample list of table reservations.

The endterm project extends the midterm website with JavaScript and jQuery. All midterm pages, layouts, and responsive behavior remain intact. The registration form sends nothing, and reservations are stored only in the visitor's browser.

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

## Technologies Used

- HTML5
- CSS
- Bootstrap 5 (CSS and JS)
- JavaScript (ES6)
- jQuery 3.7
- GitHub Pages

## Individual Contributions

| Member | Contribution |
| --- | --- |
| Torekhan Taimas | Midterm: developed Home and contributed to About. Implemented CSS, Bootstrap, and media queries for his pages, plus media queries for Menu. Prepared the README, project architecture, and deployment. Endterm: Tasks for each member provided, created the Register page and its JavaScript (registration module): required-field checks, RegEx email validation, password strength indicator, password confirmation, real-time feedback, and submission blocking. README description updated. |
| Bikanov Aibar | Midterm: Developed Menu and prepared all images. Implemented CSS and Bootstrap for his page and contributed to About. Endterm: Developed the real-time search and multi-category filtering system for the Menu page. Built the responsive image gallery and custom lightbox viewer with smooth visual transitions, image navigation, and gallery visibility toggling. Prepared and optimized all food imagery and styled new interactive elements. |
| Abay Amirkhan | Developed Delivery and Booking. Implemented CSS and media queries for both pages.Updated form validation logic with RegEx phone and address checks, dynamic quantity verification, and order submission handling for the Delivery page. Updated table reservation logic in the Booking page with form validation, dynamic data persistence using localStorage, and interactive CRUD management. |

## Published Website
https://lneonfox.github.io/WEB-project-restaurant/
