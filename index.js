const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user:"root",
    password:"",
    database:"movie_info"
})

db.connect((err)=>{
    if(err){
        console.error('Error connecting to the database:', err);
    }
    else{
        console.log('Connected to the database.');
    }
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get("/movie",(req,res)=>{
    const query = "select Movie_ID,Movie_Name,Genre, Year, IMDb_Rating, director.Director_Name from movie join director on movie.Director_ID = director.Person_ID;";
    db.query(query,(err, results)=>{
        if(err){
            console.error('Error fetching data from database:', err);
            res.status(500).send('Error fetching data from database');
        }
        else{
            res.json(results);
        }
    });
});

app.post("/addmovie",(req,res)=>{
    const {Movie_Name, Genre, Year, IMDb_Rating,Director_ID} = req.body;
    const query = "insert into movie (Movie_Name, Genre, Year, IMDb_Rating, Director_ID) values (?,?,?,?,?)";
    db.query(query,[Movie_Name, Genre, Year, IMDb_Rating,Director_ID],(err, results)=>{
        if(err){
            console.error('Error inserting data into database:', err);
            res.status(500).send('Error inserting data into database');
        }
        else{
            res.send('Movie added successfully');
        }
    })
});

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})