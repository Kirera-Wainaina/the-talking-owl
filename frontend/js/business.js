import { displayArticleList } from "./article-list.js";
import { createTextElement } from "./general.js";

document.addEventListener('DOMContentLoaded', retrieveArticleData);

// document.addEventListener('DOMContentLoaded', displayNumberOfPages);

document.addEventListener('DOMContentLoaded', displayPageNumbers);

function retrieveArticleData() {
    fetch('/api/articles?field=title&field=description&field=landscapeImage&field=\
publishedDate&field=urlTitle&category=business&orderBy=publishedDate&orderByDirection=desc&limit=10')
        .then(response => response.json())
        .then(data => displayArticleList(
            document.getElementById('article-list'),
            data,
            createArticleHref
        ))
}

function createArticleHref(urlTitle, id) {
    return `/article/${urlTitle}?id=${id}`
}

async function displayPageNumbers() {
    const articleCount = await retrieveNumberOfPages();
    const currentPageNumber = getCurrentPageNumber();
    const container = document.getElementById('page-numbers');

    // const fragment = generatePageNumberLinks(articleCount, currentPageNumber);
    const fragment = generatePageNumberLinks(150, 2);

    container.appendChild(fragment)

    console.log(currentPageNumber);
}

function retrieveNumberOfPages() {
    return fetch('/api/articles?category=business&count=true')
        .then(response => response.json())
}

function getCurrentPageNumber() {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('page')) return Number(searchParams.get('page'));
    return 1;
}

function generatePageNumberLinks(articleCount, currentPageNumber) {
    const fragment = new DocumentFragment();
    if (articleCount <= 100) { // <10 pages, we only need single digit page numbers
        const maxPageNumber = Math.ceil(articleCount / 10);
        for (let i = 1; i <= maxPageNumber; i++) {
            const a = createPageNumberLink(i, currentPageNumber);
            fragment.append(a);
        }
        return fragment
    }

    if (currentPageNumber <= 10 && articleCount > 100) {
        for (let i = 1; i <= 10; i++) { // generate links from page 1 - 10
            const a = createPageNumberLink(i, currentPageNumber);
            fragment.append(a)
        }
        const p = createTextElement('p', '...');
        p.classList.add('page-number-separator');
        fragment.append(p);

        // create tens page numbers e.g. 20, 30, 40
        // maximum is page 40 because user is in page < 10
        let maxPageNumber = Math.ceil(articleCount / 100);
        if (maxPageNumber > 4) maxPageNumber = 4;
        for (let i = 2; i <= maxPageNumber; i++) {
            const pageNumber = i * 10;
            fragment.append(createPageNumberLink(pageNumber, currentPageNumber))
        }
        return fragment
    }
}

function createPageNumberLink(pageNumber, currentPageNumber) {
    const a = createTextElement('a', pageNumber);
    a.href = `${location.pathname}?page=${pageNumber}`;
    if (pageNumber == currentPageNumber) a.classList.add('current-page-number');
    return a
}