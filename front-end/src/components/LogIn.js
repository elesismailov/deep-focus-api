
import React from 'react';


function LogIn() {
	function handleSubmit(event) {
		event.preventDefault();
		const response = fetch('http://localhost:3000/log-in', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: event.target.email.value,
				password: event.target.password.value
			}),
		});
		response.then(res => res.json())
			.then(res => localStorage.setItem('token', res.token));
	}
	return (
		<form onSubmit={ handleSubmit }>
			<h1>Log In</h1>
			<label>
				<p>Email:</p>
				<input type="text" name='email' required />
			</label>
			<label>
				<p>Password:</p>
				<input type="password" name='password' required />
			</label>
			<button type="submit">Log In</button>
		</form>
	);
}

export default LogIn;
