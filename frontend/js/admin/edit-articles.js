import { createArticleContainer } from "../article-list.js";

document.addEventListener('DOMContentLoaded', retreiveArticleData);

function retreiveArticleData() {
    fetch('/api/articles?field=title&field=description&field=landscapeImage&field=\
publishedDate&field=urlTitle&orderBy=publishedDate&orderByDirection=desc')
        .then(response => response.json())
        .then(data => displayArticleList(data))
}

function displayArticleList(data) {
    const div = document.getElementById('article-list')
    const fragment = new DocumentFragment();
    data.forEach(article => {
        const a = createArticleContainer(article);
        a.href = `/admin/edit?urlTitle=${article.urlTitle}&id=${article.id}`;
        fragment.append(a);
    });
    div.appendChild(fragment);
    return;
}