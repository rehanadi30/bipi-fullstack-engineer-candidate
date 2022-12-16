const express = require('express')
const app = express()
const { graphqlHTTP } = require('express-graphql');
const port = 4000
const bodyParser = require('body-parser');
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        merchant(id: Int!): Merchant
        merchants(merchant_name:String): [Merchant]
    },
    type Merchant {
        id: Int
        merchant_name: String
        phone_number: String
        latitude : Float
        longitude : Float
        is_active: Boolean
        recorded_date_time : String
    }
`);

var merchantsData = [
    {
        id: 99,
        merchant_name: 'duar headshot',
        phone_number: '+62213213123213',
        longitude: 103.2,
        latitude: -6.4,
        is_active: false,
        recorded_date_time: '2022-12-16 07:00:00.000 +0700'
    }
]

var getMerchant = function(args) {
    var id = args.id;
    return merchantsData.filter(course => {
        return course.id == id;
    })[0];
}

var getMerchants = function(args) {
    return merchantsData;
}


var root = {
    merchant: getMerchant,
    merchants: getMerchants
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