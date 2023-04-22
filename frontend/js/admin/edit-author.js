document.addEventListener('DOMContentLoaded', () => {
    const [ authorDetails ] = retrieveAuthorData();
    displayAuthorDetails(authorDetails)
})

function retrieveAuthorData() {
    const params = new URLSearchParams(location.search);
    return fetch(`/api/authors?id=${params.get('id')}`)
    .then(response => response.json())
}
