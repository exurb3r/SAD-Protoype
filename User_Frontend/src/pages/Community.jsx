import React, { useState, useEffect} from 'react';
import '../assets/Community.css';

function Community(){
    return(
        <div className='community-page'>
                <h1> Community </h1>
                <div className='community-coaches'>
                <h2 className='community-coaches-title'> Meet The Coaches </h2>
                    <div className='community-coaches-container'>
                        <div className='community-coaches-card'>
                            <div className='coach-picture-holder'>

                            </div>
                            <div className='coach-name-holder'>
                                <p> Coach Name </p>
                                <p> Coach Bio </p>
                            </div>


                        </div>
                           <div className='community-coaches-card'>
                            <div className='coach-picture-holder'>

                            </div>
                            <div className='coach-name-holder'>
                                <p> Coach Name </p>
                                <p> Coach Bio </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='community-friends'>
                    <h2 className='community-friends-title'> Find Friends </h2>
                    <div className='community-friend-search'>
                        <input className='friend-search-input' placeholder='Search for friends...' />
                        <button className='friend-search-button'> Search </button>
                    </div>
                    <div className='community-friends-container'>
                        <div className='community-friends-card'>
                            <div className='friend-picture-holder'>

                            </div>
                            <div className='friend-name-holder'>
                                <p className='friend-name'> Friend Name <p className='friend-level'> Level 10 </p></p>
                                <button className='friend-add-button'> Add Friend </button>
                            </div>

                        </div>
                    </div>
                </div>


                <div className='community-announcements'>
                    <h2 className='community-announcements-title'> Announcements </h2>
                    <div className='community-announcements-container'>
                        <div className='community-announcement-card'>
                           <div className='announcer-info'><div className='announcer-picture'></div><p className='announcer-name'>Announcer Name</p> <p className='announcement-date'>Date</p></div>
                           <div className='announcement-content'> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit impedit porro laudantium, nobis ullam officiis nostrum veniam, hic ratione similique distinctio et aspernatur voluptates vitae fugit repudiandae reiciendis necessitatibus nemo?</div>
                        </div>
                    </div>

                    <div className='community-announcements-container'>
                        <div className='community-announcement-card'>
                           <div className='announcer-info'><div className='announcer-picture'></div><p className='announcer-name'>Announcer Name</p> <p className='announcement-date'>Date</p></div>
                           <div className='announcement-content'> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit impedit porro laudantium, nobis ullam officiis nostrum veniam, hic ratione similique distinctio et aspernatur voluptates vitae fugit repudiandae reiciendis necessitatibus nemo?</div>
                        </div>
                    </div>

                    <div className='community-announcements-container'>
                        <div className='community-announcement-card'>
                           <div className='announcer-info'><div className='announcer-picture'></div><p className='announcer-name'>Announcer Name</p> <p className='announcement-date'>Date</p></div>
                           <div className='announcement-content'> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit impedit porro laudantium, nobis ullam officiis nostrum veniam, hic ratione similique distinctio et aspernatur voluptates vitae fugit repudiandae reiciendis necessitatibus nemo?</div>
                        </div>
                    </div> 
                </div>
        </div>
    )
}

export default Community;