const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://managed-services:Iu6iJlvTcG9FW31T@cluster0.qygdymi.mongodb.net/?retryWrites=true&w=majority`;

    const verifyJwt = (req, res, next) => {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).send({ error: true, message: "not verify parson" });
      }
      const token = authorization.split(" ")[1];
      jwt.verify(
        token,
        'ee4a26080b23b0f1c5a11b7b839759a919c084f67b552f702e4cfafa25caa751aca5b44ed43bd565ddbe91ea568a57281c9b31ebadff8d9761eeeabb0ecd161d',
        (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .send({ error: true, massage: "not verify parson" });
          }
          req.decoded = decoded;
          next();
        }
      );
    };

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const itemCollation = client.db('managedServices').collection('item');
    const parsonCollation = client.db('managedServices').collection('parson');
    const companyCollation = client.db('managedServices').collection('company');
    const parsonContactCollation = client.db('managedServices').collection('parsonContact')
    const userParsonCollation = client.db('managedServices').collection('userParson')


    app.get('/parson', async(req,res)=>{
      const cursor = parsonCollation.find();
      const result = await cursor.toArray()
      res.send(result)

    })
      app.post("/jwt", (req, res) => {
        const user = req.body;
        const token = jwt.sign(
          user,
          'ee4a26080b23b0f1c5a11b7b839759a919c084f67b552f702e4cfafa25caa751aca5b44ed43bd565ddbe91ea568a57281c9b31ebadff8d9761eeeabb0ecd161d',
          { expiresIn: "100h" }
        );
        res.send(token);
      });

      app.post('/userParson', async(req,res) => {
        const cursor = req.body;
        const result = await userParsonCollation.insertOne(cursor)
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
   app.post('/item', async(req,res) => {
      const cursor = req.body;
      const result = await itemCollation.insertOne(cursor)
      res.send(result)

   })
   app.get('/item/:id', async(req ,res) => {
      const oneItem = req.params.id;
      const query = {_id: new ObjectId (oneItem)};
      const options ={ 
        projection:{img:1,name:1,dissertation:1,price:1,img2:1,_id:1,},
      }
      const result = await itemCollation.findOne(query,options);
      res.send(result)

   })
   app.patch('/item/:id', async (req, res) => {
      const itemId = req.params.id;
      const query = { _id: new ObjectId(itemId) };
      const option = {upsert: true}
      const  updateItem= req.body
      const item ={
        $set:{
          name:updateItem.name,
          img:updateItem.img,
          note:updateItem.note,
          price:updateItem.price,
          img2:updateItem.img2,
          dissertation:updateItem.dissertation
        }
      }
      const result = await itemCollation.updateOne(query,item,option);
      res.send(result)
    });

    app.delete('/item/:id', async (req,res) => {
      const id = req.params.id;
      const deleteId = { _id: new ObjectId(id) };
      const deleteFromCollection = await itemCollation.deleteOne(deleteId);
      res.send(deleteFromCollection);

    })
   app.post('/parsonContact', async(req,res) => {
        const contact = req.body;
        const result = await parsonContactCollation.insertOne(contact)
        res.send(result)
   })

  app.get('/parsonContact', async (req, res) => {
    const cursor = parsonContactCollation.find()
    const result = await cursor.toArray()
    res.send(result);
  });

    
  
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