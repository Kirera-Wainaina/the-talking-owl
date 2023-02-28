const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database')

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();
        const doc = await database.saveData(fields, 'articles');

        if (doc.id) {
            console.log('Data was saved successfully!')
            response.writeHead(200, {'content-type': 'text/plain'})
            response.end('success')
        }
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
        response.end('error')
    }
}