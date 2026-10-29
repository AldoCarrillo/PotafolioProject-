// Add code to userModel.js to complete the model

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;


const Workout = require("./models/workoutModel.js");
const { json } = require("express");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false



});

// Routes

// Route to post our form submission to mongoDB via mongoose

app.get("/api/workouts", (req, res) => {

    Workout
    .find({})
    .then(data =>{
        res.json(data);
    });

});


app.put("/api/workouts/:id", (req, res) => {

    const id = req.params.id;
    const data = req.body;

    Workout
        .updateOne({_id: id},  {$push:{exercises: data},day: new Date().getTime() })
        .then(res =>{
            console.log(res);
        });

});


app.post("/api/workouts", (req, res) => {

    const workout = new Workout(req.body);
    Workout
        .create(workout)
        .then(dbWorkout => {
            // If saved successfully, send the the new User document to the client
            res.json(dbWorkout);
        })
        .catch(err => {
            // If an error occurs, send the error to the client
            res.json(err);
        });

});

app.get("/api/workouts/range", (req, res) => {

    Workout
    .find({})
    .then(data =>{
        res.json(data);

    });

});


// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
