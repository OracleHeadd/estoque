const express = require('express');
const exphbs = require('Express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

//db call
const db = require('./db/connection')

//template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

//routes import
const itensRoutes = require('./routes/itens');
const addRouters = require('./routes/add');

// pegar usuário do banco de dados
const getUserFromDatabase = async (email) => {
    return db.getDb().db().collection('users').findOne({ email: email });
}

app.post('/login', async (req, res) => {
    const user = await db.getDb().db().collection('users').findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send('Email não encontrado');
    }

    if (req.body.password !== user.password) {
        return res.status(400).send('Senha incorreta');
    }

    res.status(200).send('Login bem-sucedido');
});

//routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login/login', { showNav: false} );
});

app.get('/home', async (req, res) => {
    try {
        let searchResults;

        if (req.query.brand) {
            const regex = new RegExp(req.query.brand, 'i');
            searchResults = await db.getDb().db().collection('itens').find({ idnumber: regex }).toArray();
        }

        const items = await db.getDb().db().collection('itens').find({}).toArray();

        const totalItems = await db.getDb().db().collection('itens').countDocuments();
        
        res.render('home', { items, totalItems, searchResults, showNav: true});
    } catch (err) {
        console.error('Erro ao buscar itens e contagem de documentos:', err);
        res.status(500).send('Erro no servidor');
    }
});

app.use('/itens', itensRoutes);
app.use('/add', addRouters);

db.initDb((err, db) => {
    if(err) {
        console.log(err);
    } else {
        console.log("O banco de dados está funcionando corretamente");
        app.listen(port, () => {
            console.log(`Projeto rodando na porta: ${port}`);
        })
    }
})