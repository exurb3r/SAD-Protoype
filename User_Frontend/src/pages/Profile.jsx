import React, { useState, useEffect } from 'react';
import '../assets/Profile.css';

import { Bar, Doughnut } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Profile(){

    const [tab,setTab] = useState("overview");
    const [showEdit,setShowEdit] = useState(false);
    const [showInvite,setShowInvite] = useState(false);
    const [selectedFriend,setSelectedFriend] = useState(null);

    const token = localStorage.getItem("token");

    const [profile,setProfile] = useState({
    username:"",
    level:1,
    exp:0,
    expNext:100,
    motto:"",
    joined:"",
    streak:0
    });

    const [friends,setFriends] = useState([]);
    const [achievements,setAchievements] = useState([]);
    const [sharedRoutines,setSharedRoutines] = useState([]);

    const [workoutsPerWeek,setWorkoutsPerWeek] = useState([0,0,0,0,0,0,0]);
    const [workoutDistribution,setWorkoutDistribution] = useState([0,0,0,0,0,0]);

    const [editData,setEditData] = useState({
    username:"",
    email:"",
    password:"",
    motto:""
    });

    const [inviteData,setInviteData] = useState({
    date:"",
    time:"",
    message:""
    });

    useEffect(()=>{
        const fetchProfile = async()=>{
            try{
                const res = await fetch("http://localhost:3500/users/profile",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });

                const data = await res.json();

                setProfile({
                    username:data.username,
                    level:data.level,
                    exp:data.exp,
                    expNext:data.expNext,
                    motto:data.motto,
                    joined:new Date(data.joined).toLocaleDateString(),
                    streak:data.streak
                });

                setFriends(data.friends || []);
                setAchievements(data.achievements || []);
                setSharedRoutines(data.sharedRoutines || []);

                setWorkoutsPerWeek(data.weeklyWorkouts || [0,0,0,0,0,0,0]);
                setWorkoutDistribution(data.workoutDistribution || [0,0,0,0,0,0]);

                }catch(err){
                    console.log(err);
                }
        };

        fetchProfile();
    },[token]);

    const expPercent = profile.expNext
    ? (profile.exp / profile.expNext) * 100
    : 0;

    const handleEditChange = (e)=>{
        setEditData({
            ...editData,
            [e.target.name]:e.target.value
        });
    };

    const saveProfile = async()=>{
        try{
            await fetch("http://localhost:3500/users/profile/edit",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                },
                body:JSON.stringify(editData)
            });

            setProfile(prev=>({
                ...prev,
                username: editData.username || prev.username,
                motto: editData.motto || prev.motto
            }));

            setShowEdit(false);

        }catch(err){
        console.log(err);
        }
    };

    const openInvite = (friend)=>{
        setSelectedFriend(friend);
        setInviteData({date:"",time:"",message:""});
        setShowInvite(true);
    };

    const unfriend = async(friendId)=>{
        try{
            await fetch(`http://localhost:3500/users/profile/unfriend/${friendId}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            setFriends(prev=>prev.filter(f=>f.userId!==friendId));

        }catch(err){
            console.log(err);
        }
    };

    const sendInvite = async()=>{

        try{

            await fetch("http://localhost:3500/users/profile/invite",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({
                friendId:selectedFriend.userId,
                date:inviteData.date,
                time:inviteData.time,
                message:inviteData.message
                })
            });

            setShowInvite(false);

        }catch(err){
            console.log(err);
        }
    };

   const barData = {
        labels:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        datasets:[{
            label:"Workouts",
            data:workoutsPerWeek,
            backgroundColor:"#4d4dff",
            borderRadius:5
        }]
    };

    const doughnutData = {
        labels:["Chest","Back","Shoulders","Arms","Abs","Legs"],
        datasets:[{
            data:workoutDistribution,
            backgroundColor:["red","blue","green","orange","purple","cyan"]
        }]
    };

    return(

    <div className='profile-page'>

        <div className='profile-personal-card'>
            <div className='profile-personal-card-upper'>
                    <div className='profile-picture-holder'>
                    </div>

                    <div className='profile-information-holder'>
                        <div className='profile-information-holder-upper'>
                            <p>{profile.username}</p>
                            <p>Lvl {profile.level}</p>
                            <p>Total Exp {profile.exp}</p>
                            <button className='profile-btn-edit' onClick={()=>setShowEdit(true)}>
                                Edit Profile
                            </button>
                        </div>
            </div>

                <div className='profile-information-holder-middle'>
                    <p>{profile.motto}</p>
                </div>

            <div className='profile-information-holder-lower'>
                    <p>{profile.joined} Joined</p>
                    <p>{friends.length} Friends</p>
            </div>

            </div>

            <div className='profile-personal-card-lower'>
                <div className='profile-personal-card-lower-items' onClick={()=>setTab("overview")}>
                    <h3>Overview</h3>
                </div>

                <div className='profile-personal-card-lower-items' onClick={()=>setTab("stats")}>
                    <h3>Stats</h3>
                </div>

                <div className='profile-personal-card-lower-items' onClick={()=>setTab("friends")}>
                    <h3>Friends</h3>
                </div>

                <div className='profile-personal-card-lower-items' onClick={()=>setTab("achievements")}>
                    <h3>Achievements</h3>
                </div>

                <div className='profile-personal-card-lower-items' onClick={()=>setTab("routine")}>
                    <h3>Shared Routine</h3>
                </div>

            </div>

        </div>

        
        <div className='profile-display-container-box'>

            {tab==="overview" && (
            <div className='profile-overview-container'>

                <h2>Gamification Overview</h2>

                <div className='profile-overview-level'>

                    <div style={{width:"120px"}}>
                        <CircularProgressbar value={expPercent} text={`${Math.round(expPercent)}%`} />
                    </div>

                    <div>
                        <p>EXP {profile.exp} / {profile.expNext}</p>
                        <p>Current Streak: {profile.streak} Days</p>
                    </div>

                </div>

                <div className='profile-game-summary'>

                    <div className='profile-game-box'>
                        <h3>Current Streak</h3>
                        <p>{profile.streak}</p>
                    </div>

                    <div className='profile-game-box'>
                        <h3>Total EXP</h3>
                        <p>{profile.exp}</p>
                    </div>

                    <div className='profile-game-box'>
                        <h3>Total Friends</h3>
                        <p>{friends.length}</p>
                    </div>

                    <div className='profile-game-box'>
                        <h3>Achievements</h3>
                        <p>{achievements.length}</p>
                    </div>
                </div>
            </div>
            )}


            {tab==="stats" && (
            <div className='profile-stats-container'>
                <div className='profile-charts-holder'>
                    <div>
                        <h2>Weekly Workouts</h2>
                    </div>
                    <div className='profile-bar-card'>
                        <Bar data={barData}/>
                    </div>

                    <div>
                        <h2>Workout Distribution</h2>
                        <div className='profile-pie-card'>
                            <Doughnut data={doughnutData}/>
                        </div>
                    </div>
                </div>
            </div>
            )}


            {tab==="friends" && (

            <div className='profile-friends-container'>
                <h2>Your Friends</h2>
                {friends.map(friend=>(
                    <div key={friend.userId} className='profile-friend-card'>
                        <p>{friend.username}</p>
                        <div>
                            <button onClick={()=>openInvite(friend)}>
                                Invite
                            </button>
                            <button className='profile-unfriend-btn' onClick={()=>unfriend(friend.userId)}>
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            )}


            {tab==="achievements" && (
            <div>
                <h2>Achievements</h2>
                <div className='profile-game-summary'>
                    {achievements.map((a,index)=>(
                        <div key={a._id || index} className='profile-game-box'>
                            <h4>{a.title}</h4>
                            <p>{a.description}</p>
                            <p>+{a.exp_gained} EXP</p>
                        </div>
                    ))}
                </div>
            </div>
            )}


            {tab==="routine" && (
            <div>
                <h2>Shared Routines</h2>
                {sharedRoutines.map((r,index)=>(
                    <div key={index} className='profile-friend-card'>
                        <p>{r.routineName || r}</p>
                    </div>
                    ))}
            </div>
            )}

        </div>

        {showEdit && (
        <div className="profile-modal">
            <div className="profile-modal-content">
                <h2>Edit Profile</h2>
                <input name="username" placeholder="Username" onChange={handleEditChange}/>
                <input name="email" placeholder="Email" onChange={handleEditChange}/>
                <input name="password" placeholder="Password" onChange={handleEditChange}/>
                <input name="motto" placeholder="Motto" onChange={handleEditChange}/>
                <div style={{marginTop:"10px"}}>
                    <button onClick={saveProfile}>Save</button>
                    <button onClick={()=>setShowEdit(false)}>
                    Cancel
                    </button>
                </div>
            </div>
        </div>
        )}


        {showInvite && (
        <div className="profile-modal">
            <div className="profile-modal-content">
                <h2>Invite {selectedFriend?.username}</h2>
                <input type="date" onChange={(e)=>setInviteData({...inviteData,date:e.target.value})}/>
                <input type="time" onChange={(e)=>setInviteData({...inviteData,time:e.target.value})}/>
                <input placeholder="Workout title / message" onChange={(e)=>setInviteData({...inviteData,message:e.target.value})}/>

                <div style={{marginTop:"10px"}}>
                    <button onClick={sendInvite}>
                    Send Invite
                    </button>
                    <button onClick={()=>setShowInvite(false)}>
                    Cancel
                    </button>
                </div>
            </div>
        </div>
        )}
    </div>
    );
}

export default Profile;