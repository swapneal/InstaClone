import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';

import './App.css';
import { reducer, initialState } from './reducers/userReducer';

import NavBar from './components/Navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Profile from './components/pages/Profile';
import Register from './components/pages/Register';
import CreatePost from './components/pages/CreatePost';
import UserProfile from './components/pages/UserProfile';
import FollowingPosts from './components/pages/FollowingPosts';
import ResetPassword from './components/pages/ResetPassword';
import UpdatePassword from './components/pages/UpdatePassword';

export const UserContext = createContext();

const Routing = () => {
	const history = useHistory();
	const { state, dispatch } = useContext(UserContext);
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) {
			dispatch({ type: 'USER', payload: user });
		} else {
			if (!history.location.pathname.startsWith('/reset')) history.push('/login');
		}
	}, []);
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route path="/login">
				<Login />
			</Route>
			<Route path="/register">
				<Register />
			</Route>
			<Route exact path="/profile">
				<Profile />
			</Route>
			<Route path="/new">
				<CreatePost />
			</Route>
			<Route path="/profile/:profileId">
				<UserProfile />
			</Route>
			<Route path="/following">
				<FollowingPosts />
			</Route>
			<Route exact path="/reset">
				<ResetPassword />
			</Route>
			<Route path="/reset/:token">
				<UpdatePassword />
			</Route>
		</Switch>
	);
};

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<UserContext.Provider value={{ state, dispatch }}>
			<Router>
				<NavBar />
				<Routing />
			</Router>
		</UserContext.Provider>
	);
}

export default App;
