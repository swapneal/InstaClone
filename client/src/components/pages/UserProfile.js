import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import Spinner from './Spinner/Spinner';
import '../styles/profile.css';

const UserProfile = () => {
	const [userprofile, setUserprofile] = useState(null);
	const { state, dispatch } = useContext(UserContext);
	const { profileId } = useParams();

	useEffect(() => {
		fetch(`/profile/${profileId}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				console.log('User Profile ==>  ', result);
				setUserprofile(result);
			})
			.catch((err) => console.log(`Error in Profile loading ${err}`))
			.catch((err) => console.log(`Error in Profile loading ${err}`));
	}, []);
	return (
		<div style={{ maxWidth: '550px', margin: '0px auto' }}>
			{userprofile === null ? (
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
									src={state ? state.pic : 'loading'}
								/>
							</div>
							<div>
								<h4>{userprofile ? userprofile.payload.name : 'loading'}</h4>
								<h5>{userprofile ? userprofile.payload.email : 'loading'}</h5>
								<div className="profile-info">
									<h6>
										{userprofile.posts.length} post{userprofile.posts.length === 1 ? '' : 's'}
									</h6>
									<h6>
										{userprofile ? userprofile.payload.followers.length : '0'} follower{userprofile.payload.followers.length === 1 ? '' : 's'}
									</h6>
									<h6>{userprofile ? userprofile.payload.following.length : '0'} following</h6>
								</div>
							</div>
						</div>
					</div>
					<div className="gallery">
						{userprofile.posts.map((item) => {
							return <img key={item._id} className="item" src={item.imageUrl} alt={item.title} />;
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default UserProfile;
