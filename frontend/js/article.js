import { render } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.render');
    const [ data ] = await retrieveArticle();
    render(container, data);
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

// retrieveArticle()
//     .then(data => console.log(data));