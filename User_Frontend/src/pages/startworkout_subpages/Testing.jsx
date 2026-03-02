import React, { useState, useEffect} from 'react';

function Test(){
    return(
        <div className='page'>

            <div className='gym-calendar-popup'>
                <div className='gym-calendar-popup-top'>
                    <form> 
                        <input type='text' placeholder='title of the event'> </input>
                        <input type='date' placeholder='date'></input>
                        <input type='hours' placeholder='date'></input>
                    </form>

                </div>
                <div className='gym-calendar-popup-down'>  <button> Cancel </button> <button> Add</button></div>
            </div>

                
        </div>
    )
}

export default Test;