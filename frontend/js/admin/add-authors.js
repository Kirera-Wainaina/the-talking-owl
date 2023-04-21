document.addEventListener('DOMContentLoaded', () => {
    attachListenerToFileButton();

    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', displayProfileImage);
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
    profileImageLabel.insertAdjacentElement('afterend', img)
}