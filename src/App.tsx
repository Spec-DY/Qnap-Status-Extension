import './App.css';
import Login from './components/Login';
import SystemStaus from './components/SystemStatus';
import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
		<header className="App-header">
			<h1>Display something</h1>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/systemstatus" element={<SystemStaus />} />
				</Routes>
			</HashRouter>
		</header>
    </div>
  );
}

export default App;
