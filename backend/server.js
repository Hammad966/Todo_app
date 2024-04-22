const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser")
const cors = require("cors")
// or as an es module:
// import { MongoClient } from 'mongodb'
dotenv.config();
// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "passop";

const port = 3000;
app.use(bodyparser.json())
client.connect();
app.use(cors())

app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

app.post("/", async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
  });

  app.delete("/", async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result: findResult})
  });

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
