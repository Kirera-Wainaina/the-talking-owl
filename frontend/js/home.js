document.addEventListener('DOMContentLoaded', displayBusinessArticles);

async function displayBusinessArticles() {
    const data = await retrieveBusinessArticles();
    console.log(data);
}

function retrieveBusinessArticles() {
    return fetch('/api/articles?field=squareThumbnail\
&field=squareThumbnailText&field=title&field=description\
&field=publishedDate&field=urlTitle&orderBy=publishedDate\
&orderByDirection=desc&category=business&limit=4')
    .then(response => response.json());   
}

