export function render(parentContainer, data) {
    let container = new DocumentFragment();

    const landscapeImage = createArticleImage(data.landscapeImage, 
            data.landscapeImageText, 
            'landscape-wall-image');
    const portraitImage = createSrcsetImage(data.portraitImage, 
        data.portraitImageText, 
        'portrait-wall-image');
    const picture = createPictureElement(portraitImage, landscapeImage);
    
    container.append(createTitleElement(data.title));
    container.append(picture);

    parentContainer.appendChild(container)
}

function createTitleElement(title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    return h1
}

function createArticleImage(imageUrl, imageText, imageId) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageText;
    img.id = imageId;
    return img
}


function createSrcsetImage(imageUrl, imageText, imageId) {
    const source = document.createElement('source');
    source.srcset = imageUrl;
    source.media = '(orientation: portrait)';
    return source
}

function createPictureElement(portraitImage, landscapeImage) {
    const picture = document.createElement('picture');
    picture.append(portraitImage);
    picture.append(landscapeImage);
    return picture;
}