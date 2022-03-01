

const express = require('express');
const mongoose = require('mongoose');

const initializeMongo = require('./mongoConfig');

const app = express();

initializeMongo()

app.get('/', function(req, res) {
	res.send('helluwwuwuwu');
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => 
	console.log(`Running on http://localhost:${PORT}`)
);
