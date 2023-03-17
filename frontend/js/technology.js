import { displayArticleList, getCurrentPageNumber, displayPageNumbers } from "./article-list.js";

document.addEventListener('DOMContentLoaded', retrieveArticleData);

document.addEventListener(
    'DOMContentLoaded', 
    async () => displayPageNumbers(await retrieveBusinessArticleCount()));

function retrieveArticleData() {
    const pageNumber = getCurrentPageNumber();
    const offset = (pageNumber -1) * 10;
    
    fetch(`/api/articles?field=title&field=description&field=landscapeImage&field=\
publishedDate&field=urlTitle&field=landscapeImageText&category=tech\
&orderBy=publishedDate&orderByDirection=desc&limit=10&offset=${offset}`)
        .then(response => response.json())
        .then(data => displayArticleList(
            document.getElementById('article-list'),
            data,
            createArticleHref
        ))
}

function createArticleHref(urlTitle, id) {
    return `/articles/${urlTitle}?id=${id}`
}

function retrieveBusinessArticleCount() {
    return fetch('/api/articles?category=tech&count=true')
        .then(response => response.json())
}