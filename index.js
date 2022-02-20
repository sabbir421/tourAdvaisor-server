
const express =require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;
const ObjectId = require('mongodb').ObjectId;
// middelware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwsc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        console.log("wow connected");
        const database = client.db("tourGuide");
    const ServicesCollection = database.collection("services");
    const bookingCollection = database.collection("bookingorder");
    const hotelBookingCollection = database.collection("hotelBookingCollection")
    const usersCollection = database.collection("users")
    const addHotelCollection = database.collection("hotels")




    app.post('/bookingorder',async(req,res)=>{
        const booking = req.body;
        console.log("heat from booking api",booking);
        
        const result = await bookingCollection.insertOne(booking);
        console.log(result);
        res.json(result)
    });

    //Get All Booking Order
    app.get('/bookingorder', async(req,res)=>{
        const cursor = bookingCollection.find({});
        const booking = await cursor.toArray();
        res.send(booking)
    })


  app.delete('/bookingorder/delete/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await bookingCollection.deleteOne(query);

    console.log('deleting user with id ', result);

    res.json(result);
})



    // get api
    app.get('/services', async(req,res)=>{
        const cursor = ServicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
    })

    // post api
        app.post('/services',async(req,res)=>{
            const service = req.body;
            console.log("heat from post api",service);
            
            const result = await ServicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        //data colections for hotel

        app.post('/addHotels',async(req,res)=>{
            const hotel = req.body;
            console.log("heat from post api",hotel);
            
            const result = await addHotelCollection.insertOne(hotel);
            console.log(result);
            res.json(result)
        });

        app.get('/addHotels', async(req,res)=>{
            const cursor = addHotelCollection.find({});
            const hotel = await cursor.toArray();
            res.send(hotel)
        })
    

        // data collections for hotelsBooking

        app.post('/hotelBooking', async(req,res)=>{
            const hotelBook = req.body;
            console.log("heat from post api",hotelBook);
            const result = await hotelBookingCollection.insertOne(hotelBook);
            res.json({message:"hello"}) 
        })

        app.get('/hotelBooking', async(req,res)=>{
            const email=req.query.email;
            const query={email: email}
           const cursor = hotelBookingCollection.find(query);
           const hotelBooking=await cursor.toArray();
           res.json(hotelBooking);
        })

        // user api

        app.post('/users', async(req,res)=>{
            const user = req.body;
            
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result) 
        })
        app.put('/users',async (req,res)=>{
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        app.put('/users/admin', async(req,res)=>{
            const user =req.body;
            const filter = {email : user.email};
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // find admin

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('running tour server');

});
app.listen(port,()=>{
    console.log('running tour server port on',port);
})




