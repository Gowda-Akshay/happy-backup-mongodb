const express = require('express');
const test = require('happy-backup-mongodb');

const app = express();
const port = 3000;

// Define a route for the root UR
//http://localhost:3000/backup?dbName=mongodb://localhost:27017/test
app.get('/backup', (req, res) => {
    test.backup(req,res)
    //res.send('Hello, World!');
});
//http://localhost:3000/restore?dbName=mongodb://localhost:27017
app.get('/restore', (req, res) => {
    test.restore(req,res)
    //res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
