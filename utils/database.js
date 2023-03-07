const { Firestore, FieldPath } = require('@google-cloud/firestore');
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
    var count = false;

    if (urlParams.has('field')) {
        collection = setSelectInQuery(collection, urlParams.getAll('field'));
        urlParams.delete('field');
    }

    if (urlParams.has('orderBy')) {
        collection = setOrderByInQuery(collection, urlParams.get('orderBy'), urlParams.get('orderByDirection'));
        urlParams.delete('orderBy');
        urlParams.delete('orderByDirection');
    }

    if (urlParams.has('limit')) {
        const limit = Number(urlParams.get('limit'));
        collection = collection.limit(limit);
        urlParams.delete('limit');
    }

    if (urlParams.toString().length) {
        collection = setWhereInQuery(collection, urlParams); // use remaining querying to filter    
    }

    if (urlParams.has('count')) { 
        collection = collection.count();
        urlParams.delete('count');
        count = true;
    }

    var snapshot = await collection.get();
    if (count) {
        return snapshot.data().count;
    }
    return appendIds(snapshot.docs)
}

exports.deleteDocument = function(id, collectionName) {
    const collection = firestore.collection(collectionName);
    return collection.where(FieldPath.documentId(), '==', id).get()
        .then(querySnaphot => querySnaphot.forEach(
            async documentSnapshot => await documentSnapshot.ref.delete()))
}

function setSelectInQuery(query, fields) {
    return query.select(...fields)
}

function setOrderByInQuery(query, orderByValue, orderByDirection='asc') {
    return query.orderBy(orderByValue, orderByDirection);
}

function setWhereInQuery(query, urlParams) {
    urlParams.forEach((value, name) => { // where has to come before count
        if (name == 'count') return ;
        if (name == 'id') {
            query = query.where(FieldPath.documentId(), '==', value)
        } else {
            query = query.where(name, '==', value);
        }
    })
    return query
}

function appendIds(docs) {
    let data = [];
    docs.forEach(doc => data.push({...doc.data(), id: doc.id}))

    return data
}

exports.firestore = firestore;