import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import Spinner from './Spinner/Spinner';
import '../styles/profile.css';

const Profile = () => {
	const [pics, setPics] = useState([]);
	const { state, dispatch } = useContext(UserContext);
	const [dp, setDp] = useState('');
	useEffect(() => {
		fetch('/profile', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				setPics(result.payload);
			})
			.catch((err) => console.log(`Error in Profile loading ${err}`))
			.catch((err) => console.log(`Error in Profile loading ${err}`));
	}, []);
	useEffect(() => {
		if (dp) {
			const data = new FormData();
			data.append('file', dp);
			data.append('upload_preset', 'instaclone');
			data.append('cloud_name', 'swapneal');
			fetch('https://api.cloudinary.com/v1_1/swapneal/image/upload', {
				method: 'post',
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					fetch('/updateDP', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('token'),
						},
						body: JSON.stringify({
							dp: data.url,
						}),
					})
						.then((res) => res.json())
						.then((result) => {
							localStorage.setItem(
								'user',
								JSON.stringify({
									...state,
									dp: result.dp,
								})
							);
							dispatch({
								type: 'UPDATE_DP',
								payload: result.dp,
							});
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [dp]);

	const updateDP = (file) => {
		setDp(file);
	};
	return (
		<div style={{ maxWidth: '550px', margin: '0px auto' }}>
			{state === null ? (
				<Spinner />
			) : (
				<>
					<div
						style={{
							margin: '18px 0px',
							borderBottom: '1px solid grey',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-around',
							}}
						>
							<div>
								<img
									style={{ width: '160px', height: '160px', borderRadius: '80px' }}
									src={state ? state.dp : 'loading'}
									alt="post-pic"
								/>
							</div>
							<div>
								<h4>{state ? state.name : 'loading'}</h4>
								<h5>{state ? state.email : 'loading'}</h5>
								<div className="profile-info">
									<h6>
										{pics.length} post{pics.length === 1 ? '' : 's'}
									</h6>
									<h6>
										{state ? state.followers.length : '0'} follower
										{state.followers.length === 1 ? '' : 's'}
									</h6>
									<h6>{state ? state.following.length : '0'} following</h6>
								</div>
							</div>
						</div>

						<div className="file-field input-field" style={{ margin: '10px' }}>
							<div className="btn #64b5f6 blue darken-1">
								<i className="material-icons small">add_a_photo</i>
								<input type="file" onChange={(e) => updateDP(e.target.files[0])} />
							</div>
							<div className="file-path-wrapper">
								<input className="file-path validate" type="text" />
							</div>
						</div>
					</div>
					<div className="gallery">
						{pics.map((item) => {
							return <img key={item._id} className="item" src={item.imageUrl} alt={item.title} />;
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default Profile;
