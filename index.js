
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors({
    origin: '*'
}));
const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient;

const URL = "mongodb+srv://akdonn47:ak1234567@cluster0.7evlonb.mongodb.net/"
app.use(express.json());


app.post("/create-user", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Users");
        let user = await db.collection("users").insertOne(req.body)
        await connection.close()
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})
app.get("/user", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        var db = connection.db("Users");
        var user = await db.collection("users").find({}).toArray();
        await connection.close();
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});
app.get("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Users");
        let objId = new mongodb.ObjectId(req.params.id);
        let user= await db.collection("users").findOne({ _id: objId });
        await connection.close();
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({ message: "user not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
})


app.delete("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Users");
        let objId = new mongodb.ObjectId(req.params.id);
        await db.collection("users").deleteOne({ _id: objId });
        res.json({ message: "user deleted!" });
        await connection.close();
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }

});

app.put("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Users");
        let objId = new mongodb.ObjectId(req.params.id);
        let user = await db.collection("users").findOneAndUpdate({ _id: objId }, { $set: req.body });

        await connection.close();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }

});
app.listen(process.env.PORT || 3000)