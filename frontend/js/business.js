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

    const mainFragment = generatePageNumberLinks(articleCount, currentPageNumber);
    const skipForwardFragment = generateSkipForwardPageNumberLinks(articleCount, currentPageNumber);
    const skipBackFragment = generateSkipBackPageNumberLinks(currentPageNumber);

    container.appendChild(skipBackFragment);
    container.appendChild(mainFragment);
    container.appendChild(skipForwardFragment);
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
    const maxPageNumber = Math.ceil(articleCount / 10);

    if (articleCount <= 100) { // <10 pages, we only need single digit page numbers
        for (let i = 1; i <= maxPageNumber; i++) {
            const a = createPageNumberLink(i, currentPageNumber);
            fragment.append(a);
        }
        return fragment
    } else {
        // article count > 100
        // show 5 previous pages and 5 next pages
        let maxDisplay= null;
        let minDisplay = null;

        (currentPageNumber + 5) > maxPageNumber
            ? maxDisplay = maxPageNumber
            : maxDisplay = currentPageNumber + 5;

        (currentPageNumber - 5) < 1
            ? minDisplay = 1
            : minDisplay = currentPageNumber - 5;

        for (let i = minDisplay; i <= maxDisplay; i++) {
            const a = createPageNumberLink(i, currentPageNumber);
            fragment.append(a);
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

function generateSkipForwardPageNumberLinks(articleCount, currentPageNumber) {
    const fragment = new DocumentFragment();
    const nextTenthPageNumber = Math.ceil(currentPageNumber / 10) * 10;
    const maximumTenthPageNumber = Math.floor(articleCount / 100) * 10;
    let maxDisplay = null;

    const p = createTextElement('p', '...');
    fragment.append(p);

    if (maximumTenthPageNumber > nextTenthPageNumber + 30) {
        // display only 3 tenth numbers
        maxDisplay = nextTenthPageNumber + 30;
    } else {
        maxDisplay = maximumTenthPageNumber;
    }

    for (let i = nextTenthPageNumber + 10; i <= maxDisplay; i += 10) {
        const a = createPageNumberLink(i, currentPageNumber);
        fragment.append(a);
    }
    return fragment
}

function generateSkipBackPageNumberLinks(currentPageNumber) {
    const fragment = new DocumentFragment();
    const previousTenthPageNumber = Math.floor(currentPageNumber / 10) * 10;
    let minDisplay = null;

    if (previousTenthPageNumber - 30 > 10) {
        // display on the previous 3 tenth page numbers
        minDisplay = previousTenthPageNumber - 30;
    } else {
        minDisplay = 10;
    }

    for (let i = minDisplay; i <= previousTenthPageNumber - 10; i += 10) {
        const a = createPageNumberLink(i, currentPageNumber);
        fragment.append(a);
    }

    const p = createTextElement('p', '...');
    fragment.append(p);

    return fragment
}