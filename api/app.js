

const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = express();

app.get('/', function(req, res) {
	res.send('helluwwuwuwu');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
	console.log(`Running on http://localhost:${PORT}`)
);
