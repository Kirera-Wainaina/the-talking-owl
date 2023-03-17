const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');
const { renderAllPages } = require('../../utils/serverRender');

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();

        if (await urlTitleExists(fields.urlTitle)) { // if urlTitle exists, don't save
            console.log('urlTitle exists so article not saved');
            response.writeHead(500, {'content-type': 'text/plain'})
            response.end('url-exists')    
        } else {
            const doc = await database.saveData(fields, 'articles');

            if (doc.id) {
                await renderAllPages(fields.urlTitle, doc.id, fields.category);
                console.log('Data was saved successfully!')
                response.writeHead(200, {'content-type': 'text/plain'})
                response.end('success')
            }
        }
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
        response.end('error')
    }
}

function urlTitleExists(urlTitle) {
    const collection = database.firestore.collection('articles');
    return collection
        .where('urlTitle', '==', urlTitle)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) return false;
            return true
        })
}