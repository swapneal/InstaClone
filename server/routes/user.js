const express = require('express');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

const requireLogin = require('../middleware/requireLogin');

router.get('/profile/:id', requireLogin, (req, res) => {
	User.findOne({ _id: req.params.id })
		.select('-password')
		.then((user) => {
			Post.find({ postedBy: req.params.id })
				.populate('postedBy', '_id name')
				.exec((err, posts) => {
					if (err) {
						return res.status(422).json({ success: false, error: `Error in finding user: ${err}` });
					}
					res.json({ payload: user, posts });
				});
		})
		.catch((err) => {
			return res.status(404).json({ success: false, error: 'User not found' });
		});
});

router.put('/follow', (req, res) => {
	User.findByIdAndUpdate
})


module.exports = router;
