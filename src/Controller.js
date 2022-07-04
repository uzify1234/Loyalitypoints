import logo from './logo.svg';
import React , {useState,useEffect}from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App';
import Eachuser from './Eachuser';
import { auth } from './Firebase';
import Login from './Login';

function Controller() {

    const [currentuser, setcurrentuser] = useState(null);

    useEffect(() => {
        console.log("Check "+auth.currentUser);
         setcurrentuser(auth.currentUser);
    }, []);

  return (
    <div className="App">
            <Router>
      <Routes>
        <Route path="/" caseSensitive={false} element={
        
          <App currentuser={currentuser} setcurrentuser={setcurrentuser}/>
       
        } />
        <Route path="/login" caseSensitive={false} element={
        
        <Login currentuser={currentuser} setcurrentuser={setcurrentuser}/>
     
      } />
        <Route path="/user/:uid" caseSensitive={false} element={
        
          <Eachuser currentuser={currentuser} setcurrentuser={setcurrentuser}/>
        
        } />
       
      </Routes>
    </Router>
     
    </div>
  );
}

export default Controller;
