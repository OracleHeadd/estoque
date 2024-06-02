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

//routes
app.get('/', async (req, res) => {
    try {
        let searchResults;
        // Verificar se o parâmetro de consulta 'brand' está presente
        if (req.query.brand) {
            // Se estiver, usar esse termo para pesquisar na coleção de itens
            searchResults = await db.getDb().db().collection('itens').find({ brand: req.query.brand }).toArray();
        }

        // Buscar todos os itens
        const items = await db.getDb().db().collection('itens').find({}).toArray();

        // Contar o número total de itens
        const totalItems = await db.getDb().db().collection('itens').countDocuments();
        
        // Renderizar a view 'home' com ambos os dados
        res.render('home', { items, totalItems, searchResults });
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