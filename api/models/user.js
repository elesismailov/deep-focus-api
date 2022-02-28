
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {type: String, required: true},
    email: {type: String, required: true},
    entries: [{type: Schema.Types.ObjectId, ref: 'Entry'}],
	password: {type: String, required: true},
});

export.module = mongoose.models('User', UserSchema);
