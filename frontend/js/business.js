import { displayArticleList } from "./article-list.js";

document.addEventListener('DOMContentLoaded', retrieveArticleData);

document.addEventListener('DOMContentLoaded', displayNumberOfPages);

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

async function displayNumberOfPages() {
    const count = await retrieveNumberOfPages();
    console.log(count);
}

function retrieveNumberOfPages() {
    return fetch('/api/articles?category=business&count=true')
        .then(response => response.json())
}