const path = require('path');
const index = require('./index');

test('Creates log message', () => {
    const method = 'GET', route = '/';
    expect(index.createLogMessage(method, route))
        .toBe(`${new Date}, ${method}, ${route}`)
})

test('Redirect HTTP Requests', () => {
    const response = {};
    response.writeHead = jest.fn();
    response.end = jest.fn();

    index.redirectHTTPRequests(response);
    expect(response.writeHead.mock.calls[0][0]).toBe(301)
    expect(response.end.mock.calls).toHaveLength(1)
})

test('Is API route', () => {
    const a = "abs/api/food", b = "/api/food/",
    c = "/api/food/dinner", d = "api", e = "/api/";

    expect(index.isAPIRequest(a)).toBeFalsy();
    expect(index.isAPIRequest(b)).toBeTruthy();
    expect(index.isAPIRequest(c)).toBeTruthy();
    expect(index.isAPIRequest(d)).toBeFalsy();
    expect(index.isAPIRequest(e)).toBeFalsy();
})

test('Is file request', () => {
    const a = '/articles', b = '/art.css',
    c = '/art/icle.js', d = '/art/b'

    expect(index.isFileRequest(a)).toBeFalsy();
    expect(index.isFileRequest(b)).toBeTruthy();
    expect(index.isFileRequest(c)).toBeTruthy();
    expect(index.isFileRequest(d)).toBeFalsy();
})

test('Is Home Page route', () => {
    const a = '/', b = '/af', c = '/a/b';

    expect(index.isHomePage(a)).toBeTruthy();
    expect(index.isHomePage(b)).toBeFalsy();
    expect(index.isHomePage(c)).toBeFalsy();
})

test('Creation of browser page routes', () => {
    const a = '/', b = '/a', c = '/a/b';

    expect(index.createFilePathFromPageRequest(a))
        .toBe(path.join(__dirname, `/frontend/html/home.html`));
    expect(index.createFilePathFromPageRequest(b))
        .toBe(path.join(__dirname, `/frontend/html/a.html`));
    expect(index.createFilePathFromPageRequest(c))
        .toBe(path.join(__dirname, `/frontend/html/a/b.html`));
})

test('Creation of file path for file requests', () => {
    const a = '/a.js', b = '/a/home.js'

    expect(index.createFilePathFromFileRequest(a)).toBe(path.join(__dirname, a));
    expect(index.createFilePathFromFileRequest(b)).toBe(path.join(__dirname, b))
})

test('Is Existing File', async () => {
    const a = path.join(__dirname, 'index.js'),
    b = path.join(__dirname, 'xys')

    expect(await index.isExistingFile(a)).toBeTruthy();
    expect(await index.isExistingFile(b)).toBeFalsy();
})

test('Is admin page', () => {
    const a = '/admin/home'
    b = '/home/page'

    expect(index.isAdminPageRequest(a)).toBeTruthy();
    expect(index.isAdminPageRequest(b)).toBeFalsy();
})

test('return cookies in URLSearchParams', () => {
    const cookie = 'test=value; test2=value2; test3=value3';
    const params = index.passCookieIntoURLSearchParams(cookie);
    
    expect(params.has('test')).toBeTruthy();
    expect(params.get('test3')).toBe('value3')
})