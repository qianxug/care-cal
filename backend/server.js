const express = require("express");
const bodyParser = require('body-parser');
const { default: mongoose } = require("mongoose");
const mongooose = require('mongoose')
const cors = require('cors');
const app = express();
const User = require("./models/careCal");

const username = 'qianxug'
const password = 'qianxug'

const uri = `mongodb+srv://${username}:${password}@carecal.9gwkvv8.mongodb.net/?retryWrites=true&w=majority`


mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log("connected to MongoDB")
        app.listen(8000, () => {
            console.log("server started on port 8000")
        })
    })
    .catch((error) => console.log(error));
   
//----------------------------------------------------------------------------------//
app.use(bodyParser.json());
app.use(cors());

app.post('/api/register', (req, res) => {
    const data = req.body; 
    console.log(data)

    const user = new User(data)

    user.save()
        .then((result)=> {
            res.send(result);
        })
});

app.post('/api/login', (req, res) => {
    const { Email } = req.body; 

    User.findOne({ Email })
      .then((user) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
  });

app.post('/api/products', (req, res) => {
    // Handle the incoming POST request
    const data = req.body; // Access the data sent from the frontend
  
    // Perform operations with the data (e.g., save to MongoDB using Mongoose)
  
    // Send a response back to the frontend
    res.json({ message: 'Data received and processed successfully' });
  });