import React, { useState, useEffect} from 'react';

function Dashboard(){
    return(
       <div className='page'>
            <h1> Dashboard </h1>
            <p> Good Morning / Good Afternoon/ Good Evening</p>
            <p> Welcome Back User <span> (Account Level)</span></p>
            <p> Overview </p>
            <div className='container-box'>
                <div className='box'> <p>  Current Streak </p> <p>Longest Streak</p> <p> Save Steak</p> </div>
                <div className='box'> <p> Total XP </p> </div>
                <div className='box'> <p></p> </div>
                <div className='box'> <p>Membership Status </p> </div>
            </div>
            <p> Your Activity </p>
            <div className='container-box'>
                <div className='big-box-progress'></div>
                <div className='big-box-progress'></div>
            </div>
             <p> Latest Achievements </p>
            <div className='container-box'>
                <div className='big-box-progress'></div>
                <div className='big-box-progress'></div>
            </div>
            <p> Trainers  Recommender For You</p>
            <div className='container-box'>
                <div className='big-box'></div>
            </div>
            <p> Recommended Food For You</p>
            <div className='container-box'>
                <div className='big-box'></div>

            </div>
       </div>
    )
}

export default Dashboard;