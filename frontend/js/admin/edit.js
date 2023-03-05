document.addEventListener('DOMContentLoaded', fetchArticleData);

function fetchArticleData() {
    const params = new URLSearchParams(location.search);
    fetch(`/api/articles?urlTitle=${params.get('urlTitle')}&id=${params.get('id')}`)
        .then(response => response.json())
        .then(data => console.log(data))
}