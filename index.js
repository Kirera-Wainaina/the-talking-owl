const http = require('http');

const httpPort = 80;

if (require.main == module) {
    const httpServer = http.createServer();
    httpServer.listen(httpPort, 
        () => console.log(`Server listening on port ${httpPort}`));
    
    httpServer.on('request', handleHTTPRequest);
}

function handleHTTPRequest(request, response) {
    //console.log(createLogMessage(request));
}

function createLogMessage(request) {
    return `${new Date}, ${request.method}, ${request.url}`
}

exports.createLogMessage = createLogMessage;