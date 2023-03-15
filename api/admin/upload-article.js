const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');
const { wsEndpoint } = require('../../utils/renderer');
const { default: puppeteer } = require('puppeteer');
const fsPromises = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config();

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
                const content = await renderArticle(fields.urlTitle, doc.id);
                await writeHTMLToFile(content, doc.id);
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

async function renderArticle(urlTitle, articleId) {
    const browser = await setUpBrowser();
    const page = await browser.newPage();
    console.log(`${process.env.DOMAIN}/article/${urlTitle}?id=${articleId}`);

    await page.setUserAgent('thetalkingowl-puppeteer');
    await page.setRequestInterception(true);

    page.on('request', handleInterceptedRequest);

    await page.goto(
        `${process.env.DOMAIN}/article/${urlTitle}?id=${articleId}`,
        { waitUntil: 'networkidle0' }
    );

    return page.content();
}

async function setUpBrowser() {
    if (global.wsEndpoint) {
        return puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    } else {
        browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        global.wsEndpoint = browser.wsEndpoint();
        return browser
    }
}

function handleInterceptedRequest(interceptedRequest) {
    const allowList = ['document', 'script', 'xhr', 'fetch'];
    
    if (!allowList.includes(interceptedRequest.resourceType())) {
        return interceptedRequest.abort()
    }
    interceptedRequest.continue();
}

function writeHTMLToFile(content, name) {
    const filePath = path.join(__dirname, '..', '..', 'static', `${name}.html`);
    return fsPromises.writeFile(filePath, content)
}