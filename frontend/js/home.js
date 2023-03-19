import { createDateString, createImageElement, createTextElement } from "./general.js";

document.addEventListener('DOMContentLoaded', () => {
    // dom related functions
    if (navigator.userAgent != 'thetalkingowl-puppeteer') return;
    displayBusinessArticles();
    displayTechnologyArticles();
});

document.addEventListener('DOMContentLoaded', () => {
    // animation related functionality
    if (navigator.userAgent == 'thetalkingowl-puppeteer') return;
    setAnimationOnBusinessArticleCards();
})

async function displayBusinessArticles() {
    const data = await retrieveBusinessArticles();
    const container = document.getElementById('business-articles');

    container.append(createArticlesFragment(data));
}

function retrieveBusinessArticles() {
    return fetch('/api/articles?field=squareThumbnail\
&field=squareThumbnailText&field=landscapeImage\
&field=landscapeImageText&field=title&field=description\
&field=publishedDate&field=urlTitle&field=category\
&orderBy=publishedDate&orderByDirection=desc&category=business&limit=4')
    .then(response => response.json());   
}

function createArticlesFragment(data) {
    const fragment = new DocumentFragment();
    data.forEach(article => fragment.append(createArticleComponent(article)))
    return fragment
}

function createArticleComponent(article) {
    const a = document.createElement('a');
    const div = document.createElement('div');

    a.append(createPictureElement(article));

    div.append(createTextElement('h3', article.title));
    div.append(createTextElement('p', article.description));
    div.append(createTextElement(
        'p', 
        createDateString(article.publishedDate)
    ));

    a.href = `/articles/${article.urlTitle}?id=${article.id}`;
    if (article.category == 'business') {
        a.classList.add('business-article');
    } else {
        a.classList.add('technology-article');
    }
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

async function displayTechnologyArticles() {
    const data = await retrieveTechnologyArticles();
    const container = document.getElementById('technology-articles');

    container.append(createArticlesFragment(data));
}

function retrieveTechnologyArticles() {
    return fetch('/api/articles?field=squareThumbnail\
&field=squareThumbnailText&field=landscapeImage\
&field=landscapeImageText&field=title&field=description\
&field=publishedDate&field=urlTitle&field=category\
&orderBy=publishedDate&orderByDirection=desc&category=tech&limit=4')
    .then(response => response.json())
}

function setAnimationOnBusinessArticleCards() {
    setAnimationOnBusinessImage()
}

function setAnimationOnBusinessImage() {
    const imageElements = document
        .querySelectorAll('#business-articles picture');
    const options = {
        root: null,
        rootMargin: '0%',
        threshold: .1
    }
    imageElements.forEach(element => {
        const observer = new IntersectionObserver(setAnimationClassonBusinessImage, options);
        observer.observe(element);
    })
}

function setAnimationClassonBusinessImage(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('expand-left');
            entry.target.addEventListener('animationEnd', () => {
                entry.target.classList.remove('expand-left');
            })
        }
    })
}