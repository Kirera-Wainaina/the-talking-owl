import { getNameOfMonth, urlifySentence } from "./general.js";

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
    container.append(createDescription(data.description))
    container.append(createArticleContent(data.content, data.publishedDate))
    parentContainer.replaceChildren(container)
    parentContainer.insertBefore(
        createTableOfContents(), 
        document.querySelector('article')
    );
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

function createDescription(descriptionText) {
    const p = document.createElement('p');
    p.textContent = descriptionText;
    p.id = 'description';
    return p
}

function createPublishedDate(milliseconds) {
    const div = document.createElement('div');
    div.id = 'publish-date';
    div.append(createClockIcon());
    div.append(createPublishedDateElement(milliseconds))
    return div;
}

function createPublishedDateElement(milliseconds) {
    const p = document.createElement('p');
    p.textContent = `Published: ${createDateString(milliseconds)}`;
    return p;
}

function createDateString(milliseconds) {
    const dateObj = new Date(milliseconds);
    const month = getNameOfMonth(dateObj.getMonth());
    const year = dateObj.getFullYear();
    const day = dateObj.getDate();

    return `${month} ${day}, ${year}`;
}

function createClockIcon() {
    const img = document.createElement('img');
    img.src = '/frontend/images/clock-icon.svg';
    img.alt = 'clock';
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

    div.append(createTableOfContentsHeading());
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

function createTableOfContentsHeading() {
    const h4 = document.createElement('h4');
    h4.textContent = 'Table of contents';
    return h4;
}

function addIdToHeading(headingElement) {
    headingElement.id = urlifySentence(headingElement.textContent);
    return;
}

function setLeftMargin(aElement, headingElement) {
    switch (headingElement.tagName) {
        case 'H2':
            aElement.style.marginLeft = '1em';
            break;
        case 'H3':
            aElement.style.marginLeft = '2.5em';
            break;
        case 'H4':
            aElement.style.marginLeft = '4em';
            break;
        case 'H5':
            aElement.style.marginLeft = '5.5em';
            break;
        case 'H6':
            aElement.style.marginLeft = '7em';
            break;
        default:
            break;
    }
}