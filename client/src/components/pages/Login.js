import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';
const Login = () => {
	const { state, dispatch } = useContext(UserContext);
	const history = useHistory();
	const [password, setPasword] = useState('');
	const [email, setEmail] = useState('');
	const PostData = () => {
		if (
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			M.toast({ html: 'invalid email', classes: '#c62828 red darken-3' });
			return;
		}
		fetch('/login', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password,
				email,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					M.toast({ html: data.error, classes: '#c62828 red darken-3' });
				} else {
					localStorage.setItem('token', data.payload.token);
					localStorage.setItem('user', JSON.stringify(data.payload.user));
					dispatch({ type: 'USER', payload: data.user });
					M.toast({ html: 'signedin success', classes: '#a5d6a7 green lighten-3' });
					history.push('/');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="mycard ">
			<div className="card auth-card input-field #e3f2fd blue lighten-5">
				<h2>Instaclone</h2>
				<input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPasword(e.target.value)}
				/>
				<button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}>
					Login
				</button>
				<h5>
					<Link to="/register">Dont have an account ?</Link>
				</h5>
				<h6>
					<Link to="/reset">Forgot password ?</Link>
				</h6>
			</div>
		</div>
	);
};

export default Login;
