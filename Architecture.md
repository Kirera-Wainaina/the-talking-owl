# Architecture
The architecture of this website is simple. I am documenting it so I can have a plan for the direction I am taking. It is also important to track changes in the architecture as it grows.
The website is a content management system. It is through the website, that users can publish articles and images related to the articles.

## Tech stack
- **Node.js** => The website will be server side rendered. Pure Node.js. No framework.
- **Vanilla js** => No framework.
- **HTML/CSS** => Goes without saying
- **Google Firestore** => Database. It'll store the articles and links to images.
- **Puppeteer** => Server render the articles and store them as HTML files
- **AWS** => For hosting

## Pages
Here is the list of pages that are required on the frontend.

### Homepage
It is the welcoming page of the website.
It contains the welcome mat.
It has a recent articles section and a small business section.

### Articles
The articles page has a list of all the articles. There is pagination of articles so a user doesn't have to scroll through hundred of articles.
It also contains the two categories on which the articles are divided. Technology and General.
There is a search bar: users can type the title of the article they are are searching for.

### Article
Contains the article and a wall paper.

### About us & Policies
Simple pages with information on who we are.

### Admin Pages
- Login and Signup page. Passwords are encrypted. You need an admin password to sign up.
- Article upload page
- Image upload

## Server
The server architecture should make it simple to add features. I will stick to a functional style of programming. I will use Classes only when necessary.

### index.js
The mother of the whole system.
It will route requests appropriately.

### Apis
There are API routes whose main function is data POSTing and GETting.

### Others
These other routes will be getting files.

## Tests
I will add tests at the same level as the file that I am testing.

:nerd_face: Let's begin!