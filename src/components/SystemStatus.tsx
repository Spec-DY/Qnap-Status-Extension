import { fetchSystemStatus } from "../client"
import { useEffect, useState } from "react";

export default function SystemStatus() {

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

    const [status, setStatus] = useState<[CPUStatus,RAMStatus] | null>(null)
    
    async function getStatus() {
        const response = await fetchSystemStatus();
        setStatus(response.data)
    }

    useEffect(()=>{
        getStatus()
    },[])

    console.log(status)

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
    )
}