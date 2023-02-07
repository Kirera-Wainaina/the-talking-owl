const index = require('./index')

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
    expect(response.writeHead.mock.calls[0][0]).toBe('301')
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

    expect(index.createBrowserPageRoute(a)).toBe(`/frontend/html/home.html`);
    expect(index.createBrowserPageRoute(b)).toBe(`/frontend/html/a.html`);
    expect(index.createBrowserPageRoute(c)).toBe(`/frontend/html/a/b.html`);
})