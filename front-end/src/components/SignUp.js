import React from 'react';


function SignUp() {
	function handleSubmit(event) {
		event.preventDefault();

		const response = fetch('http://localhost:3000/sign-up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: event.target.email.value,
				username: event.target.username.value,
				password: event.target.password.value,
			}),
		});
		response.then(res => res.json())
			.then(res => localStorage.setItem('token', res.token));
	}
	return (
		<form onSubmit={ handleSubmit }>
			<h1>Sign Up</h1>
			<label>
				<p>Email:</p>
				<input type="email" name='email' required />
			</label>
			<label>
				<p>Username:</p>
				<input type="text" name='username' required />
			</label>
			<label>
				<p>Password:</p>
				<input type="password" name='password' required />
			</label>
			<button type="submit">Sign Up</button>
		</form>
	);
}

export default SignUp;
