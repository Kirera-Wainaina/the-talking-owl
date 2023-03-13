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
&field=squareThumbnailText&field=landscapeImage&field=landscapeImageText&field=title&field=description\
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

    a.append(createPictureElement(article));

    div.append(createTextElement('h3', article.title));
    div.append(createTextElement('p', article.description));
    div.append(createTextElement(
        'p', 
        createDateString(article.publishedDate)
    ));

    a.href = `/article/${article.urlTitle}?id=${article.id}`;
    a.classList.add('homepage-articles');
    a.append(div);
    return a
}

function createPictureElement(article) {
    const picture = document.createElement('picture');
    const img = createImageElement(
        article.squareThumbnail, 
        article.squareThumbnailText,
        '1080',
        '1080'
    );
    const source = createSourceElement(
        article.landscapeImage, 
        "(orientation: portrait)", 
        '1920', 
        '810'
    );
    picture.append(source);
    picture.append(img);
    return picture
}

function createSourceElement(src, media, width, height) {
    const source = document.createElement('source');
    source.media = media,
    source.srcset = src;
    source.width = width;
    source.height = height;
    return source
}