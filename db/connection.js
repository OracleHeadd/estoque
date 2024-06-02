const {MongoClient} = require('mongodb');
const url = "mongodb+srv://mauroroberto83:YClCOwvQF2OEBOkt@estocadb.blfmlph.mongodb.net/?retryWrites=true&w=majority&appName=EstocaDB";

let _db;

const initDb = cb => {

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(client => {
            _db = client
            cb(null, _db);
        })
        .catch(err => {
            cb(err);
        });

}

const getDb = () => {
    return _db;

}

module.exports = {
    initDb,
    getDb
}