const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 3000;
require('dotenv').config()
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2m0rny5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const servicesCollection = client.db('carDoctors').collection('services');
    // post orders database connection
    const ordersCollection = client.db('carDoctors').collection('orders');
    // get data from database
    app.get('/services', async(req, res) => {
        const result = await servicesCollection.find().toArray();
        res.send(result);
    })
    // get single data from database
    app.get('/services/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {title:1, price:1, service_id:1, img:1},
      }
      const result = await servicesCollection.findOne(query,options)
      res.send(result)
    })
    // post user order form client to database
    app.post('/orders', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const cursor = req.body
      const result = await ordersCollection.insertOne(cursor)
      res.send(result)
    })
    // get order data from database
    app.get('/orders', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const order = await ordersCollection.find(query).toArray()
      res.send(order)
    })
    // post api for send service data form client to database
    app.post('/services', async(req, res) => {
      const add = req.body
      const result = await servicesCollection.insertOne(add)
      res.send(result)
      console.log(add)
    });
    // delete single item from client site
    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await ordersCollection.deleteOne(query)
      res.send(result)
    })
    // api for update data only
    app.put('/orders:id', async (req, res) => {
      const id = req.params.id
      const updateOrder = req.body
      const query = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedOrder = {
        $set: {
          
        }
      }
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome the server is response')
})

app.listen(port, () => {
    console.log(`The response port ${port}`)
})