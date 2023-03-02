document.addEventListener('DOMContentLoaded', retreiveArticleData);

function retreiveArticleData() {
    fetch('/api/articles?field=description&field=landscapeImage&field=\
    publishedDate&orderBy=publishedDate&orderByDirection=desc')
        .then(response => displayArticleList(response.json()))
}

function displayArticleList(data) {
    
}