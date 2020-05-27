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
	dp: {
		type: String,
		default: 'https://res.cloudinary.com/swapneal/image/upload/v1590532280/avatar-1577909_640_lqnx0z.png',
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
