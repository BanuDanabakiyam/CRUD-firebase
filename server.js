const express = require('express') 
const app = express();
const admin = require("firebase-admin")
const credentials = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})
const db = admin.firestore();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
const port = process.env.port || 8000;

app.post('/create',async(req,res) => {
    console.log(req.body)
    try{
        const id = req.body.email;
        const user = {
            email: req.body.email,
            name:req.body.name,
            age: req.body.age
        };
        // const response = await db.collection("UserDetails").add(user);
        const response = await db.collection("UserDetails").doc(id).set(user);
        res.send(response)
    }catch(error){
        res.send(error)
    }
})

app.get('/read/all',async(req,res) => {
    try{
        const details = db.collection("UserDetails");
        const response = await details.get();
        let userDetailsArray = [];
        response.forEach(doc => {
            const data = doc.data();
            const { email, name, age} = data;
            userDetailsArray.push({email, name, age})
        });
        res.send(userDetailsArray);

    }catch(error){
        res.send(error);
    }
})
app.get('/read/:id', async(req, res) => {
    try{
        const details = db.collection("UserDetails").doc(req.params.id);
        const response = await details.get();
        const data = response.data();
        const {email, name, age} = data;
        res.send({email, name, age});

    }catch(error){
        res.send(error);
    }
})

app.put('/update/:id',async(req,res) => {
    console.log("Inside update")
    try{
        const id = req.params.id;
        const details = await db.collection("UserDetails").doc(id).update({
            email: req.params.id,
            name: req.body.name,
            age: req.body.age

        });
        res.send(details);
     } catch(err) {
        res.send(err);

     }
})
app.delete('/delete/:id',async(req,res) => {
    try{
        const response = await db.collection("UserDetails").doc(req.params.id).delete();
        res.send(response);


    }catch(err){
        res.send(er);
    }

})


app.listen(port, () => {
    console.log("Yes i am listening");
})


