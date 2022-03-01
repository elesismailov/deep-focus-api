if (process.env.NODE_ENV === 'development') require('dotenv').config();

const mongoose = require('mongoose');

function initializeMongo() {
	const mongoUri = process.env.MONGO_URI;
	mongoose.connect(mongoUri, {
		useNewUrlParser: true,
	})
	const connection = mongoose.connection;

	connection.on('err', () => console.log(err));
	connection.on('open', () => console.log('Ready for interactions...'));
}

module.exports = initializeMongo;
