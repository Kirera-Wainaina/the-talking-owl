document.addEventListener('DOMContentLoaded', () => {
    attachListenerToFileButton()
})

function attachListenerToFileButton() {
    const fileInput = document.querySelector('input[type="file"]');
    const addImageButton = document.querySelector('input[value="Add Image"]');
    
    addImageButton.onclick = () => fileInput.click();
}