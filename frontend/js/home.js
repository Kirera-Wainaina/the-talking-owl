import { fetchData } from "./general.js";

document.addEventListener('DOMContentLoaded', displayBusinessArticles);

async function displayBusinessArticles() {
    const data = await fetchData('/api/articles?field=squareThumbnail\
&field=squareThumbnailText&field=title&field=description\
&field=publishedDate&field=urlTitle&orderBy=publishedDate\
&orderByDirection=desc&category=business&limit=4');
    console.log(data);
}

