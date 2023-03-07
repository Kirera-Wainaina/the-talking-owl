import { displayArticleList } from "../article-list.js";

document.addEventListener('DOMContentLoaded', retreiveArticleData);

function retreiveArticleData() {
    fetch('/api/articles?field=title&field=description&field=landscapeImage&field=\
publishedDate&field=urlTitle&orderBy=publishedDate&orderByDirection=desc')
        .then(response => response.json())
        .then(data => displayArticleList(
            document.getElementById('article-list'),
            data,
            createEditHref
        ))
}

function createEditHref(urlTitle, id) {
    return `/admin/edit?urlTitle=${urlTitle}&id=${id}`
}