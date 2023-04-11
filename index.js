const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib')
const util = require('util')

const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken')

const mimes = require('./utils/MIMETypes');
const database = require('./utils/database');

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
    response.writeHead(301, { 
        'location': `${process.env.DOMAIN}${route}`
    })
    response.end()
}

if (require.main == module) { // create HTTPS Server
    const port = 443;
    const options = {
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERT),
        ca: fs.readFileSync(process.env.CA),
        allowHTTP1: true
    }

    const server = http2.createSecureServer(options);
    server.listen(port, () => console.log(`HTTP2 Server listening on port ${port}`));
    server.on('request', handleHTTP2Request);
}

function handleHTTP2Request(request, response) {
    const headers = request.headers;
    console.log(createLogMessage(headers[':method'], headers[':path']))
    routeRequests(request, response);
}

function handleAPIPostRequest(request, response) {
    if (request.method == 'POST' && isAPIRequest(request.url)) {
        console.log(createLogMessage(request.method, request.url));
        getAPIModule(request.url).main(request, response)
    }
}

function routeRequests(request, response) {
    const headers = request.headers;
    const route = headers[':path'];
    const parsedUrl = new URL(route, process.env.DOMAIN);

    if (isAPIRequest(route)) { // api routes request for data
        if (headers[':method'] == 'GET') {
            //handle get requests
            handleAPIGetRequest(response, parsedUrl);
        } else if (headers[':method'] == 'POST') {
            handleAPIPostRequest(request, response)
        }
    } else if (isFileRequest(route)) {
        handleFileRequest(response, route)
    } else { // browser request
        if (isAdminPageRequest(route) && !isAuthorized(headers.cookie)) { 
            const filePath = path.join(__dirname, 'frontend/html/unauthorized.html');
            respondWithFile(response, filePath, 401)
        } else {
            handlePageRequest(request, response);
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

function handlePageRequest(request, response) {
    const headers = request.headers;
    const route = headers[':path'];

    if (headers['user-agent'] == 'thetalkingowl-puppeteer') {
        handlePageRequestsFromPuppeteer(response, route);
    } else {
        handlePageRequestsFromUsers(response, route);
    }
}

function handleFileRequest(response, route) {
    const filePath = createFilePathFromFileRequest(route);
    respondWithFile(response, filePath)
}

function createFilePathFromPageRequest(route) {
    const parsedUrl = new URL(route, process.env.DOMAIN);
    if (isHomePage(route)) {
        return path.join(__dirname, `/frontend/html/home.html`)
    } else {
        return path.join(__dirname, `/frontend/html${parsedUrl.pathname}.html`)
    }
}

function createFilePathFromFileRequest(route) {
    return path.join(__dirname, route);
}

function createArticleFilePath() {
    return path.join(__dirname, 'frontend/html/article.html')
}

function handlePageRequestsFromPuppeteer(response, route) {
    let filePath;
    if (path.dirname(route) == '/articles') {
        filePath = createArticleFilePath()
    } else {
        filePath = createFilePathFromPageRequest(route);
    }
    respondWithFile(response, filePath)    
}

function handlePageRequestsFromUsers(response, route) {
    const parsedUrl = new URL(route, process.env.DOMAIN);
    let filePath;

    if (path.dirname(parsedUrl.pathname) == '/articles') {
        const id = parsedUrl.searchParams.get('id');
        filePath = path.join(__dirname, 'static', 'articles', `${id}.html`);
    } else if (parsedUrl.pathname == '/') {
        filePath = path.join(__dirname, 'static', 'home.html');
    } else if (parsedUrl.pathname == '/business' || parsedUrl.pathname == '/technology') {
        const pageNumber = parsedUrl.searchParams.get('page') || 1;
        filePath = path.join(
            __dirname, 
            'static', 
            parsedUrl.pathname, 
            `${pageNumber}.html`
        );
    } else {
        filePath = path.join(__dirname, `/frontend/html${parsedUrl.pathname}.html`);
    }
    respondWithFile(response, filePath)    
}

function isHomePage(route) {
    if (route == '/') return true;
    return false
}

async function respondWithFile(response, filePath, statusCode=200) {
    const existing = await isExistingFile(filePath);
    if (!existing) {
        filePath = path.join(__dirname, 'frontend/html/error.html');
        statusCode = 404;
    }

    response.writeHead(
        statusCode,
        {
            'content-type': mimes.findMIMETypeFromExtension(path.extname(filePath)),
            'content-encoding': 'gzip',
            'cache-control': 'max-age=1209600'
        }
    )

    fs.createReadStream(filePath)
        .pipe(zlib.createGzip())
        .pipe(response)
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

async function handleAPIGetRequest(response, parsedUrl) {
    try {
        const collectionName = path.basename(parsedUrl.pathname);

        const data = await database.getData(parsedUrl.searchParams, collectionName);
        respondWithJSON(response, JSON.stringify(data));
    } catch (error) {
        console.log(error);
        respondWithError(response);
    }
}

function respondWithJSON(response, data) {
    response.writeHead(
        '200',
        { 'content-type':'application/json' }
    );
    response.end(data);
}

function respondWithError(response) {
    response.writeHead(
        '500',
        { 'content-type': 'text/plain'}
    );
    response.end('error');
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