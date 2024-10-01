import { useEffect, useState } from 'react';
import './App.css';
import SystemStatus from './components/SystemStatus';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get('userInfo', (result) => {
      if (result.userInfo) {
        setUserInfo(result.userInfo);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <HashRouter>
          <Routes>
            {userInfo ? (
              <Route path="/" element={<SystemStatus userInfo={userInfo} />} />
            ) : (
              <Route path="/" element={<Login />} />
            )}
          </Routes>
        </HashRouter>
      </header>
    </div>
  );
}

export default App;
