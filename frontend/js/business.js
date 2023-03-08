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

    const fragment = generatePageNumberLinks(articleCount, currentPageNumber);
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
    if (articleCount < 100) { // <10 pages, we only need single digit page numbers
        const maxPageNumber = Math.ceil(articleCount / 10);
        for (let i = 1; i <= maxPageNumber; i++) {
            const a = createTextElement('a', i);
            fragment.append(a);
        }
        return fragment
    }
}