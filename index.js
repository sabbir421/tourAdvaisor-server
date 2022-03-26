
const express =require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const nodemailer = require("nodemailer");
const app = express();
const fileUpload =require('express-fileupload')
const port = process.env.PORT || 4000;
const ObjectId = require('mongodb').ObjectId;
// middelware

app.use(cors());
app.use(express.json());
app.use(fileUpload());

//nodemailer


//config database

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
    const addHotelCollection = database.collection("hotel")
    const addRoomCollection= database.collection("room")
    const rattingCollection= database.collection('feedback')




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

  app.delete('/hotelBookings/delete/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await hotelBookingCollection.deleteOne(query);

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

        app.post('/addHotel',async(req,res)=>{
            const hotelName=req.body.hotelName;
            const place=req.body.place;
            const dis=req.body.dis;
            const adminEmail=req.body.adminEmail;
            const pic =req.files.image;
            const picData = pic.data;
            const encodePic=picData.toString('base64');
            const imgBuffer= Buffer.from(encodePic,'base64')
            const hotel={
                hotelName,
                dis,
                place,
                adminEmail,
                image:imgBuffer
            }
            const result =await addHotelCollection.insertOne(hotel)
            
            
            res.json(result)

        })

        app.post('/feedback',async(req,res)=>{
            const userName=req.body.userName;
            const comment=req.body.comment;
            const rate=req.body.rate;
            const feedback={
                userName,
                comment,
                rate
            }
            const result = await rattingCollection.insertOne(feedback)
            res.json(result)
        })
        app.get('/feedback',async(req,res)=>{
            const cursor = rattingCollection.find({});
            const feedback= await cursor.toArray();
            res.send(feedback)
        })

        app.get('/addHotel', async(req,res)=>{
            const cursor= addHotelCollection.find({});
            const hotel = await cursor.toArray();
            res.send(hotel)
        })

        // data collection for rooms

        app.post('/room',async(req,res)=>{
           
            const type=req.body.type;
            const roomAdminEmail=req.body.roomAdminEmail;
            const dis=req.body.dis;
            const price=req.body.price;
            const ratting=req.body.ratting;
            const pic =req.files.image;
            const picData = pic.data;
            const encodePic=picData.toString('base64');
            const imgBuffer= Buffer.from(encodePic,'base64')
            const room={
                type,
                roomAdminEmail,
                price,
                dis,
                ratting,
                image:imgBuffer
            }
            const result =await addRoomCollection.insertOne(room)
            
            
            res.json(result)
        })

        app.get('/room',async(req,res)=>{
            const cursor = addRoomCollection.find({});
            const room= await cursor.toArray();
            res.send(room)
        })

    

        // data collections for hotelsBooking

        app.post('/hotelBooking', async(req,res)=>{
            const hotelBook = req.body;
            console.log("new post");
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
        app.get('/hotelBookings', async(req,res)=>{
            const cursor = hotelBookingCollection.find({});
            const hotelBooking = await cursor.toArray();
            res.send(hotelBooking)
           
           
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
        // admin put
        app.put('/users/admin', async(req,res)=>{
            const user =req.body;
            const filter = {email : user.email};
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        //super admin put
        app.put('/users/superAdmin', async(req,res)=>{
            const user =req.body;
            const filter = {email : user.email};
            const updateDoc = { $set: { role: 'superAdmin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // find admin

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            let isSuperAdmin=false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            if (user?.role === 'superAdmin') {
                isSuperAdmin = true;
            }
            res.json({ admin: isAdmin,superAdmin:isSuperAdmin });
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




