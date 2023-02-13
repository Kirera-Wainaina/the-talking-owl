document.addEventListener('DOMContentLoaded', () => {
    const checkPreviewButton = document.getElementById('check-preview');
    const exitPreviewButton = document.getElementById('exit-preview');

    checkPreviewButton.addEventListener('click', displayPreview)
})

function displayPreview() {
    const preview = document.getElementById('preview');
    preview.classList.toggle('hide');
}