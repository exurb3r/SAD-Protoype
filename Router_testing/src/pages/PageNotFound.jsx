import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
function PageNotFound(){
    return(
       <div>
        <h1> Page Not Found </h1>
        <Link to={"/"}>
            <button> Go back to Dashboard</button>
        </Link>
       </div>
    )
}

export default PageNotFound;