const index = require('./index')

test('Creates log message', () => {
    const request = {}
    request.method = 'GET';
    request.url = '/'
    expect(index.createLogMessage(request))
        .toBe(`${new Date}, ${request.method}, ${request.url}`)
})