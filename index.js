const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// managed-services
// Iu6iJlvTcG9FW31T
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://managed-services:Iu6iJlvTcG9FW31T@cluster0.qygdymi.mongodb.net/?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const parsonCollation = client.db('managedServices').collection('parson');
    const companyCollation = client.db('managedServices').collection('company');
    const itemCollation = client.db('managedServices').collection('item')


    app.get('/parson', async(req,res)=>{
      const cursor = parsonCollation.find();
      const result = await cursor.toArray()
      res.send(result)

    })
   app.get('/company', async(req ,res) => {
      const cursor = companyCollation.find()
      const result = await cursor.toArray()
      res.send(result)
   })
   app.get('/item', async(req, res) => {
      const cursor = itemCollation.find()
      const result = await cursor.toArray()
      res.send(result)
   })
   app.get('/item/:id', async(req ,res) => {
      const oneItem = req.params.id;
      const query = {_id: new ObjectId (oneItem)};
      const options ={ 
        projection:{img:1,name:1,dissertation:1,price:1,img2:1,},
      }
      const result = await itemCollation.findOne(query,options);
      res.send(result)

   })
    
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World my name is israfil!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})