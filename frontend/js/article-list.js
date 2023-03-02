/* this list is for inputing the article data into a display list
* the pages that will need this are edit-article, general and tech pages
*/

import { createDateString, createImageElement, createTextElement } from "./general.js";

export function createArticleContainer(articleData) {
    const a = document.createElement('a');
    a.append(createImageElement(articleData.landscapeImage));
    a.append(createTextElement('h6', articleData.title));
    a.append(createTextElement('p', articleData.description));
    a.append(createTextElement('p', `Published: ${createDateString(Number(articleData.publishedDate))}`))
    // add href
    return a
}