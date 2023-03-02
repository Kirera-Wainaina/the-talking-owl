/* this list is for inputing the article data into a display list
* the pages that will need this are edit-article, general and tech pages
*/

import { createImageElement, createTextElement } from "./general.js";

export function createArticleContainer(articleData) {
    const a = document.createElement('a');
    a.append(createImageElement(articleData.landscapeImage));
    a.append(createTextElement('h6', articleData.title))
}