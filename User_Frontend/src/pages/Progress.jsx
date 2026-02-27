import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../assets/Progress.css";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { PolarArea } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function Progress() {
  const data = [
    { date: "2026-02-01", count: 9 },
    { date: "2026-02-02", count: 10 },
    { date: "2026-02-03", count: 21 },
  ];

  return (
    <div className="page">
        <h1> My Progress</h1>
        <div className="progress-first-container">
            <div className="progress-game-summary">
                <div className="progress-game-box">
                    <h3> Your Level</h3>
                    <p> 7 </p>
                </div>
                <div className="progress-game-box">
                    <h3> Total Exp Earned</h3>
                    <p> 690XP</p>
                </div>

                <div className="progress-game-box">
                    <h3> Current Streak </h3>
                    <p> 6 Days </p>
                </div>
                <div className="progress-game-box">
                    <h3> Highest Streak </h3>
                    <p> 10 Days</p>
                </div>
                <div className="progress-game-box">
                    <h3> Recent Achievements </h3>
                    <ul>
                        <li> Make an account</li>
                        <li> Finish 1 workout</li>
                        <li> Finish a Routine</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="progress-upper-container">
            <div className="progress-calendar">
            <h2> Your Activity </h2>
            <CalendarHeatmap
                startDate={new Date("2026-01-01")}
                endDate={new Date("2026-12-31")}
                values={data}
                showWeekdayLabels
                classForValue={(value) => {
                if (!value || value.count === 0) {
                    return "color-empty";
                }
                return `color-scale-${Math.min(value.count, 4)}`;
                }}
            />
            </div>
        </div>



        <div className="progress-third-container">
            <select name="cars" id="cars">
                <option value="volvo"> Weekly </option>
                <option value="saab"> Monthly </option>
                <option value="mercedes"> Yearly </option>
            </select>
            <div className="progress-charts-holder">
                <div className="progress-bar-holder">
                    <h2> Your Weekly Progress</h2>
                    <div className='progress-bar-item'>
                                        <Bar
                                            data={{
                                                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                                                datasets: [
                                                {
                                                    label: "No. of Workouts",
                                                    data: [15, 12, 20, 13, 17, 10, 23, ], 
                                                    backgroundColor: ["#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff"],
                                                    borderRadius: 5, 
                                                    borderWidth: 0,
                                                },
                                                                                                {
                                                    label: "Time Spent in Hours",
                                                    data: [2, 1.5, 3, 1.2, 2.5, 1, 2.9, ], 
                                                    backgroundColor: ["#ff534d", "#ff534d", "#ff534d", "#ff534d", "#ff534d", "#ff534d"],
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
                                                    max: 30,
                                                },
                                                },
                                            }}
                                            />
                    </div>
                </div>
                <div className="progress-doughnut-holder">
                    <h2> Your Workout Distribution </h2>
                    <div className='progress-pie-item'>
                         <PolarArea
                            data={{
                            labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                            datasets: [
                                {
                                data: [200, 300, 400, 150, 100, 250],
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.6)",
                                    "rgba(54, 162, 235, 0.6)",
                                    "rgba(75, 192, 192, 0.6)",
                                    "rgba(255, 159, 64, 0.6)",
                                    "rgba(153, 102, 255, 0.6)",
                                    "rgba(0, 255, 255, 0.6)",
                                ],
                                borderWidth: 1,
                                },
                            ],
                            }}
                            options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                ticks: {
                                    display: false,
                                },
                                },
                            },
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="progress-stats-holder">
                <div className="progress-game-summary">
                    <div className="progress-game-box">
                        <h3> Total Workouts this Week</h3>
                        <p> 27 </p>
                    </div>
                    <div className="progress-game-box">
                        <h3> Average Workout This Week </h3>
                        <p> 8 </p>
                    </div>

                    <div className="progress-game-box">
                        <h3> Highest No. of Workout This Week </h3>
                        <p> 15 </p>
                    </div>
                    <div className="progress-game-box">
                        <h3> Total Amount of Time Spent This Week</h3>
                        <p> 7.5 Hours </p>
                    </div>
                    <div className="progress-game-box">
                        <h3> Average Time Spent </h3>
                        <p> 1.5 Hours </p>
                    </div>
                </div>

            </div>
        </div>

        <div className="progress-routine-history-container">
            <h2> Recent Routines History</h2>
            <table>
            <tr>
                <th> Title</th>
                <th> Date</th>
                <th> Time</th>
                <th> Duration </th>
                <th> Focus </th>
                <th> No. of Workouts</th>
                <th> Exp Gained</th>
            </tr>
            <tr>
                <td> Arm maxxing </td>
                <td> 02-27-2026</td>
                <td> 1:30 PM  </td>
                <td> 2 hours</td>
                <td> Arms</td>
                <td> 15 </td>
                <td> 50 exp</td>
            </tr>
            <tr>
                <td> Arm maxxing </td>
                <td> 02-27-2026</td>
                <td> 1:30 PM  </td>
                <td> 2 hours</td>
                <td> Arms</td>
                <td> 15 </td>
                <td> 50 exp</td>
            </tr>

            <tr>
                <td> Arm maxxing </td>
                <td> 02-27-2026</td>
                <td> 1:30 PM  </td>
                <td> 2 hours</td>
                <td> Arms</td>
                <td> 15 </td>
                <td> 50 exp</td>
            </tr>
            
            </table>


        </div>

    </div>
  );
}

export default Progress;