const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jbxtt4r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const eventCollection = client.db('bdVolunteer').collection('events');

        app.get('/events' , async(req , res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page,size);
            const query = {}
            const cursor = eventCollection.find(query);
            const events = await cursor.skip(page*size).limit(size).toArray();
            const count = await eventCollection.estimatedDocumentCount();
            res.send({count, events});
        })

        app.get('/event/:id' , async(req , res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const event = await eventCollection.findOne(query)
            res.send(event)
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))

app.get('/' , (req , res)=>{
   res.send('BD volunteer server is running')
})


app.listen(port , ()=> console.log('> Server running on port : ' + port))