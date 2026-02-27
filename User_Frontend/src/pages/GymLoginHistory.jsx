import React, { useState, useEffect} from 'react';

function GymLoginHistory(){
    return(
       <div className='page'>
            <h1> My Gym Status </h1>
            <p> My Gym Membership Status</p>
            <div className='container-box'>
                <div className='box'></div>
                <div className='box'></div>
                <div className='box'></div>
                <div className='box'></div>
            </div>
            <p> My Gym Login History </p>
            <div className='container-box'>
                <div className='big-box'></div>
            </div>
       </div>
    )
}

export default GymLoginHistory;