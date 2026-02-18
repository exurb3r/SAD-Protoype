import { useNavigate } from "react-router-dom";

function LogOutBtn() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userCredentials");
        navigate("/login");
    }

    return(
        <button className="logout-btn" onClick={handleLogout}>
            Log Out
        </button>

    )
}

export default LogOutBtn;
