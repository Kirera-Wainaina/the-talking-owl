const path = require('path');
const FormDataHandler = require('../../utils/formDataHandler');
const fs = require('fs/promises');

exports.main = async function(request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        const destination = path.join(__dirname, '..', '..', 'sitemap.xml');
        const src = files[0];
        await fs.copyFile(src, destination)
            .then(() => fs.unlink(src))
        response.writeHead(200, {'content-type': 'text/plain'})
        response.end('success');
        
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
        response.end('error')
    }
}