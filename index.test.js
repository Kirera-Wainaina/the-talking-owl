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