import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
function AddWorkout(){
    return(
        <div>
            <h1> Add Workout </h1>
            <p> This is the add workout page </p>
            <Link to={"/startworkout"}><button> Back to Start Workout </button></Link>
        </div>
    );
}
export default AddWorkout;