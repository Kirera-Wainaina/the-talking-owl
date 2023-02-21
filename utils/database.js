const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');

dotenv.config()

const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.SERVICE_ACCOUNT
});

exports.saveData = function(data, collectionName) {
    const collection = firestore.collection(collectionName);
    return collection.add(data)
}

exports.getUserByEmail = function(email, collectionName) {
    const collection = firestore.collection(collectionName);
    return collection.where('email', '==', email).limit(1).get()
}

exports.getData = async function(urlParams, collectionName) {
    var collection = firestore.collection(collectionName);

    if (urlParams.has('field')) {
        collection = setSelectInQuery(collection, urlParams.getAll('field'))
    }

    var data = await collection.get();
    
    return appendIds(data.docs)
}

function setSelectInQuery(query, fields) {
    return query.select(...fields)
}

function appendIds(docs) {
    let data = [];
    docs.forEach(doc => data.push({...doc.data(), id: doc.id}))

    return data
}