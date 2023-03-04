import { createArticleContainer } from "../article-list.js";

document.addEventListener('DOMContentLoaded', retreiveArticleData);

function retreiveArticleData() {
    fetch('/api/articles?field=title&field=description&field=landscapeImage&field=\
publishedDate&field=urlTitle&orderBy=publishedDate&orderByDirection=desc')
        .then(response => response.json())
        .then(data => displayArticleList(data))
}

function displayArticleList(data) {
    console.log(data)
    const div = document.getElementById('article-list')
    const fragment = new DocumentFragment();
    data.forEach(article => {
        fragment.append(createArticleContainer(article));
    });
    div.appendChild(fragment);
    return;
}