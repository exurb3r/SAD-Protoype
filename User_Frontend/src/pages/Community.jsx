import React, { useState, useEffect} from 'react';

function Community(){
    return(
        <div className='page'>
                <h1> Community </h1>
                <p> Meet the Coaches</p>
                <div className='container-box'>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                </div>
                <p> People you may know </p>
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

export default Community;