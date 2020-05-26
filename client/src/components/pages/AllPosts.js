import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import Spinner from './Spinner/Spinner';
import M from 'materialize-css';
import '../styles/home.css';

const AllPosts = () => {
	const [data, setData] = useState([]);
	const { state, dispatch } = useContext(UserContext);
	useEffect(() => {
		fetch('/all', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				setData(result.posts);
			})
			.catch((err) => {
				console.log(`Error in Home use effect getting all posts => ${err}`);
			})
			.catch((err) => {
				console.log(`Error in Home use effect getting all posts => ${err}`);
			});
	}, []);

	const likePost = (id) => {
		fetch('/like', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id === result._id) {
						return result;
					} else {
						return item;
					}
				});
				setData(newData);
			})
			.catch((err) => {
				console.log(`Error in Home like post => ${err}`);
			})
			.catch((err) => {
				console.log(`Error in Home like post => ${err}`);
			});
	};
	const unlikePost = (id) => {
		fetch('/unlike', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id === result._id) {
						return result;
					} else {
						return item;
					}
				});
				setData(newData);
			})
			.catch((err) => {
				console.log(`Error in Home unlike => ${err}`);
			})
			.catch((err) => {
				console.log(`Error in Home unlike => ${err}`);
			});
	};

	const makeComment = (text, postId) => {
		fetch('/comment', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify({
				postId,
				text,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id === result._id) {
						return result;
					} else {
						return item;
					}
				});
				setData(newData);
			})
			.catch((err) => {
				console.log(`Error in Home comment => ${err}`);
			})
			.catch((err) => {
				console.log(`Error in Home comment => ${err}`);
			});
	};

	const deletePost = (postid) => {
		fetch(`/deletepost/${postid}`, {
			method: 'delete',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.filter((item) => {
					return item._id !== result._id;
				});
				setData(newData);
				M.toast({ html: 'Post delete Successful', classes: '#a5d6a7 green lighten-3' });
			})
			.catch((err) => {
				console.log(`Error in Home delete post => ${err}`);
			})
			.catch((err) => {
				console.log(`Error in Home delete post => ${err}`);
			});
	};

	return (
		<div className="home">
			{data.length === 0 ? (
				<Spinner />
			) : (
				data.map((item) => {
					return (
						<div className="card home-card #e3f2fd blue lighten-5" key={item._id}>
							<h5 className="profile-name user-name">
								<Link
									to={item.postedBy._id !== state.id ? `/profile/${item.postedBy._id}` : `/profile`}
								>
									{item.postedBy.name}
								</Link>{' '}
								{item.postedBy._id === state.id && (
									<i className="material-icons right red-text" onClick={() => deletePost(item._id)}>
										delete
									</i>
								)}
							</h5>
							<div className="card-image">
								<img src={item.imageUrl} />
							</div>
							<div className="card-content">
								{item.likes.includes(state.id) ? (
									<i
										className="material-icons #f44336 red-text"
										onClick={() => {
											unlikePost(item._id);
										}}
									>
										favorite
									</i>
								) : (
									<i
										className="material-icons #f44336 red-text"
										onClick={() => {
											likePost(item._id);
										}}
									>
										favorite_border
									</i>
								)}
								<h6>
									{item.likes.length} like{item.likes.length === 1 ? '' : 's'}
								</h6>
								<h6>{item.title}</h6>
								<p>{item.body}</p>
								{item.comments.map((record) => {
									return (
										<h6 key={record._id}>
											<span className="comment-name">{record.postedBy.name}</span> {record.text}
										</h6>
									);
								})}
								<form
									onSubmit={(e) => {
										e.preventDefault();
										makeComment(e.target[0].value, item._id);
									}}
								>
									<input type="text" placeholder="Add comment" />
								</form>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default AllPosts;
