import { createDateString, createImageElement, createTextElement } from "./general.js";

document.addEventListener('DOMContentLoaded', displayBusinessArticles);

async function displayBusinessArticles() {
    const data = await retrieveBusinessArticles();
    const container = document.getElementById('business-articles');

    container.append(createBusinessArticlesFragment(data));
    console.log(data);
}

function retrieveBusinessArticles() {
    return fetch('/api/articles?field=squareThumbnail\
&field=squareThumbnailText&field=title&field=description\
&field=publishedDate&field=urlTitle&orderBy=publishedDate\
&orderByDirection=desc&category=business&limit=4')
    .then(response => response.json());   
}

function createBusinessArticlesFragment(data) {
    const fragment = new DocumentFragment();
    data.forEach(article => fragment.append(
        createBusinessArticleContainer(article)
    ))
    return fragment
}

function createBusinessArticleContainer(article) {
    const a = document.createElement('a');
    const div = document.createElement('div');

    a.append(createImageElement(
        article.squareThumbnail, 
        article.squareThumbnailText
    ));

    div.append(createTextElement('h3', article.title));
    div.append(createTextElement('p', article.description));
    div.append(createTextElement(
        'p', 
        createDateString(article.publishedDate)
    ));

    a.href = `/article/${article.urlTitle}?id=${article.id}`;
    a.append(div);
    return a
}