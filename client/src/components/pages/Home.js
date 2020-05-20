import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import Spinner from './Spinner/Spinner';
import M from 'materialize-css';

const Home = () => {
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
			});
	}, []);

	const likePost = (id) => {
		fetch('/like', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
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
				console.log(err);
			});
	};
	const unlikePost = (id) => {
		fetch('/unlike', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
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
				console.log(err);
			});
	};

	const makeComment = (text, postId) => {
		fetch('/comment', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
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
				console.log(err);
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
							<h5 style={{ padding: '5px' }}>
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
										favorite_border
									</i>
								) : (
									<i
										className="material-icons #f44336 red-text"
										onClick={() => {
											likePost(item._id);
										}}
									>
										favorite
									</i>
								)}
								<h6>{item.likes.length} likes</h6>
								<h6>{item.title}</h6>
								<p>{item.body}</p>
								{item.comments.map((record) => {
									return (
										<h6 key={record._id}>
											<span style={{ fontWeight: '500' }}>{record.postedBy.name}</span>{' '}
											{record.text}
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

export default Home;
