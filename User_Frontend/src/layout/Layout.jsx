import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";


function Layout() {
    return(
        <div className="layout"> 
            <Sidebar/>
            <div className="main-content">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout;