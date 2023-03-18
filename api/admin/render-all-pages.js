const { renderAllPages } = require('../../utils/serverRender');

exports.main = async function(request, response) {
    try {
        await renderAllPages();
        response.writeHead(200, {
            'content-type': 'text/plain'
        })
        response.end('success');
    } catch(error) {
        console.log(error);
        response.writeHead(500, {
            'content-type': 'text/plain'
        })
        response.end('error');
    }
}