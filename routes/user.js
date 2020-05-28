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

router.put('/follow', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId,
		{
			$push: { followers: req.user.id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: `Error occured in follow model ==> ${err}` });
			}
			User.findByIdAndUpdate(
				req.user.id,
				{
					$push: { following: req.body.followId },
				},
				{ new: true }
			)
				.select('-password')
				.then((result) => res.json(result))
				.catch((err) => {
					return res.status(422).json({ error: `Error occured in follow model ==> ${err}` });
				});
		}
	);
});

router.put('/unfollow', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{
			$pull: { followers: req.user.id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: `Error occured in unfollow model ==> ${err}` });
			}
			User.findByIdAndUpdate(
				req.user.id,
				{
					$pull: { following: req.body.unfollowId },
				},
				{ new: true }
			)
				.select('-password')
				.then((result) => res.json(result))
				.catch((err) => {
					return res.status(422).json({ error: `Error occured in unfollow model ==> ${err}` });
				});
		}
	);
});

router.put('/updateDP', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.user.id,
		{
			$set: { dp: req.body.dp },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: `Error occured in update DP model ==> ${err}` });
			}
			res.json(result);
		}
	);
});

router.post('/searchusers', (req, res) => {
	let userPattern = new RegExp('^' + req.body.query);
	User.find({ email: { $regex: userPattern } })
		.select('_id email name dp')
		.then((user) => {
			res.json({ user });
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
