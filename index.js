const express = require('express')
const app = express()
const { graphqlHTTP } = require('express-graphql');
const port = 4000
const bodyParser = require('body-parser');
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    },
    type Merchant {
        id: Int
        merchant_name: String
        phoneNumber: String
        latitude : Float
        longitude : Float
        isActive: Boolean
        recordedDateTime : String
    }
`);

var root = {
    message: () => 'Hello World!'
}

const knex = require('knex')({
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      user : 'rehansatrya',
      password : '',
      database : 'template1'
    },
    debug: true
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: "8mb",
}));

app.get('/', (req, res) => res.send('Hello World!'))

// GET ALL MERCHANTS

app.get('/merchants', async (req, res) => {
    try{
        let merchants = await knex('merchants');
        res.json(merchants)
    } catch(e){
        console.log(e);
    }
})

// ADD A MERCHANT
app.post('/merchants', async (req, res) => {
    try {
        let merchantName = req.body.merchant_name;
        let phoneNumber = req.body.phone_number;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        let recordedDateTime = req.body.recorded_date_time;
        
        let id = await knex('merchants').insert({
            "merchant_name" : merchantName,
            "phone_number" : phoneNumber,
            "latitude" : latitude,
            "longitude" : longitude,
            "recorded_date_time" : recordedDateTime
        })
        res.json({
            id: id[0],
            merchantName,
            phoneNumber,
            latitude,
            longitude,
            recordedDateTime
        })
    } catch (e) {
        console.log(e);
        next(e)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))