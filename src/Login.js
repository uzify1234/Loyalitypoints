import React,{useState} from 'react'
import { auth } from './Firebase';
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login({currentuser,setcurrentuser}) {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();


    const logintapped = () => {
        auth.signInWithEmailAndPassword(email,password).then(user => {
            console.log(user.user.uid);
            setcurrentuser(user.user.uid);
            navigate('/');
        }).catch(err => {
            alert("Login Failed");
        });
    }
    return (
        <div className='login'>
            <div className="loginregion">
                <h4>Login to continue</h4>
                <input type="email" placeholder="Enter Email" onChange={e => setemail(e.target.value)}/>
                <input type="password" placeholder="Enter Password" onChange={e => setpassword(e.target.value)}/>
                <button onClick={logintapped}>Login</button>

            </div>
        </div>
    )
}

export default Login
