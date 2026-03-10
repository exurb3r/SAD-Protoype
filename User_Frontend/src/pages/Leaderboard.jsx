import React, { useState, useEffect } from "react";
import "../assets/Leaderboards.css";

function Leaderboard(){

    const [boards,setBoards] = useState({});

    useEffect(()=>{

    fetch("http://localhost:3500/users/leaderboard",{
    headers:{
    Authorization:`Bearer ${localStorage.getItem("token")}`
    }
    })
    .then(res=>res.json())
    .then(data=>setBoards(data))
    .catch(err=>console.log(err));

    },[]);

    const renderBoard = (data,label)=>{

    if(!data) return null;



    return(

    <div className="leaderboards-card">
        <h2 className="leaderboards-title">{label}</h2>
        <div className="leaderboards-list">
            {data.map((user,index)=>(
                <div className="leaderboards-row" key={index}>

                    <span className="leaderboards-rank">#{index+1}</span>
                    <span className="leaderboards-username">{user.username}</span>
                    <span className="leaderboards-score">
                    {user.level || user.exp || user.streak || user.workouts}
                    </span>

                </div>
            ))}
        </div>
    </div>
    )
    
    }

    return(
        <div className="leaderboards-page">
            <h1 className="leaderboards-main-title">Leaderboards</h1>
            <div className="leaderboards-grid">
                {renderBoard(boards.topLevel,"Top Level")}
                {renderBoard(boards.topExp,"Top EXP")}
                {renderBoard(boards.topStreak,"Top Streak")}
                {renderBoard(boards.topWorkouts,"Most Workouts")}
            </div>
        </div>
    )

}

export default Leaderboard;