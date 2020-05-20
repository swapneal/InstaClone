const express = require('express');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const router = express.Router();
const Post = mongoose.model('Post');
const requireLogin = require('../middleware/requireLogin');

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/all', requireLogin, (req, res) => {
	Post.find()
		.populate('postedBy', '_id name')
		.populate('comments.postedBy', '_id name')
		.then((posts) => {
			return res.status(200).json({
				success: true,
				posts,
			});
		})
		.catch((err) => {
			console.log(`Error in getting all the posts route: ${err}`);
		});
});

//@route POST /posts
//@description Creating Post
//access Public
router.post('/posts', requireLogin, (req, res) => {
	const { title, desc, url } = req.body;
	if (!title || !desc || !url) {
		return res.status(422).json({
			success: false,
			error: 'Please enter all the required fields',
		});
	}
	req.user.password = undefined;
	const post = new Post({
		title,
		desc,
		imageUrl: url,
		postedBy: req.user,
	});
	post.save()
		.then((result) => {
			res.status(200).json({
				success: true,
				payload: result,
			});
		})
		.catch((err) => {
			console.log(`Error in Post route: ${err}`);
		});
});

//@route Get api/users/current -
//@description To get the current user
//access Private
router.get('/profile', requireLogin, (req, res) => {
	Post.find({ postedBy: req.user.id })
		.populate('postedBy', '_id name')
		.then((posts) => {
			res.status(200).json({
				success: true,
				payload: posts,
			});
		})
		.catch((err) => {
			console.log(`Error in posting user's posts: ${err}`);
		});
});

router.put('/like', requireLogin, (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: {
				likes: req.user._id,
			},
		},
		{ new: true }
	)
		.populate('postedBy', '_id name')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({
					success: false,
					error: 'Like execution failed',
				});
			} else {
				res.status(200).json(result);
			}
		});
});

router.put('/unlike', requireLogin, (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$pull: { likes: req.user._id },
		},
		{ new: true }
	)
		.populate('postedBy', '_id name')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({
					success: false,
					error: 'Unlike execution failed',
				});
			} else {
				res.status(200).json(result);
			}
		});
});

router.put('/comment', requireLogin, (req, res) => {
	const comments = {
		text: req.body.text,
		postedBy: req.user._id,
	};
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: {
				comments,
			},
		},
		{ new: true }
	)
		.populate('postedBy', '_id name')
		.populate('comments.postedBy', '_id name')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({
					success: false,
					error: 'Like execution failed',
				});
			} else {
				res.status(200).json(result);
			}
		});
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
	Post.findOne({
		_id: req.params.postId,
	})
		.populate('postedBy', '_id')
		.exec((err, result) => {
			if (err || !result) {
				return res.status(422).json({ error: `Delete Post failed ${err}` });
			}
			if (result.postedBy._id.toString() === req.user._id.toString()) {
				result.remove().then((delPost) => {
					res.status(200)
						.json(delPost)
						.catch((err) => console.log(`Error in delete post route: ${err}`));
				});
			}
		});
});

router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
	Post.findById(req.params.postId)
		.then((post) => {
			// Get remove index
			const removeIndex = post.comments.map((item) => item._id.toString()).indexOf(req.params.commentId);
			// Splice comment out of array
			post.comments.splice(removeIndex, 1);
			post.save().then((post) => res.json({ payload: post }));
		})
		.catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;
