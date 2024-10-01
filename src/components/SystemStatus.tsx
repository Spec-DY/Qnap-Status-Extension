import { useEffect, useState } from "react";
import { fetchSystemStatus } from "../client";

interface UserInfo {
  IP: string;
  port: number;
  username: string;
  password: string;
}

interface CPUStatus{
    model:string,
    temp_c:number,
    temp_f:number,
    usage_percent:number
}
interface RAMStatus{
    free:number,
    total:number
}

export default function SystemStatus({ userInfo }: { userInfo: UserInfo }) {
  const [status, setStatus] = useState<[CPUStatus,RAMStatus] | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 

  useEffect(() => {
    const { IP, port, username, password } = userInfo;
    fetchSystemStatus(IP, port, username, password)
      .then((response) => {
        setStatus(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch NAS status");
        setLoading(false);
      });
  }, [userInfo]);

  if (loading) {
    return <div>Loading NAS status...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  
  let used:number = 0;
  let total:number = 0;
  if (status) {
      used = status[1].total - status[1].free
      used = Math.round((used / 1024) *100) / 100
      total = Math.round((status[1].total/1024)*100) / 100
  }
  

  return (
        <div>
            {status? (
            <div>
                <h3>{status[0].model}</h3>
                <div>Usage: {status[0].usage_percent}%</div>
                <hr/>
                <h3>RAM</h3>
                <div>Used/Total: {used} GB/{total} GB</div>
            </div>
            ):(
                <>
                loading...
                </>
            )}
        </div>
  );
}
