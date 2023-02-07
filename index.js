const http = require('http');

const dotenv = require('dotenv');
dotenv.config()

const httpPort = 80;

if (require.main == module) {
    const httpServer = http.createServer();
    httpServer.listen(httpPort, 
        () => console.log(`Server listening on port ${httpPort}`));
    
    httpServer.on('request', handleHTTPRequest);
}

function handleHTTPRequest(request, response) {
    console.log(createLogMessage(request));
    redirectHTTPRequests(response, request.url)
}

function createLogMessage(request) {
    return `${new Date}, ${request.method}, ${request.url}`
}

function redirectHTTPRequests(response, route) {
    response.writeHead('301', { 
        'location': `${process.env.DOMAIN}${route}`
    })
    response.end()
}

exports.createLogMessage = createLogMessage;
exports.redirectHTTPRequests = redirectHTTPRequests;