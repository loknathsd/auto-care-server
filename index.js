const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();

const port =5000

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfsjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("autoCareStore").collection("services");

  const reviewCollection = client.db("autoCareStore").collection("reviews");

  const adminCollection = client.db("autoCareStore").collection("admins");

  const orderCollection = client.db("autoCareStore").collection("orders");

  app.post('/addService',(req,res)=>{
    const service = req.body
    serviceCollection.insertOne(service)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addReview',(req,res)=>{
    const review = req.body;
    console.log(review)
    reviewCollection.insertOne(review)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/makeAdmin',(req,res)=>{
    const email = req.body.email;
    adminCollection.insertOne({email})
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin',(req,res)=>{
    const email = req.body.email
    adminCollection.find({email:email})
    .toArray((err,documents)=>{
      res.send(documents.length >0 )
    })
  })
  
  app.post('/addOrder',(req,res)=>{
    const order = req.body
    orderCollection.insertOne(order)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })




  app.get('/reviews',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })

  })

  app.get('/services',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/service/:id',(req,res)=>{
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    serviceCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result=>{
    })
  })
  app.get('/orders',(req,res)=>{
    console.log(req.query.email)
    orderCollection.find({userEmail:req.query.email})
    .toArray((err,documents)=>{ 
      console.log(documents)
      res.send(documents)
    })
  })

  app.get('/allOrders',(req,res)=>{
    orderCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

 
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port) 