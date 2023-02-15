export function render(parentContainer, data) {
    let html = '';
    html += createTitleElement(data.title);
    parentContainer.innerHTML = html;
}

function createTitleElement(title) {
    return `<h1>${title}</h1>`
}