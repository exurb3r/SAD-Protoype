import React, { useState, useEffect} from 'react';
import Achievement from './Leaderboard';

function Profile(){
    return(
        <div className='page'>
                <h1> Profile </h1>
                <p1> User Name</p1>
                <div className='container-box'>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                </div>
                <p> Achievements </p>
                <div className='container-box'>
                    <div className='big-box'></div>
                </div>
                <div className='container-box'>
                    <div className='big-box'></div>
                </div>
                <div className='container-box'>
                    <div className='big-box'></div>

                </div>
        </div>
    )
}

export default Profile;