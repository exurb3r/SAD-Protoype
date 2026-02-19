import React, { useState, useEffect} from 'react';

function Routine(){
    return(
        <div className='page'>
                <h1> Routine </h1>
                <div className='container-box'>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                    <div className='box'></div>
                </div>
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

export default Routine;