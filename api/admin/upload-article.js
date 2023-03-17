const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');
// const { wsEndpoint } = require('../../utils/renderer');
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
                await renderAllPages(fields.urlTitle, doc.id, fields.category);
                // await writeHTMLToFile(content, doc.id);
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

async function renderAllPages(urlTitle, articleId, category) {
    const articleUrl = createArticleUrl(urlTitle, articleId);
    const homeUrl = createHomeUrl();
    const categoryUrls = await createCategoryUrls(category);
    const urlArray = [articleUrl, homeUrl, ...categoryUrls];

    const contentAndUrl = await Promise.all(urlArray.map(url => renderPage(url)));
    await Promise.all(contentAndUrl.map(
        obj => writeHTMLToFile(obj.content, createFileNameFromUrl(obj.url))
    ));
    return
}

async function renderPage(url) {
    const browser = await setUpBrowser();
    const page = await browser.newPage();

    await page.setUserAgent('thetalkingowl-puppeteer');
    await page.setRequestInterception(true);

    page.on('request', handleInterceptedRequest);

    await page.goto(url, { waitUntil: 'networkidle0' });

    const content = await page.content();
    await page.close();
    await tearDownBrowser(browser);
    return { content, url }
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

function tearDownBrowser(browser) {
    if (browser.pages.length >= 1) {
        return;
    }
    return browser.close();
}

function handleInterceptedRequest(interceptedRequest) {
    const allowList = ['document', 'script', 'xhr', 'fetch'];
    
    if (!allowList.includes(interceptedRequest.resourceType())) {
        return interceptedRequest.abort()
    }
    interceptedRequest.continue();
}

function writeHTMLToFile(content, name) {
    const filePath = path.join(__dirname, '..', '..', 'static', name);
    return fsPromises.writeFile(filePath, content)
}

function createArticleUrl(urlTitle, articleId) {
    return `${process.env.DOMAIN}/articles/${urlTitle}?id=${articleId}`
}

function createHomeUrl() {
    return `${process.env.DOMAIN}/`
}

async function createCategoryUrls(category) {
    const count = await getArticleNumberInCategory(category);
    const numberOfPages = Math.ceil(count / 10);
    const categoryRoute = category == 'business' ? 'business' : 'technology';
    const urls = [];

    for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
        urls.push(
            `${process.env.DOMAIN}/${categoryRoute}?page=${pageNumber}`
        )
    }
    return urls
}

async function getArticleNumberInCategory(category) {
    let collection = database.firestore.collection('articles');
    collection = collection.where(
        'category', 
        '==', 
        category == 'business' ? 'business' : 'tech'
    );
    collection = collection.count();
    const snapshot = await collection.get();
    return snapshot.data().count
}

function createFileNameFromUrl(url) {
    const parsedUrl = new URL(url);
    console.log(parsedUrl)
    if (parsedUrl.pathname == '/') {
        return '/home.html'
    } else if (parsedUrl.pathname == '/technology' || parsedUrl == '/business') {
        const page = parsedUrl.searchParams.get('page');
        return `${parsedUrl.pathname}/${page}.html`;
    } else {
        return `/articles/${parsedUrl.searchParams.get('id')}.html`
    }
}