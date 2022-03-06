import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import LogIn from './components/LogIn';

function App() {

	return (
		<Router>
			<Header />
			<Switch>
				<Route path='/log-in'>
					<LogIn />
				</Route>
			</Switch>
			<p> hello world! </p>
		</Router>
	);
}

export default App;
