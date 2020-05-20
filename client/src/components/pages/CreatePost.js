import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';
const CreatePost = () => {
	const history = useHistory();
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const [image, setImage] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	useEffect(() => {
		if (imageUrl) {
			fetch('/posts', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
				body: JSON.stringify({
					title,
					desc,
					imageUrl,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.error) {
						M.toast({ html: data.error, classes: '#c62828 red darken-3' });
					} else {
						M.toast({ html: 'Post created Successfully', classes: '#a5d6a7 green lighten-3' });
						history.push('/');
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [imageUrl]);

	const postDetails = () => {
		const data = new FormData();
		data.append('file', image);
		data.append('upload_preset', 'instaclone');
		data.append('cloud_name', 'swapneal');
		fetch('https://api.cloudinary.com/v1_1/swapneal/image/upload', {
			method: 'post',
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				setImageUrl(data.url);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div
			className="card input-filed"
			style={{
				margin: '30px auto',
				maxWidth: '500px',
				padding: '20px',
				textAlign: 'center',
			}}
		>
			<input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
			<input type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
			<div className="file-field input-field">
				<div className="btn #64b5f6 blue darken-1">
					<span>Upload Image</span>
					<input type="file" onChange={(e) => setImage(e.target.files[0])} />
				</div>
				<div className="file-path-wrapper">
					<input className="file-path validate" type="text" />
				</div>
			</div>
			<button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postDetails()}>
				Submit post
			</button>
		</div>
	);
};

export default CreatePost;
