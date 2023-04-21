document.addEventListener('DOMContentLoaded', () => {
    attachListenerToFileButton();

    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', displayProfileImage);

    const form = document.querySelector('form');
    form.addEventListener('submit', submitAuthor)
})

function attachListenerToFileButton() {
    const fileInput = document.querySelector('input[type="file"]');
    const addImageButton = document.querySelector('input[value="Add Image"]');
    
    addImageButton.onclick = () => fileInput.click();
}

function displayProfileImage(event) {
    const profileImageLabel = document.getElementById('profile-image-label');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(event.target.files[0]);
    img.id = 'profile-image-preview';
    profileImageLabel.insertAdjacentElement('afterend', img)
}

async function submitAuthor(event) {
    event.preventDefault();

    // const formdata = await enterDetailsIntoFormdata(event.target);
    const formdata = new FormData(event.target);
    fetch('/api/admin/add-author.js', {
        method: 'POST',
        body: formdata
    }).then(handleSubmitAuthorResponse)
}

async function enterDetailsIntoFormdata(form) {
    const formdata = new FormData(form);
    formdata.append('profileImage', await getImageBlob(form))

    return formdata
}

function getImageBlob(form) {
    const imageEl = form.querySelector('#profile-image-preview');
    return fetch(imageEl.src)
        .then(response => response.blob())
}

function handleSubmitAuthorResponse(response) {
    console.log(response)
}