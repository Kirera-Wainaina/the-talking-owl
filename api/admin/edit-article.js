const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();

        const result = await editArticle(fields)
        if (result.writeTime) {
            console.log('Data was edited successfully!')
                response.writeHead(200, {'content-type': 'text/plain'})
                response.end('success')
        }
        
    } catch(error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
        response.end('error')
    }
}

function editArticle(data) {
    const id = data.id;
    delete data.id;
    return database.firestore.doc(`articles/${id}`)
        .update(data)
}