import { getArticleId, getArticleUrlTitle } from './general.js';
import { renderOnArticlePage } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (navigator.userAgent != 'thetalkingowl-puppeteer') {
        // a user
        return // already rendered
    }
    const [ data ] = await retrieveArticle();
    renderOnArticlePage(data);
    fillStructuredData(data);
})

function retrieveArticle() {
    return fetch(`/api/articles?field=content&field=description\
&field=landscapeImage&field=landscapeImageText&field=portraitImage\
&field=portraitImageText&field=publishedDate&field=title\
&field=relatedArticle1&field=relatedArticle2&id=${getArticleId()}\
&urlTitle=${getArticleUrlTitle()}`)
    .then(response => response.json())
}

function fillStructuredData(article) {
    const structuredDataElement = document
        .querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(structuredDataElement.textContent);
    structuredData['datePublished'] = convertMillisecondsToISO(article.publishedDate);
    structuredData['headline'] = article.title;
    structuredData['image'] = [article.landscapeImage, article.portraitImage];

    structuredDataElement.textContent = JSON.stringify(structuredData);
}

function convertMillisecondsToISO(milliseconds) {
    return new Date(Number(milliseconds)).toISOString();
}