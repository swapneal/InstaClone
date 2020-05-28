import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ResetPassword = () => {
	const history = useHistory();
	const [email, setEmail] = useState('');

	const ResetPwd = () => {
		if (
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			M.toast({ html: 'invalid email', classes: '#c62828 red darken-3' });
			return;
		}
		fetch('/resetpwd', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
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
				console.log(`Error in reset password ==> ${err}`);
			});
	};

	return (
		<div className="mycard ">
			<div className="card auth-card input-field #e3f2fd blue lighten-5">
				<h2>MeroInsta</h2>
				<input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => ResetPwd()}>
					Reset Password
				</button>
			</div>
		</div>
	);
};

export default ResetPassword;
