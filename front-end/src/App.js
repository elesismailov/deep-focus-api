import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';

function App() {

	return (
		<Router>
			<Header />
			<Switch>

			</Switch>
			<p> hello world! </p>
		</Router>
	);
}

export default App;
