import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const UpdatePassword = () => {
	const history = useHistory();
	const [password, setPasword] = useState('');
	const { token } = useParams();

	const UpdatePwd = () => {
		fetch('/updatepwd', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password,
				token,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					M.toast({ html: data.error, classes: '#c62828 red darken-3' });
				} else {
					M.toast({ html: data.message, classes: '#a5d6a7 green lighten-3' });
					history.push('/login');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="mycard ">
			<div className="card auth-card input-field #e3f2fd blue lighten-5">
				<h2>MeroInsta</h2>
				<input
					type="password"
					placeholder="Enter New Password"
					value={password}
					onChange={(e) => setPasword(e.target.value)}
				/>
				<button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => UpdatePwd()}>
					Update Password
				</button>
			</div>
		</div>
	);
};

export default UpdatePassword;
