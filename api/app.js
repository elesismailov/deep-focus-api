

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const initializeMongo = require('./mongoConfig');

const app = express();

const User = require('./models/user');

initializeMongo()

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('helluwwuwuwu');
});

app.post('/sign-up', async function(req, res) {
	// simple sanitization
	const { email, username, password } = req.body;
	if ( !(email && username && password)) {
		res.sendStatus(400)
		return 
	}

	// check whether user already exists
	//const exists = await User.findOne({ email });
	//if (exists) {
	//	res.status(400).send('User already exists');
	//	return
	//}

	// hash the password
	let hash;
	try {
		const salt = await bcrypt.genSalt(7);
		hash = await bcrypt.hash(password, salt);
	} catch(err) {
		console.log(err)
		res.sendStatus(500)
		return 
	}
	
	const user = new User({
		email,
		username,
		password: hash
	});
	
	// save new user
	if (user) {
		const u = await user.save();
		if (u) {
			res.sendStatus(201);
			return
		}
	}
	res.sendStatus(500)
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => 
	console.log(`Running on http://localhost:${PORT}`)
);
