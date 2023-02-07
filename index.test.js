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

    expect(index.isAPIRoute(a)).toBeFalsy();
    expect(index.isAPIRoute(b)).toBeTruthy();
    expect(index.isAPIRoute(c)).toBeTruthy();
    expect(index.isAPIRoute(d)).toBeFalsy();
    expect(index.isAPIRoute(e)).toBeFalsy();
})