import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Home from './pages/Home';
import Devices from './pages/Devices';
import AppIds from './pages/AppIds';
import Settings from './pages/Settings';

function App() {
	const [token, setToken] = useState('');
	return (
		<Sidebar setToken={setToken} token={token}>
			<Routes>
				<Route exact path='/' element={<Home token={token} />} />
				<Route path='/devices' element={<Devices token={token} />} />
				<Route path='/appIds' element={<AppIds token={token} />} />
				<Route path='/settings' element={<Settings token={token} />} />
			</Routes>
		</Sidebar>
	);
}

export default App;
