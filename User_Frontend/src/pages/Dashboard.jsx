import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../assets/Dashboard.css'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement } from "chart.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard(){
    const [username, setUsername] = useState('');
    const [membership, setMembership] = useState('');
    const [currentStreak, setCurrentStreak] = useState();
    const [membershipDuration, setMembershipDuration] = useState();
    const [recentAchievements, setRecentAchievements] = useState([]);
    const [exp, setExp] = useState();
    const [level, setLevel] = useState();
    const [notifications, setNotifications] = useState([]);

    const [barData, setBarData] = useState([]);
    const [barData2, setBarData2] = useState([]);
    const [doughnutData, setDoughnutData] = useState([]);
    const [maxBarValue, setMaxBarValue] = useState('');
    
    const [numberOfWorkouts, setNumberOfWorkouts] = useState();
    const [duration, setDuration] = useState();
    const [focus, setFocus] = useState([]);
    const [expGained, setExpGained] = useState();

    useEffect(() => {
        loadUserData();
    }, []);



    const loadUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:3500/users/dashboard', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUsername(data.username);
                setMembership(data.membership);
                setCurrentStreak(data.currentStreak);
                setMembershipDuration(data.membershipDuration);
                setRecentAchievements(data.recentAchievements);
                setExp(data.exp);
                setLevel(data.level);
                setNotifications(data.notifications);
                setBarData(data.weeklyWorkouts);
                setBarData2(data.weeklyHours);
                setDoughnutData(data.workoutDistribution);
                setMaxBarValue(Math.max(...data.weeklyWorkouts, ...data.weeklyHours) + 1);
                setNumberOfWorkouts(data.numberOfWorkouts);
                setDuration(data.duration);
                setFocus(data.focus);
                setExpGained(data.expGained);
            }   else {              
                console.error('Failed to load user data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

    }

    return(
       <div className='dashboard-page'>
            <h1> Dashboard </h1>
            <div className='welcome-back-section'><p> Welcome Back  <span> {username}</span></p>    <Link to={"/startworkout"}> <button> Start Workout Now</button></Link></div>
            <div className='dashboard-container-box'>
                <div className='dashboard-upper-box-firstbox'> 
                    <div>
                        <div className='lvl-holder'>
                            <CircularProgressbar value={70} text={`Lvl ${level}`} />
                        </div>
                        <p> TOTAL EXP : </p><p> {exp} exp gained</p>
                    </div>
                </div>
                <div className='dashboard-upper-box-middlebox'>
                    <div className='upper-section' >
                        <div className='dashboard-inner-first-box-streak'> <p> Current Streak: </p> <p>{currentStreak} Days</p></div>
                        <div className='dashboard-inner-first-box-membership'>  <p> Membership: </p>
                                                                                <p> {membership} </p> 
                                                                                <p> {membershipDuration} days</p></div>
                    </div>
                    <div className='dashboard-inner-first-box-achievements'><p> Recent Achievements</p>
                                                                            {recentAchievements.map((achievement, index) => (
                                                                                <p key={index}> {achievement} </p>
                                                                            ))}
                    </div>
                </div>
                <div className='dashboard-upper-box-lastbox'> <p>Previous Workout Preview </p> 
                                                        <ul> 
                                                            <li> No. of Workouts <p>{numberOfWorkouts}</p></li> 
                                                            <li> Duration <p>{duration} mins</p></li>
                                                            <li> Focus : {focus.join(', ')}</li>
                                                            <li> Exp Gained <p>{expGained}</p></li>
                                                        </ul>
                </div>
            </div>

            <div className='dashboard-container-box'>
                <div>
                <h2> Your Week </h2>
                <div className='dashboard-big-box-progress'>
                    <Bar
                        data={{
                            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                            datasets: [
                            {
                                label: "No. of Workouts",
                                data: barData, 
                                backgroundColor: ["#4d4dff"],
                                borderRadius: 5, 
                                borderWidth: 0,
                            },
                            {
                                label: "Time Spent (hrs)",
                                data: barData2, 
                                backgroundColor: ["#ff4d4d"],
                                borderRadius: 5, 
                                borderWidth: 0,
                            },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                            scales: {
                            y: {
                                beginAtZero: true,
                                max: maxBarValue,
                            },
                            },
                        }}
                        />
                </div>
                </div>
                <div>
                <h2> Your Workout Distribution </h2>
                <div className='dashboard-big-box-progress-pie'>
                    <Doughnut
                        data={{
                            labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                            datasets: [{
                                data: doughnutData,
                                backgroundColor: ["red", "blue", "green", "orange", "purple", "cyan"],
                                borderRadius: 5,
                                borderWidth: 0,
                                barThickness: 50,

                            }],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                        }}
                        />

                </div>
                </div>
            </div>
            <p> Recent Notifications </p>
            <div className='dashboard-notif-box'>
                {notifications.map((notification) => (
                    <div key={notification.id} className='dashboard-notif-item'>
                        <p>{notification.message}</p>
                    </div>
                ))}
            </div>
       </div>
    )
}

export default Dashboard;