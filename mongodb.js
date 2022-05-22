const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionUrl = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to mongodb");
    }
    const db = client.db(dbName);

    db.collection("tasks").insertOne(
        { description: "Go for shopping", completed: true },
      (error, result) => {
        if (error) {
          return console.log("unable to insert tasks");
        }
        console.log(result);
      }
    );
    // db.collection("users").insertMany([
    //   {
    //     name: "Desmond",
    //     age: 27,
    //   },
    //   {
    //     name: "Tetteh",
    //     age: 20,
    //   }
    // ])
  }
);
