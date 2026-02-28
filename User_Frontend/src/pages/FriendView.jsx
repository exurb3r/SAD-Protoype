import React, { useState, useEffect} from 'react';
import Achievement from './Leaderboard';
import '../assets/Profile.css';
function FriendView(){
    return(
        <div className='profile-page'>
            <div className='profile-personal-card'>
                <div className='profile-personal-card-upper'>
                    <div className='profile-picture-holder'>
                    </div>
                    <div className='profile-information-holder'>
                        <div className='profile-information-holder-upper'>
                            <p> Username</p>
                            <p> Lvl 7 </p>
                            <p> Total Exp</p>

                            <button className='profile-btn-edit'> Edit Profile </button>
                        </div>
                        <div className='profile-information-holder-middle'>
                            <p> Motto </p>  
                        </div>
                        <div className='profile-information-holder-lower'>
                            <p> 02-28-2024 Joined</p>
                            <p> 10 Friends </p>
                        </div>
                    </div>
                </div>
                <div className='profile-personal-card-lower'>
                    {/* Will Serve like a NavBar*/}
                    <div className='profile-personal-card-lower-items'> <h3> Overview </h3></div>
                    <div className='profile-personal-card-lower-items'> <h3> Stats </h3></div>
                    <div className='profile-personal-card-lower-items'> <h3> Friends </h3></div>
                    <div className='profile-personal-card-lower-items'> <h3> Achievements </h3></div>
                    <div className='profile-personal-card-lower-items'> <h3> Shared Routine</h3></div>
                </div>
            </div>

            <div className='profile-display-container-box'>
                {/* Will rerender after the container above is pressed*/}

            </div>
                
        </div>
    )
}

export default FriendView;