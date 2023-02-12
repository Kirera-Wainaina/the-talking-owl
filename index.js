const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib')
const util = require('util')

const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken')

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
    server.on('request', handleAPIPostRequest);
}

function handleHTTP2Request(stream, headers) {
    console.log(createLogMessage(headers[':method'], headers[':path']))
    routeRequests(stream, headers)
}

function handleAPIPostRequest(request, response) {
    console.log(createLogMessage(request.method, request.url));

    if (request.method == 'POST' && isAPIRequest(request.url)) {
        getAPIModule(request.url).main(request, response)
    }
}

function routeRequests(stream, headers) {
    const route = headers[':path'];

    if (isAPIRequest(route)) { // api routes request for data
        if (headers[':method'] == 'GET') {
            //handle get requests
        }
    } else if (isFileRequest(route)) {
        handleFileRequest(stream, route)
    } else { // browser request
        if (isAdminPageRequest(route) && !isAuthorized(headers.cookie)) { // and is not authorized
            stream.respond({':status': 301, location: '/admin-login' })
            stream.end();
        } else {
            handlePageRequest(stream, route)
        }
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

function handleFileRequest(stream, route) {
    const filePath = createFilePathFromFileRequest(route);
    respondWithFile(stream, filePath)
}

function createFilePathFromPageRequest(route) {
    if (isHomePage(route)) {
        return path.join(__dirname, `/frontend/html/home.html`)
    } else {
        return path.join(__dirname, `/frontend/html${route}.html`)
    }
}

function createFilePathFromFileRequest(route) {
    return path.join(__dirname, route);
}

function isHomePage(route) {
    if (route == '/') return true;
    return false
}

async function respondWithFile(stream, filePath) {
    const existing = await isExistingFile(filePath);
    if (!existing) {
        filePath = path.join(__dirname, 'frontend/html/error.html')
    }

    stream.respond({
        ':status': existing ? 200 : 404,
        'content-type': mimes.findMIMETypeFromExtension(path.extname(filePath)),
        'content-encoding': 'gzip'
    })

    fs.createReadStream(filePath)
        .pipe(zlib.createGzip())
        .pipe(stream)
}

function isExistingFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, (error) => {
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

function getAPIModule(route) {
    return require(`./${route}`);
}

function isAdminPageRequest(route) {
    return /^\/admin\/.*/.test(route)
}

function passCookieIntoURLSearchParams(cookieString) {
    if (!cookieString) return null;
    
    return new URLSearchParams(cookieString.replaceAll('; ', '&'))
}

function isAuthorized(cookie) {
    const cookieParams = passCookieIntoURLSearchParams(cookie);
    if (!cookieParams) return false;

    const authToken = cookieParams.get('auth');
    if (!authToken) return false;
    
    return JWTTokenIsValid(authToken)
}

async function JWTTokenIsValid(token) {
    const jwtVerify = util.promisify(jwt.verify);
    const decoded = await jwtVerify(token, process.env.ADMIN_PASSWORD);
    if (decoded.email) return true;
    return false
}

process.on('uncaughtException', error => console.log(error))

exports.createLogMessage = createLogMessage;
exports.redirectHTTPRequests = redirectHTTPRequests;
exports.isAPIRequest = isAPIRequest;
exports.isFileRequest = isFileRequest;
exports.isHomePage = isHomePage;
exports.createFilePathFromPageRequest = createFilePathFromPageRequest;
exports.createFilePathFromFileRequest = createFilePathFromFileRequest;
exports.isExistingFile = isExistingFile;
exports.getAPIModule = getAPIModule;
exports.isAdminPageRequest = isAdminPageRequest;
exports.passCookieIntoURLSearchParams = passCookieIntoURLSearchParams;