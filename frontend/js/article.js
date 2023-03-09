import { renderOnArticlePage } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    const [ data ] = await retrieveArticle();
    renderOnArticlePage(data);
})

function retrieveArticle() {
    return fetch(`/api/articles?field=content&field=description&field=landscapeImage\
&field=landscapeImageText&field=portraitImage&field=portraitImageText\
&field=publishedDate&field=title&id=${getArticleId()}&urlTitle=${getUrlTitle()}`)
    .then(response => response.json())
}

function getUrlTitle() {
    const [ urlTitle ] = location.pathname.match(/(?<=\/article\/).*/);
    return urlTitle;
}

function getArticleId() {
    const params = new URLSearchParams(location.search);
    return params.get('id');
}