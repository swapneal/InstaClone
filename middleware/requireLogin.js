const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json({
			success: false,
			error: 'You  must be logged in',
		});
	}
	const token = authorization.replace('Bearer ', '');
	jwt.verify(token, JWT_SECRET, (err, payload) => {
		if (err) {
			return res.status(401).json({
				success: false,
				error: 'You  must be logged in',
			});
		}
		const { id } = payload;
		User.findById(id).then((userData) => {
			req.user = userData;
			next();
		});
	});
};
