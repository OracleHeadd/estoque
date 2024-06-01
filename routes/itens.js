const Router = require('express').Router;
const db = require('../db/connection');
const { ObjectId } = require('mongodb');


const router = Router();

//Detail view

router.get('/:id', async function(req, res) {

    const id = new ObjectId(req.params.id);

    const iten = await db.getDb().db().collection('itens').findOne({_id: id});

    res.render('details/details', {iten}); 

});

router.get('/', function(req, res) {

    (async() => {

        const itens = await db.getDb().db().collection('itens').find({}).toArray();

        res.render('itens/itensview', {itens});
    })()
    
//itens edit
router.post('/edit', function (req, res) {

    const data = req.body;
    const id = new ObjectId(data.id);

    const title = data.title;
    const brand = data.brand;
    const qrcode = data.qrcode;
    const description = data.description;


    db.getDb()
        .db()
        .collection('itens')
        .updateOne({_id: id}, {$set: {objectname: title, brand: brand, idnumber: qrcode, description: description}});

    res.redirect (301, '/');
});


});

//iten removal
router.post('/delete', function (req, res) {
    const data = req.body;
    const id = new ObjectId(data.id);

    db.getDb()
        .db()
        .collection('itens')
        .deleteOne({_id: id});

    res.redirect(301,'/');

});

module.exports = router;