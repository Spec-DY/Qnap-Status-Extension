import { useEffect, useState } from "react";
import "./App.css";
import SystemStatus from "./components/SystemStatus";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <Container>
        <HashRouter>
          <Routes>
            {userInfo ? (
              <Route path="/" element={<SystemStatus userInfo={userInfo} />} />
            ) : (
              <Route path="/" element={<Login />} />
            )}
          </Routes>
        </HashRouter>
      </Container>
    </div>
  );
}

export default App;
