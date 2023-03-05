document.addEventListener('DOMContentLoaded', fetchArticleData);

function fetchArticleData() {
    const params = new URLSearchParams(location.search);
    fetch(`/api/articles?urlTitle=${params.get('urlTitle')}&id=${params.get('id')}`)
        .then(response => response.json())
        .then(data => inputDataIntoForm(data[0]));
}

function inputDataIntoForm(data) {
    inputDataIntoInputElements(data);
}

function inputDataIntoInputElements(data) {
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => input.value = data[input.name]);
}