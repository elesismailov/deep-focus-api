const jwt = require('jsonwebtoken');

const User = require('../models/user');

function authenticate(req, res, next) {
	// get Authorization headers
	const bearer = req.headers['authorization'];
	if (!bearer) {
		res.status(401).send('Please Log In');
		return
	}

	// get the token
	const token = bearer.split(' ')[1];
	if (!token) {
		res.status(400).send('Please provide token');
		return
	} 

	jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
		if (err) {
			res.status(400).send(err);
			return
		} 

		// check whether the decoded data is in the db
		User.findById(decoded.id).exec( (err, user) => {
			if (err || !user) {
				res.status(404).send('User does not exist');
				return
			}
			req.currentUser = user;
			next()
		})
	});
};

module.exports = authenticate;
