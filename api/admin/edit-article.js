const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');
const { renderAllPages } = require('../../utils/serverRender');

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();
        const urlTitle = fields.urlTitle;
        const id = fields.id;

        const result = await editArticle(fields)
        
        if (result.writeTime) {
            renderAllPages(urlTitle, id, fields.category);
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
    delete data.urlTitle
    return database.firestore.doc(`articles/${id}`)
        .update(data)
}