import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { fetchSystemStatus } from "../client";

import StorageIcon from "@mui/icons-material/Storage";
import MemoryIcon from "@mui/icons-material/Memory";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import LabelIcon from "@mui/icons-material/Label";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/Tag";

interface DiskInfo {
  [key: string]: {
    capacity: string;
    drive_number: string;
    health: string;
    model: string;
    serial: string;
    temp_c: number;
    temp_f: number;
    type: string;
  };
}

interface SystemStatusResponse {
  disk_info: DiskInfo;
}

interface UserInfo {
  IP: string;
  port: number;
  username: string;
  password: string;
}

interface DiskDetailProps {
  userInfo: UserInfo;
}

const DiskDetail: React.FC<DiskDetailProps> = ({ userInfo }) => {
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDisk, setSelectedDisk] = useState<
    DiskInfo[keyof DiskInfo] | null
  >(null);

  useEffect(() => {
    fetchSystemStatus(
      userInfo.IP,
      userInfo.port,
      userInfo.username,
      userInfo.password
    )
      .then((response) => {
        setStatus(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch disk details");
        setLoading(false);
      });
  }, [userInfo]);

  const handleListItemClick = (disk: DiskInfo[keyof DiskInfo]) => {
    setSelectedDisk(disk);
  };

  const handleClose = () => {
    setSelectedDisk(null);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading disk details...</Typography>
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

  return (
    <Container>
      <List>
        {status &&
          Object.keys(status.disk_info).map((key) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                cursor: "pointer",
              }}
              onClick={() => handleListItemClick(status.disk_info[key])}
            >
              <ListItemText
                primary={`Disk ${key}`}
                secondary={status.disk_info[key].model}
              />
            </Box>
          ))}
      </List>
      <Dialog open={!!selectedDisk} onClose={handleClose}>
        <DialogTitle>Disk Details</DialogTitle>
        <DialogContent>
          {selectedDisk && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MemoryIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Model:
                  </Typography>{" "}
                  {selectedDisk.model}
                </DialogContentText>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Capacity:
                  </Typography>{" "}
                  {selectedDisk.capacity}
                </DialogContentText>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <HealthAndSafetyIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Health:
                  </Typography>{" "}
                  {selectedDisk.health}
                </DialogContentText>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ThermostatIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Temperature:
                  </Typography>{" "}
                  {selectedDisk.temp_c}°C / {selectedDisk.temp_f}°F
                </DialogContentText>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CategoryIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Type:
                  </Typography>{" "}
                  {selectedDisk.type}
                </DialogContentText>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TagIcon sx={{ mr: 1 }} />
                <DialogContentText>
                  <Typography component="span" fontWeight="bold">
                    Serial:
                  </Typography>{" "}
                  {selectedDisk.serial}
                </DialogContentText>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DiskDetail;
