import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
function StartingWorkout(){
    return(
        <div>
            <h1> Starting Workout </h1>
            <p> This is the starting workout page </p>
            <Link to={"/startworkout"}><button> Back to Start Workout </button></Link>
        </div>
    );
}
export default StartingWorkout;