const FormDataHandler = require('../../utils/formDataHandler')

exports.main = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();

        console.log(fields)
            
    } catch (error) {
        console.log(error);
        response.writeHead(500, { 'content-type': 'text/html'});
        response.end('error')
    }
}