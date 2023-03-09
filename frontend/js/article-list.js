/* this list is for inputing the article data into a display list
* the pages that will need this are edit-article, general and tech pages
*/

import { createDateString, createImageElement, createTextElement } from "./general.js";

export function createArticleContainer(articleData, index) {
    const a = document.createElement('a');
    const imageElement = createImageElement(articleData.landscapeImage, articleData.landscapeImageText);
    addLoadingAttribute(imageElement, index); // add loading attribute
    a.append(imageElement);
    a.append(createTextElement('h6', articleData.title));
    a.append(createTextElement('p', articleData.description));
    a.append(createTextElement('p', `Published: ${createDateString(Number(articleData.publishedDate))}`))
    a.classList.add('article-card');
    return a
}

export function displayArticleList(element, data, urlFunction) {
    const fragment = new DocumentFragment();
    data.forEach((article, index) => {
        const a = createArticleContainer(article, index);
        a.href = urlFunction(article.urlTitle, article.id);
        fragment.append(a);
    })
    element.appendChild(fragment);
}

function addLoadingAttribute(imageElement, index) {
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    console.log(mediaQuery.matches);

    if (mediaQuery.matches) { // it is portrait
        if (index > 1) imageElement.loading = 'lazy';
    } else { // landscape images
        if (index > 3) imageElement.loading = 'lazy';
    }
}