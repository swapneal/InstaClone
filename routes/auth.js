const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { JWT_SECRET, SENDGRID_API_KEY, EMAIL } = require('../config/keys');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const router = express.Router();
const User = mongoose.model('User');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: SENDGRID_API_KEY,
		},
		tls: {
			rejectUnauthorized: false,
		},
	})
);

//@route POST api/users/register
//@description Registering a user
//access Public
router.post('/register', (req, res) => {
	const { name, email, password, dp } = req.body;

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
					dp,
				});
				user.save()
					.then((user) => {
						res.status(200).json({
							success: true,
							message: 'Saved Successful',
						});
						transporter
							.sendMail({
								to: user.email,
								from: 'no-reply@meroinsta.com',
								subject: 'Welcome to MeroInsta',
								html: `<h1> Dear ${user.name} Welcome to MeroInsta</h1><div>Hope you enjoy</div>`,
							})
							.then(() => console.log('Email sent'))
							.catch((err) => {
								console.log(`Email sent failed==> ${err}`);
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
					const { _id, name, email, followers, following, dp } = savedUser;
					const token = jwt.sign({ id: _id }, JWT_SECRET);
					res.status(200).json({
						success: true,
						payload: {
							token,
							user: {
								id: _id,
								name,
								email,
								followers,
								following,
								dp,
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

router.post('/resetpwd', (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(`Error in reset password route: ${err}`);
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email }).then((user) => {
			if (!user) {
				return res.status(422).json({ error: `User doesn't exist with that email` });
			}
			user.resetToken = token;
			user.expireToken = Date.now() + 3600000;
			user.save()
				.then((result) => {
					transporter.sendMail({
						to: user.email,
						from: 'no-replay@meroinsta.com',
						subject: 'password reset',
						html: `
                     <p>You requested for password reset</p>
                     <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                     `,
					});
					res.json({ message: 'Check your Email' });
				})
				.catch((err) => console.log(`Error in reset password route: ${err}`));
		});
	});
});

router.post('/updatepwd', (req, res) => {
	const updatePassword = req.body.password;
	const sentToken = req.body.token;
	User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
		.then((user) => {
			if (!user) {
				return res.status(422).json({ error: 'Try again session expired' });
			}
			bcrypt.hash(updatePassword, 12).then((hashedpassword) => {
				user.password = hashedpassword;
				user.resetToken = undefined;
				user.expireToken = undefined;
				user.save()
					.then((saveduser) => {
						res.json({ message: 'Password Updated Successful' });
					})
					.catch((err) => {
						console.log(`Error in new password route: ${err}`);
					});
			});
		})
		.catch((err) => {
			console.log(`Error in new password route: ${err}`);
		});
});

module.exports = router;
