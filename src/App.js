import React , {useState,useEffect}from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import logo from './logo.svg';
import './App.css';
import db, { auth } from './Firebase';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ExportCSV } from './Exportcsv';



const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// /Modal.setAppElement('#App');

function App() {


  const [needrefresh, setneedrefresh] = useState(false);
  const navigate = useNavigate();

  const [allusers, setallusers] = useState([]);
  const [name, setname] = useState("");
  const [number, setnumber] = useState("");
  const [locality, setlocality] = useState("");
  const [address, setaddress] = useState("");
  const [vendorname, setvendorname] = useState("");
  
  const [currentlyeditinguser, setcurrentlyeditinguser] = useState(null);
  
    const [modalIsOpen, setIsOpen] = React.useState(false);
  
    function openModal() {
      setIsOpen(true);
    }
  

    const submit = () => {
      confirmAlert({
        title: 'Confirm to Delete user',
        message: 'Are you sure you want to delete this user ?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {deleteuser()}
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
    };
  
    function closeModal() {
      setIsOpen(false);
    }

    const [modalIsOpen2, setIsOpen2] = React.useState(false);
  
    function openModal2() {
      setIsOpen2(true);
    }
  

  
    function closeModal2() {
      setIsOpen2(false);
    }


    const adduser = () => {
      if(name !== "" && number !== "" && vendorname !== "") {
        var id = db.collection('users').doc().id;
        db.collection('users').doc(id).set({
          name : name,
          number : number,
          locality : locality,
          address : address,
          vendorname : vendorname,
          loyalitypoints : 0
        }).then(done => {
          alert("User Added");
          setname("");
          setnumber("");
          setlocality("");
          setaddress("");
          setvendorname("");
          closeModal();
          setneedrefresh(!needrefresh);
        }).catch(err => {

        })
      }
      else {
        alert("Please enter both name and email of user");
      }
    }

    const deleteuser = () => {
      db.collection('users').doc(currentlyeditinguser.id).delete().then(ed => {
        alert("User Deleted");
        setcurrentlyeditinguser(null);
        setneedrefresh(!needrefresh);
      }).catch(erf => {
        
      })
    }

    const edituser = (user) => {
      setcurrentlyeditinguser(user);
      setname(user.name);
      setnumber(user.number);
      setlocality(user.locality);
      setaddress(user.locality);
      setvendorname(user.vendorname);
      openModal2();
    }

    const updateuser = () => {
      if(currentlyeditinguser) {
        db.collection('users').doc(currentlyeditinguser.id).update({
          name : name,
          number : number,
          locality : locality,
          address : address,
          vendorname : vendorname
        }).then(up => {
          alert("User Updated");
          closeModal2();
          setname("");
          setnumber("");
          setlocality("");
          setaddress("");
          setvendorname("");
          setcurrentlyeditinguser(null);
          setneedrefresh(!needrefresh);
        }).catch(err => {

        })
      }
    }
    useEffect(() => {
      if(auth.currentUser == null) {
        navigate('/login');
        return;
      }
      db.collection('users').get().then(data => {
        var tmp =[];
        data.docs.map(eachuser => {
          var x = {id : eachuser.id , ...eachuser.data()};
          tmp.push(x);
          console.log(x);
        })
        setallusers(tmp);
      })
    }, [needrefresh])

    const downloaddetails = () => {

    }

  return (
    <div className="App" id="App">

<Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add User"
      >
        <div style={{display : 'flex',flexDirection : 'column'}}>
        <h2 style={{marginBottom : 30}}>Add New User</h2>
        <input type="text" placeholder="Enter User name" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setname(e.target.value)}/>
        <input type="number" placeholder="Enter User Mobile Number" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setnumber(e.target.value)}/>
        <input type="text" placeholder="Enter User Locality" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setlocality(e.target.value)}/>
        <input type="text" placeholder="Enter User Address" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setaddress(e.target.value)}/>
        <input type="text" placeholder="Enter Vendor's Name" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setvendorname(e.target.value)}/>



        <button onClick={adduser} style={{backgroundColor : 'black',padding : 10,color : 'white',border : 'none',borderRadius : 5,fontWeight : 'bolder'}}>Add</button>
        </div>

    
      </Modal>

      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        style={customStyles}
        contentLabel="Edit User"
      >
        <div style={{display : 'flex',flexDirection : 'column'}}>
        <h2 style={{marginBottom : 30}}>Edit User</h2>
        <input type="text" value={name} placeholder="Enter User name" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setname(e.target.value)}/>
        <input type="number" value={number} placeholder="Enter User Mobile Number" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setnumber(e.target.value)}/>
        <input type="text" value={locality} placeholder="Enter User Locality" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setlocality(e.target.value)}/>
        <input type="text" value={address} placeholder="Enter User Address" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setaddress(e.target.value)}/>
        <input type="text" value={vendorname} placeholder="Enter Vendor's Name" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setvendorname(e.target.value)}/>



        <button onClick={updateuser} style={{backgroundColor : 'black',padding : 10,color : 'white',border : 'none',borderRadius : 5,fontWeight : 'bolder'}}>Edit</button>
        </div>

    
      </Modal>


      <div className="part">
        <h3>All Users</h3>
        <div>
        <button onClick={openModal}>Add New User</button>
        {allusers.length > 0 && <ExportCSV csvData={allusers} fileName="users.csv"/>}


        </div>
      </div>

      {allusers.length > 0 && <div className="users">
          {
            allusers.map(eachuser => {
              return(
                <div className='eachuserdetails' >
                  <div className="part">
                  <h3>{eachuser.name}</h3>
                  </div>
                  <div className="part">
                  <h4>Vendor Name</h4>
                  <h3>{eachuser.vendorname}</h3>
                  </div>
                  <div className="part">
                  <h4>Locality</h4>
                  <h3>{eachuser.locality}</h3>
                  </div>
                  <div className="part">
                    <h4>Loyality Points</h4>
                  <h3>{eachuser.loyalitypoints}</h3>
                  </div>
                  <div className="part last">
                    <button onClick={() => {edituser(eachuser)}}>Edit</button>
                    <button onClick={() => {setcurrentlyeditinguser(eachuser); submit();}}>Delete</button>
                    <button onClick={e => navigate(`/user/${eachuser.id}`)}>View More</button>
                  </div>
                </div>
              )
            })
          }
      </div>}
        
    </div>
  );
}

export default App;
