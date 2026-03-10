import React, { useState, useEffect } from "react";
import "../assets/GymCalendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function Routine() {

    const [events, setEvents] = useState([]);
    const [userEvents, setUserEvents] = useState([]);
    const [gymEvents, setGymEvents] = useState([]);

    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: ""
    });

    const handleAddEvent = async () => {
        try {
            await fetch("http://localhost:3500/users/gymcalendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
            });

            await loadData();
            setShowPopup(false);

        } catch (err) {
            console.error("Add failed:", err);
        }
    };

    const handleEditEvent = async () => {
        try {
            await fetch(`http://localhost:3500/users/gymcalendar/${selectedEvent._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
            });

            await loadData();
            setShowPopup(false);

        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await fetch(`http://localhost:3500/users/gymcalendar/${eventId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });

            await loadData();

        } catch (err) {
            console.error("Delete failed:", err);
        }
    };




    const loadData = async () => {
        try {
            const res = await fetch("http://localhost:3500/users/gymcalendar", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });

            const data = await res.json();

            setEvents(data.events || []);
            setUserEvents(data.personalEvents || []);
            setGymEvents(data.gymEvents || []);

        } catch (err) {
            console.error("Error loading calendar:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        });
    };

  return (
    <div className="page">
      <h1>Gym Calendar</h1>

      <div className="gym-calendar-container-box">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            displayEventTime={false}
            events={events}
            height="100%"
          />
        </div>

        <div className="calendar-events-container">

          <div className="calendar-user-events card">
            <h2>Your Events</h2>

            <ul className="calendar-event-list">
              {userEvents.map((event) => (
                <li key={event._id} className="calendar-event-item">
                  <span>
                    {formatDate(event.date)} – {event.title}
                  </span>
                  <div className="calendar-event-actions">

                
                    <button
                      className="calendar-btn-outline"
                      onClick={() => {
                        setIsEditing(true);
                        setSelectedEvent(event);
                        setFormData({
                          title: event.title,
                          date: event.date?.split("T")[0] || "",
                          time: event.time || ""
                        });
                        setShowPopup(true);
                      }}
                    >
                      Edit
                    </button>

                    <button className="calendar-btn-outline" onClick={() => handleDeleteEvent( event._id)}>
                      Delete
                    </button>

                  </div>
                </li>
              ))}
            </ul>
           
            <button
              className="calendar-btn-primary full-width"
              onClick={() => {
                setIsEditing(false);
                setSelectedEvent(null);
                setFormData({ title: "", date: "", time: "" });
                setShowPopup(true);
              }}
            >
              Add Event
            </button>
          </div>

          <div className="gym-events card">
            <h2>Gym Events</h2>

            <ul className="calendar-event-list">
              {gymEvents.map((event) => (
                <li key={event._id} className="calendar-event-item simple">
                  <span>
                    {formatDate(event.date)} {event.time} – {event.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      
      {showPopup && (
        <div className="gym-calendar-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="gym-calendar-popup" onClick={(e) => e.stopPropagation()}>
            <div className="gym-calendar-popup-top">
              <form>
                <input
                  type="text"
                  placeholder="Title of the event"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />

                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </form>
            </div>

            <div className="gym-calendar-popup-down">
                <button
                    onClick={() => {
                    setShowPopup(false);
                    setSelectedEvent(null);
                    }}
                >
                    Cancel
                </button>

                <button
                onClick={async () => {
                    if (isEditing) {
                    await handleEditEvent();
                    } else {
                    await handleAddEvent();
                    }

                    setShowPopup(false);
                    setSelectedEvent(null);
                }}
                >
                {isEditing ? "Update" : "Add"}
                </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Routine;