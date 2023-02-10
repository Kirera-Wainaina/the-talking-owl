exports.httpResponse = function(response, msg, data=null) {
    switch(msg){
        case 'success':
            response.writeHead(200, this.headers);
            break;
        case 'error':
            response.writeHead(500);
            break;
        case 'unauthorized':
            response.writeHead(401);
            break;
    }
    data ? response.end(data) : response.end();
}