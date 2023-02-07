const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib')

const dotenv = require('dotenv');
const path = require('path');

const mimes = require('./utils/MIMETypes')
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
    routeRequests(stream, headers[':path'])
}

function routeRequests(stream, route) {
    if (isAPIRequest(route)) { // api routes request for data
    } else if (isFileRequest(route)) {
    } else { // browser request
        handlePageRequest(stream, route)
    }
}

function isAPIRequest(route) {
    const re = /^\/api\/.+/;
    return re.test(route);
}

function isFileRequest(route) {
    return Boolean(path.extname(route));
}

function handlePageRequest(stream, route) {
    const filePath = createFilePathFromPageRequest(route);
    respondWithFile(stream, filePath)   
}

function createFilePathFromPageRequest(route) {
    if (isHomePage(route)) {
        return path.join(__dirname, `/frontend/html/home.html`)
    } else {
        return path.join(__dirname, `/frontend/html${route}.html`)
    }
}

function isHomePage(route) {
    if (route == '/') return true;
    return false
}

function respondWithFile(stream, filePath) {
    stream.respond({
        ':status': 200,
        'content-type': mimes.findMIMETypeFromExtension(filePath),
        'content-encoding': 'gzip'
    })

    fs.createReadStream(filePath)
        .pipe(zlib.createGzip())
        .pipe(stream.end())
        .on('error', handleError)
}

function handleError(error) {
    console.log(error)
}

exports.createLogMessage = createLogMessage;
exports.redirectHTTPRequests = redirectHTTPRequests;
exports.isAPIRequest = isAPIRequest;
exports.isFileRequest = isFileRequest;
exports.isHomePage = isHomePage;
exports.createFilePathFromPageRequest = createFilePathFromPageRequest;