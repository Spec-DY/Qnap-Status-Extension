import { useState } from "react";
import {login} from '../client';
import { Link, useNavigate } from "react-router-dom";


export default function Login(){
    const [IP, setIP] = useState('');
    const [username, setUsername] = useState('');
    const [port, setPort] = useState(8080);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const credentials = {
        IP,
        port,
        username,
        password
    }


    const handleIPChange = (e:any) => {
        setIP(e.target.value);
    }
    const handlePortChange = (e:any) => {
        setPort(e.target.value);
    }
    const handleUsernameChange = (e:any) => {
        setUsername(e.target.value);
    }
    const handlePassWordChange = (e:any) => {
        setPassword(e.target.value);
    }

    const navigate = useNavigate();
    const handleSubmit = async (e:any)=> {
        e.preventDefault();
        try{
            const response = await login(credentials);
            if (response.data && response.status == 200) {
                navigate("/systemstatus")
            }else{
                navigate("/")
            }
        }catch (error){
            setError(true)
        }
    }

    return (
        <div style={{justifyContent:'center', alignItems:'center'}}>
            <h1 className='form-control-lg mb-3'>QNAP NAS Status</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        id="ipaddress" 
                        placeholder="Enter IP address"
                        onChange={handleIPChange}
                         />
                    <input 
                        type="number" 
                        className="form-control mb-3" 
                        id="portnumber" 
                        placeholder="Enter port number"
                        defaultValue={8080}
                        onChange={handlePortChange} />
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        id="username" 
                        placeholder="Eneter NAS username"
                        onChange={handleUsernameChange} />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        id="passward" 
                        placeholder="Eneter NAS password"
                        onChange={handlePassWordChange} />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary mb-2">Login</button>
                {error && (
                    <div style={{display:'flex',justifyContent:'center'}}>
                    <div className="alert alert-warning" role="alert" style={{padding:1, margin:1, width:'fit-content'}}>
                        Connection Failed
                    </div>
                    </div>
                )}
            </form>
        </div>
    )

}