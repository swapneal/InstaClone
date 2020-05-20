const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();
const User = mongoose.model('User');

//@route POST api/users/register
//@description Registering a user
//access Public
router.post('/register', (req, res) => {
	const { name, email, password } = req.body;

	if (!email || !password || !name) {
		return res.status(422).json({
			success: false,
			error: 'Please enter all the required fields',
		});
	}
	User.findOne({ email: email }).then((savedUser) => {
		if (savedUser) {
			return res.status(422).json({
				success: false,
				error: 'User already exists',
			});
		}
		bcrypt
			.hash(password, 12)
			.then((hashedPassword) => {
				const user = new User({
					name,
					email,
					password: hashedPassword,
				});
				user.save()
					.then((user) => {
						res.status(200).json({
							success: true,
							message: 'Saved Successful',
						});
					})
					.catch((err) => {
						res.status(422).json({
							success: false,
							error: 'Saved Unsuccessful',
						});
					});
			})
			.catch((err) => {
				console.log(`Error in Register Route: ${err}`);
			});
	});
});

//@route POST api/users/login
//@description Registering a user
//access Public
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(422).json({
			success: false,
			error: 'Please enter the required fields',
		});
	}
	User.findOne({ email: email }).then((savedUser) => {
		if (!savedUser) {
			return res.status(422).json({
				success: false,
				error: 'Invalid Email or Password',
			});
		}
		bcrypt
			.compare(password, savedUser.password)
			.then((doMatch) => {
				if (doMatch) {
					const { _id, name, email } = savedUser;
					const token = jwt.sign({ id: _id }, JWT_SECRET);
					res.status(200).json({
						success: true,
						payload: {
							token,
							user: {
								id: _id,
								name,
								email,
							},
						},
					});
				} else {
					return res.status(422).json({
						success: false,
						error: 'Invalid Email or Password',
					});
				}
			})
			.catch((err) => {
				console.log(`Error in Login Route: ${err}`);
			});
	});
});

module.exports = router;
