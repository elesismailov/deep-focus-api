
import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
	
	return (
		<header>
			<nav><ul>
				<li><Link to='/'>Main</Link></li>
				<li><Link to='/sign-up'>Sign Up</Link></li>
				<li><Link to='/log-in'>Log In</Link></li>
			</ul></nav>
		</header>
	);
}

export default Header;
