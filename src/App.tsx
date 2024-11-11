import { useEffect, useState } from "react";
import "./App.css";
import SystemStatus from "./components/SystemStatus";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HashRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { HashRouter } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import DiskDetail from "./components/DiskDetail";

import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("system");

  useEffect(() => {
    chrome.storage.local.get("userInfo", (result) => {
      if (result.userInfo) {
        setUserInfo(result.userInfo);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            variant="h6"
          >
            Qnap Status
          </Typography>
        </Toolbar>
      </AppBar>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Container>
          {/* this is HashRouter instead of deal with route like '/' */}
          <Routes>
            {userInfo ? (
              <>
                <Route
                  path="/"
                  element={<SystemStatus userInfo={userInfo} />}
                />
                <Route
                  path="/disk"
                  element={<DiskDetail userInfo={userInfo} />}
                />
              </>
            ) : (
              <Route path="/" element={<Login />} />
            )}
          </Routes>
        </Container>
        <Box sx={{ position: "fixed", bottom: 0, width: "100%" }}>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            sx={{ backgroundColor: "#cdddf7" }}
          >
            <BottomNavigationAction
              label="System"
              value="system"
              icon={<SettingsIcon />}
              component={Link}
              to="/"
            />
            <BottomNavigationAction
              label="Disk"
              value="disk"
              icon={<StorageIcon />}
              component={Link}
              to="/disk"
            />
          </BottomNavigation>
        </Box>
      </Router>
    </div>
  );
}

export default App;
