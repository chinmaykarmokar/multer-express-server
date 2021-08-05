const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');

const app = express ();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null , file.originalname );
    }
});

const upload = multer({ storage: storage })

// Parse JSON

app.use(express.json());

// Use CORS

app.use(cors());

// Serve Static Files

app.use(express.static('uploads'));

// Creating connection to our MySQL Database

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    tls: {
        rejectUnauthorized: false
    }
})

connection.connect((err) => {
    if (err) throw err;
})

app.get('/', (req,res) => {
    let selectQuery = "SELECT * FROM products;";
    
    connection.query(selectQuery, (err, result, fields) => {
        if (err) throw err;

        res.send({
            status: 200,
            err: null,
            result: result
        })
    })
})

app.post('/', upload.single('file'), (req,res) => {
    let name = req.body.name;
    let price = req.body.price;
    let filename = req.body.filename;

    let postQuery = "INSERT INTO products (name,price,file) VALUES ('" + name + "', '" + price + "', '" + filename.substring(filename.length, 11) + "');";
    console.log(postQuery);
    connection.query(postQuery, (err,result,fields) => {
        if (err) { throw err };
        
        res.send('Response has been recorded...');
    })
})

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) throw err;

    else {
        console.log('Server is running at Port: ' + port);
    }
})