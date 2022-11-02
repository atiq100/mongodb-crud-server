const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//user : dbuser2
//password: vCdSaqwggORK4wpP


const uri = "mongodb+srv://dbuser2:vCdSaqwggORK4wpP@cluster0.6znnq0v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection = client.db('nodeMongoCrud').collection('users');
        // for data read from database(all data ex:name,email,id,address)
        app.get('/users',async(req,res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        //for get specific one data by id when client update user info
        app.get('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        // now for update data
        app.put('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const user = req.body
            const option = {upsert:true};

            const updatedUser = {
                $set:{
                    name:user.name,
                    email: user.email,
                    address: user.address

                }
            }
            const result = await userCollection.updateOne(filter,updatedUser,option);
            res.send(result)

        })
        //server theke data database e patanu and client theke recieve
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        //delete data
        app.delete('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('hello from node mongo crud server');
});

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})