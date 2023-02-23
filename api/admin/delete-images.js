const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const database = require('../../utils/database');

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();
        const data = JSON.parse(fields.data);

        await Promise.all(data.map(file => storage.deleteFile(file.name)));

        await Promise.all(data.map(file => database.deleteDocument(file.id, 'images')));

        console.log('Image(s) were successfully deleted')
        response.writeHead(200, {'content-type': 'text/plain'})
            .end('success')
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
            .end('fail');
    }
}