# PocketPlan

**IMS566 Advanced Web Design Development and Content Management - Individual Project**

PocketPlan is a colourful student expense tracker. You log what you spend, see where your money goes in charts, and stay on budget with your own monthly limit and category budgets. It works on desktop and on phones.

**Live website:** (https://nallysa375-ship-it.github.io/nrallysadl/)
**GitHub repository:** https://github.com/nallysa375-ship-it/YOUR-REPO-NAME

## How to test the login

Open the live website, then use either option:

1. **Ready-made account:** username `student`, password `pocket2026` (it already has sample spending, so every page is full).
2. **Your own account:** press **Sign up**, choose a username (3 to 20 characters), a password (at least 6 characters) and a recovery word. New accounts start empty, and a "Get started in 3 steps" guide helps new users.

Forgot a password? Press **Forgot password?**, then enter your username, your recovery word and a new password.

To see the error messages, try an empty form or a wrong password.

## Features

**Brand**
- A custom logo (a smiling pocket with a coin), shown in the header, on the login page and in the browser tab

**Authentication**
- Log in, Sign up and Forgot password (with a recovery word) on one page
- Clear error and success messages
- Pages after login are protected: opening them without logging in sends you back to the login page
- Log out asks "Are you sure?" first

**Navigation**
- The same menu on every page: a bottom tab bar on phones and a left sidebar on desktop
- Long usernames are shortened with "..." so the header stays tidy

**Dashboard**
- "Left to spend this month" with a progress meter
- A monthly limit that each user can set
- A mood message that changes with the situation (for example "Your wallet is smiling." or "Careful, Food is over its budget.")
- One coloured tile for each category, plus three summary tiles
- Two ApexCharts: spending by category (donut) and spending per week (bar)
- A "Get started in 3 steps" guide and a "Try with sample data" button for new users

**Expenses page (data view 1)**
- Add a spend with a date, item, category and amount, with hints under each field
- Filter by category with coloured chips
- Remove a spend (asks for confirmation)
- On phones the table turns into easy-to-read cards
- Friendly empty messages when there is nothing to show

**Budget page (data view 2)**
- One card for each category showing spent, budget, percentage used and what is left
- Each user can set their own budget for every category

**Design and accessibility**
- A whimsical pastel theme with an iPhone-style font, floating bubbles and gentle animation
- One colour palette and one font across all pages; text colours checked for easy reading
- Fully responsive (mobile first), with large tap targets
- Labelled form fields and keyboard focus outlines
- Animations switch off for people who turn off motion in their device settings

## Frameworks and libraries

- **HTML, CSS and JavaScript** (no build step and no database)
- **Bootstrap 5.3.3** (grid, form styles and utility classes), loaded from a CDN
- **ApexCharts 3.54.0** (charts), loaded from a CDN
- **Inter** (font, via Google Fonts), with the system font on Apple devices

## Project structure

```
index.html        login, sign up and forgot password
dashboard.html    dashboard
expenses.html     expenses page
budget.html       budget page
images/logo.svg   the PocketPlan logo
css/style.css     all styling, in 12 labelled sections
js/data.js        login details, categories, sample data, helper functions
js/layout.js      logo and navigation, login guard, log out pop-up
js/login.js       log in, sign up and forgot password
js/dashboard.js   dashboard cards, mood message and charts
js/expenses.js    add, filter and remove expenses
js/budget.js      category budget cards
```

## Content organisation

- Every page has its own title, a description, keywords and a theme colour in the `<head>`.
- Pages are built from clear sections (`header`, `nav`, `main`, `section`, `footer`).
- Code is split by purpose: one script per page, shared data in one file, and commented sections in the stylesheet.
- The HTML, CSS and JavaScript files are commented section by section, so each part is easy to find and understand.
- Each spending category keeps the same colour on every page.

## Running it on your computer

1. Download or clone this repository.
2. Open `index.html` in Google Chrome (or use the Live Server extension in VS Code).
3. An internet connection is needed for Bootstrap, the charts and the font.

## Notes and limitations

- This is a prototype. Accounts, passwords and spending are saved **in the browser only** (localStorage), so they are not shared between devices, and passwords are not encrypted. Please do not use a real password.
- A real website would use a server and a database to store accounts and send password-reset emails.
- The sample data is for demonstration only.
- Tested in Google Chrome on desktop, and checked on a phone.

## Author

Allysa
