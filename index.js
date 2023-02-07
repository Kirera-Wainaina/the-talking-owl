const http = require('http');

const httpPort = 80;

const httpServer = http.createServer();
httpServer.listen(httpPort, 
    () => console.log(`Server listening on port ${httpPort}`));

httpServer.on('request', handleHTTPRequest);

function handleHTTPRequest(request, response) {

}

exports.printLog = function printLog(request) {
    // log message of the format
    // date, request method, path
}