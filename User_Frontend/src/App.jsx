import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./MobileApp.css";

import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";

import About from "./pages/About";
import Announcements from "./pages/Announcements";
import Community from "./pages/Community";
import GymLoginHistory from "./pages/GymLoginHistory";
import StartWorkout from "./pages/StartWorkout";
import NotesGym from "./pages/NotesGym";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Routine from "./pages/Routine";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={
           <ProtectedRoute> 
              <Layout />
           </ProtectedRoute>}>

          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="startworkout" element={<StartWorkout />} />
          <Route path="routine" element={<Routine />} />
          <Route path="notes" element={<NotesGym />} />
          <Route path="progress" element={<Progress />} />
          <Route path="community" element={<Community/>} />
          <Route path="leaderboard" element={<Leaderboard/>} />
          <Route path="gymloginhistory" element={<GymLoginHistory/>} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="settings" element={<Settings />} />

          <Route path="*" element={<PageNotFound />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;