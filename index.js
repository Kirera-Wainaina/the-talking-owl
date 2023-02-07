const http = require('http');
const http2 = require('http2');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config()

const httpPort = 80;

if (require.main == module) { // create HTTP Server
    const httpServer = http.createServer();
    httpServer.listen(httpPort, 
        () => console.log(`Server listening on port ${httpPort}`));
    
    httpServer.on('request', handleHTTPRequest);
}

function handleHTTPRequest(request, response) {
    console.log(createLogMessage(request.method, request.url));
    redirectHTTPRequests(response, request.url)
}

function createLogMessage(method, route) {
    return `${new Date}, ${method}, ${route}`
}

function redirectHTTPRequests(response, route) {
    response.writeHead('301', { 
        'location': `${process.env.DOMAIN}${route}`
    })
    response.end()
}

if (require.main == module) { // create HTTPS Server
    const port = 443;
    const options = {
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERT),
        allowHTTP1: true
    }

    const server = http2.createSecureServer(options);
    server.listen(port, () => console.log(`HTTP2 Server listening on port ${port}`));
    server.on('stream', handleHTTP2Request);
}

function handleHTTP2Request(stream, headers) {
    console.log(createLogMessage(headers[':method'], headers[':path']))
}

exports.createLogMessage = createLogMessage;
exports.redirectHTTPRequests = redirectHTTPRequests;