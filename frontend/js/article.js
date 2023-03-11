import { getArticleId, getArticleUrlTitle } from './general.js';
import { renderOnArticlePage } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    const [ data ] = await retrieveArticle();
    renderOnArticlePage(data);
})

function retrieveArticle() {
    return fetch(`/api/articles?field=content&field=description&field=landscapeImage\
&field=landscapeImageText&field=portraitImage&field=portraitImageText\
&field=publishedDate&field=title&field=relatedArticle1&field=relatedArticle2\
&id=${getArticleId()}&urlTitle=${getArticleUrlTitle()}`)
    .then(response => response.json())
}