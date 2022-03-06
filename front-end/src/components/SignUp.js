import React from 'react';


function SignUp() {
	function handleSubmit(event) {
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
