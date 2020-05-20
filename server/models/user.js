const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	followers: [
		{
			type: ObjectId,
			ref: 'User',
		},
	],
	following: [
		{
			type: ObjectId,
			ref: 'User',
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model('User', userSchema);
