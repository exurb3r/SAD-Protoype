import React, { useState, useEffect } from 'react';
import '../assets/Community.css';

function Community(){

    const [users,setUsers] = useState([]);
    const [announcements,setAnnouncements] = useState([]);
    const [sentRequests,setSentRequests] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:3500/users/community/users",{
        headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
        }
        })
        .then(res=>res.json())
        .then(data=>{
            setUsers(data)

            const sent = data
                .filter(u => u.requestSent)
                .map(u => u.email)
                setSentRequests(sent)
        })
        .catch(err=>console.log(err));

        fetch("http://localhost:3500/users/community/announcements",{
        headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
        }
        })
        .then(res=>res.json())
        .then(data=>setAnnouncements(data))
        .catch(err=>console.log(err));

    },[])



    const addFriend = async(email)=>{
        try{
            await fetch("http://localhost:3500/users/community/addfriend",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body:JSON.stringify({email})
                })
                setSentRequests([...sentRequests,email])

        }catch(err){
            console.log(err)
        }
    }


    const cancelRequest = async(email)=>{
    try{
        await fetch("http://localhost:3500/users/community/cancelrequest",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({email})
        })

            setSentRequests(sentRequests.filter(e=>e!==email))

        }catch(err){
            console.log(err)
        }
    }



    return(
    <div className='community-page'>

    <h1> Community </h1>

    <div className='community-coaches'>

    <h2 className='community-coaches-title'> Meet The Coaches </h2>

    <div className='community-coaches-container'>

    <div className='community-coaches-card'>
    <div className='coach-picture-holder'></div>

    <div className='coach-name-holder'>
    <p>Coach Name</p>
    <p>Coach Bio</p>
    </div>

    </div>


    <div className='community-coaches-card'>

    <div className='coach-picture-holder'></div>

    <div className='coach-name-holder'>
    <p>Coach Name</p>
    <p>Coach Bio</p>
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

    {users.map(user=>(

    <div className='community-friends-card' key={user.email}>

    <div className='friend-picture-holder'></div>

    <div className='friend-name-holder'>

    <div className='friend-name'>
    {user.username}
    <span className='friend-level'> Level {user.level}</span>
    </div>


    {sentRequests.includes(user.email) ? (

    <button
    className='friend-add-button'
    onClick={()=>cancelRequest(user.email)}
    >
    Cancel
    </button>

    ) : (

    <button
    className='friend-add-button'
    onClick={()=>addFriend(user.email)}
    >
    Add Friend
    </button>

    )}

    </div>

    </div>

    ))}

    </div>

    </div>



    <div className='community-announcements'>

    <h2 className='community-announcements-title'> Announcements </h2>

    <div className='community-announcements-container'>

    {announcements.map((post,index)=>(

    <div className='community-announcement-card' key={index}>

    <div className='announcer-info'>

    <div className='announcer-picture'></div>

    <p className='announcer-name'>{post.email}</p>

    <p className='announcement-date'>
    {new Date(post.date).toLocaleDateString()}
    </p>

    </div>

    <div className='announcement-content'>
    {post.contents}
    </div>

    </div>

    ))}

    </div>

    </div>


    </div>

    )

}

export default Community;