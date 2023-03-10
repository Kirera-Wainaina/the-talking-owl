import { createDateString, createTextElement, urlifySentence } from "./general.js";

export function render(parentContainer, data) {
    let container = new DocumentFragment();

    const landscapeImage = createArticleImage(data.landscapeImage, 
            data.landscapeImageText, 
            'landscape-wall-image');
    const portraitImage = createSrcsetImage(data.portraitImage, 
        data.portraitImageText, 
        'portrait-wall-image');
    const picture = createPictureElement(portraitImage, landscapeImage);
    
    container.append(createTextElement('h1', data.title))
    container.append(picture);
    container.append(createDescription(data.description))
    container.append(createArticleContent(data.content, data.publishedDate))
    parentContainer.replaceChildren(container)
    parentContainer.insertBefore(
        createTableOfContents(), 
        document.querySelector('article')
    );
}

export function renderOnArticlePage(data) {
    let container = new DocumentFragment();
    const parentContainer = document.querySelector('body')

    const landscapeImage = createArticleImage(data.landscapeImage, 
            data.landscapeImageText, 
            'landscape-wall-image');
    const portraitImage = createSrcsetImage(data.portraitImage, 
        data.portraitImageText, 
        'portrait-wall-image');
    const picture = createPictureElement(portraitImage, landscapeImage);

    container.append(createTextElement('h1', data.title))
    container.append(picture);
    container.append(createDescription(data.description))
    container.append(createArticleContent(data.content, data.publishedDate))

    parentContainer.insertBefore(container, document.querySelector('footer'));
    parentContainer.insertBefore(
        createTableOfContents(), 
        document.querySelector('article')
    );
    insertTitle(data.title);
    insertDescription(data.description);
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

function createDescription(descriptionText) {
    const p = createTextElement('p', descriptionText);
    p.id = 'description';
    return p
}

function createPublishedDate(milliseconds) {
    const div = document.createElement('div');
    div.id = 'publish-date';
    div.append(createClockIcon());
    div.append(createTextElement('p', `Published: ${createDateString(milliseconds)}`))
    return div;
}

function createClockIcon() {
    const img = document.createElement('img');
    img.src = '/frontend/images/clock-icon.svg';
    img.alt = 'clock';
    img.width = '18';
    img.height = '18';
    return img
}

function createArticleContent(content, date) {
    const article = document.createElement('article');
    article.append(createPublishedDate(date))
    article.innerHTML += content;
    return article;
}

function createTableOfContents() {
    const div = document.createElement('div');
    const headings = document.querySelectorAll('h2, h3, h4, h5');
    const fragment = new DocumentFragment();

    div.append(createTextElement('h2', 'Table of contents'));
    headings.forEach(element => {
        div.append(createTableOfContentsLink(element));
        addIdToHeading(element);
    });
    div.id = 'table-of-contents';

    fragment.append(div);
    return fragment
}

function createTableOfContentsLink(element) {
    const a = document.createElement('a');
    a.textContent = element.textContent;
    a.href = `#${urlifySentence(element.textContent)}`;
    setLeftMargin(a, element);
    return a
}

function addIdToHeading(headingElement) {
    headingElement.id = urlifySentence(headingElement.textContent);
    return;
}

function setLeftMargin(aElement, headingElement) {
    switch (headingElement.tagName) {
        case 'H2':
            aElement.classList.add('h2-margin-left')
            break;
        case 'H3':
            aElement.classList.add('h3-margin-left')
            break;
        case 'H4':
            aElement.classList.add('h4-margin-left')
            break;
        case 'H5':
            aElement.classList.add('h5-margin-left')
            break;
        case 'H6':
            aElement.classList.add('h6-margin-left')
            break;
        default:
            break;
    }
}

function insertTitle(title) {
    document.title = `${title} | The Talking Owl`
}

function insertDescription(description) {
    const element = document.querySelector('meta[name="description"]');
    element.content = description;
}