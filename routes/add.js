const Router = require('express').Router;
const db = require('../db/connection');
const { ObjectId } = require('mongodb');

const router = Router();

//form router creation
router.get('/', function(req, res) {

    res.render('add/addview');
    

})

//send iten for bd
router.post('/', function(req, res){

    const data = req.body;
    const title = data.title;
    const brand = data.brand;
    const qrcode = data.qrcode;
    const description = data.description;

    db.getDb()
        .db()
        .collection('itens')
        .insertOne({ objectname: title, brand: brand, idnumber: qrcode, description: description });

    res.redirect (301, 'itens');

});

module.exports = router;