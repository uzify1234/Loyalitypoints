import React,{useState,useEffect} from 'react'
import { Navigate, useParams } from 'react-router-dom';
import './Eachuser.css';
import { useNavigate } from "react-router-dom";
import db from './Firebase';
import Modal from 'react-modal';
import { confirm } from "react-confirm-box";

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



function Eachuser({currentuser,setcurrentuser}) {
    var {uid} = useParams();
    const navigate = useNavigate();

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [currentmode, setcurrentmode] = useState("added");
    const [pointsgoing, setpointsgoing] = useState(0);
    const [pointsdescription, setpointsdescription] = useState("");
    const [pointsgoingon, setpointsgoingon] = useState(null);

    const [pointsladder, setpointsladder] = useState([]);

    const [togglerefresher, settogglerefresher] = useState(false);
  
    function openModal() {
      setIsOpen(true);
    }
  

  
    function closeModal() {
      setIsOpen(false);
    }

    const [user, setuser] = useState(null);

    useEffect(() => {
        console.log("CU is "+currentuser);
        db.collection('users').doc(uid).get().then(userinfo => {
            console.log(userinfo.data())
            setuser(userinfo.data());
        })
    }, [togglerefresher])

    useEffect(() => {
        setpointsladder([]);
        db.collection('users').doc(uid).collection('pointsladder').get().then(pointsinfo => {
            var ttj = [];
            pointsinfo.docs.map(pointladder => {
                var x = {id : pointladder.id , ...pointladder.data()};
                ttj.push(x);
            })
            setpointsladder(ttj);
        })
    }, [togglerefresher])

    const addtapped = () => {
        setcurrentmode('added');
        openModal();
    }
    const deducttapped = async () => {
        setcurrentmode('deducted');
        const result = await confirm("Are you sure you want to delete all loyality points of this user");
        if (result) {
            pointssubmitted('deducted');
          }
        
        
    }
    const pointssubmitted = (currentmode2) => {
        if((currentmode2 == "added" || currentmode2 == undefined) && (pointsgoing <=0 || pointsgoingon == null)) {
            return;
        }

        if(currentmode2 == "deducted") {
            db.collection('users').doc(uid).update({
                loyalitypoints : 0
            }).then(alldone => {
                closeModal();
                alert("Updated");
                
                var tmp = db.collection('users').doc(uid).collection('pointsladder');
                // tmp.get().then((querySnapshot) => {
                //   Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
                // });
              
                db.collection('users').doc(uid).collection('pointsladder').get().then(fg => {
                    var promisepusher = [];
                    fg.docs.map(eachfg => {
                        promisepusher.push(eachfg.ref.delete());
                    })
                    Promise.all(promisepusher).then(alldone => {
                        settogglerefresher(!togglerefresher);
                    })
                })
            })

        }
        else {
            var id = db.collection('users').doc(uid).collection('pointsladder').doc().id;
            var params = {
                points : pointsgoing,
                description : pointsdescription,
                mode : currentmode2,
                pointsgoingon : pointsgoingon,
                timestamp : Math.floor(Date.now() / 1000)
            };
            db.collection('users').doc(uid).collection('pointsladder').doc(id).set(params).then(done => {
                    user.loyalitypoints = Number(user.loyalitypoints) + Number(pointsgoing);
                
                db.collection('users').doc(uid).update({
                    loyalitypoints : user.loyalitypoints
                }).then(alldone => {
                    closeModal();
                    alert("Updated");
                    settogglerefresher(!togglerefresher);

                })
            })
        }


        
    
    }


    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
      }
    return (
        <div className='eachuser'>

<Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add User"
      >
        <div style={{display : 'flex',flexDirection : 'column'}}>
        <h2 style={{marginBottom : 30}}>{currentmode == "added" ? 'Add' : 'Deduct'} Points</h2>
        <input type="number" placeholder="Enter No of points" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setpointsgoing(e.target.value)}/>
        <input type="text" placeholder="Enter Description" style={{marginBottom : 30,padding : 10, width : 300,borderWidth: '2px', borderColor : 'black',borderRadius : 5}} onChange={e => setpointsdescription(e.target.value)}/>
        <input type="date" onChange={e => {setpointsgoingon(e.target.value) }}/>
        <button onClick={() => pointssubmitted('added')} style={{backgroundColor : 'black',padding : 10,color : 'white',border : 'none',borderRadius : 5,fontWeight : 'bolder'}}>Add</button>
        </div>

    
      </Modal>
            <div className='part'>
               {currentuser !== null && <button onClick={e => navigate('/')}>Back</button> }
                {user && <div>
                    <h3>{user.name}</h3>
                    <h4>Vendor Name : {user.vendorname}</h4>
                </div>}
       
            </div>
            <div className="part">
                <h3>Loyality Points Available : {user && user.loyalitypoints}</h3>
                {currentuser !== null && <button onClick={addtapped}>Add Points</button>}
                {currentuser !== null && <button onClick={deducttapped}>Deduct Points</button>}
            </div>
            {currentuser !== null && <div className="sharelink">
                    <h4>Share Link</h4>
                    <div>
                        <h3>https://loyality-points-a920c.web.app/user/{uid}</h3>
                        {/* <button onClick={() => {copyTextToClipboard(`https://loyality-points-a920c.web.app/user/${uid}`) ; alert("Copied to Clipboard")}}>Copy</button> */}
                    </div>
                </div>}
            <div className="ladder">
                {pointsladder.length > 0 && <div>
                    {
                        pointsladder.map(eachpointladder => {
                            return(
                                <div className='pointladder' style={{backgroundColor : eachpointladder.mode == "added" ? '#f0f0f0' : '#f0f0f0'}}>
                                    <h4>Points {eachpointladder.mode} : {eachpointladder.points}</h4>
                                    <h4>{eachpointladder.description}</h4>
                                </div>
                            )
                        })
                    }
                </div>}
            </div>
        </div>
    )
}

export default Eachuser
