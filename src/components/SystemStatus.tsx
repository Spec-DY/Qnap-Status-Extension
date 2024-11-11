import { useEffect, useState } from "react";
import { fetchSystemStatus } from "../client";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import PieChartIcon from "@mui/icons-material/PieChart";

interface UserInfo {
  IP: string;
  port: number;
  username: string;
  password: string;
}

interface CPUStatus {
  model: string;
  temp_c: number;
  temp_f: number;
  usage_percent: number;
}
interface RAMStatus {
  free: number;
  total: number;
}

interface SystemHealth {
  health: string;
}
interface SystemStatusResponse {
  cpu: CPUStatus;
  ram: RAMStatus;
  health: SystemHealth;
}

export default function SystemStatus({ userInfo }: { userInfo: UserInfo }) {
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const { IP, port, username, password } = userInfo;
    const fetchData = () => {
      fetchSystemStatus(IP, port, username, password)
        .then((response) => {
          setStatus(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch NAS status");
          setLoading(false);
        });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 500); // Fetch every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [userInfo]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading NAS status...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  let used: number = 0;
  let total: number = 0;
  if (status && status.ram) {
    used = status.ram.total - status.ram.free;
    used = Math.round((used / 1024) * 100) / 100;
    total = Math.round((status.ram.total / 1024) * 100) / 100;
  }
  const cpuModelShort = status ? status.cpu.model.split("@")[0].trim() : "";
  return (
    <div className="h-auto">
      {status ? (
        <div style={{ marginTop: 25 }}>
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <MemoryIcon sx={{ mr: 1 }} />
            <span>CPU: {cpuModelShort}</span>
          </Typography>
          <hr />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <PieChartIcon sx={{ mr: 1 }} />
            <span>CPU Usage: {status.cpu.usage_percent}%</span>
          </Typography>
          <hr />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <StorageIcon sx={{ mr: 1 }} />
            <span>
              RAM: {used} GB/{total} GB
            </span>
          </Typography>
          <hr />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <HealthAndSafetyIcon sx={{ mr: 1 }} />
            <span>System Health: </span>
            {status.health.health === "good" ? (
              <CheckCircleIcon sx={{ color: "green", ml: 1 }} />
            ) : (
              <CancelIcon sx={{ color: "red", ml: 1 }} />
            )}
          </Typography>
        </div>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </div>
  );
}
