import React, { useState, useEffect, useCallback } from "react";
import "../assets/GymCalendar.css";

const API = "http://localhost:3500/users/gymcalendar";
const token = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`
});

const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];
const DAY_LABELS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const fmt = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getUTCMonth()].slice(0,3)} ${d.getUTCDate()}`;
};

const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

function Routine() {
  const today = new Date();
  const [view,         setView]         = useState("month");
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [weekStart,    setWeekStart]    = useState(getWeekStart(today));
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [showForm,     setShowForm]     = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent,setDeletingEvent]= useState(null);
  const [saving,       setSaving]       = useState(false);
  const [errors,       setErrors]       = useState({});
  const [formData,     setFormData]     = useState({ title: "", date: "", time: "", description: "" });

  const [allEvents,        setAllEvents]        = useState([]);
  const [personalEvents,   setPersonalEvents]   = useState([]);
  const [gymEvents,        setGymEvents]        = useState([]);
  const [membershipEvents, setMembershipEvents] = useState([]);

  function getWeekStart(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  // Parse a date string to { day, month, year } using UTC so timezones don't shift dates
  function parseDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return { day: d.getUTCDate(), month: d.getUTCMonth(), year: d.getUTCFullYear() };
  }

  const loadData = useCallback(async () => {
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      setAllEvents(data.events         || []);
      setPersonalEvents(data.personalEvents || []);
      setGymEvents(data.gymEvents      || []);
      setMembershipEvents(data.membershipEvents || []);
    } catch (err) {
      console.error("Load failed:", err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Get events for a specific day in the current month/year view
  function getEventsForDay(day) {
    return allEvents.filter(ev => {
      if (!ev.date) return false;
      const p = parseDate(ev.date);
      return p && p.day === day && p.month === currentMonth && p.year === currentYear;
    });
  }

  // Get personal events for the day detail modal
  function getPersonalForDay(day) {
    return personalEvents.filter(ev => {
      const p = parseDate(ev.date);
      return p && p.day === day && p.month === currentMonth && p.year === currentYear;
    });
  }

  function getGymForDay(day) {
    return gymEvents.filter(ev => {
      const p = parseDate(ev.date);
      return p && p.day === day && p.month === currentMonth && p.year === currentYear;
    });
  }

  function getMembershipForDay(day) {
    return membershipEvents.filter(ev => {
      const p = parseDate(ev.date);
      return p && p.day === day && p.month === currentMonth && p.year === currentYear;
    });
  }

  // Month grid
  const firstDayOffset = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth    = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthDays = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  // Week grid
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { label: DAY_LABELS[d.getDay()], date: d.getDate(), fullDate: d };
  });

  function isToday(day) {
    return day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
  }

  function prev() {
    if (view === "month") {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
      else setCurrentMonth(m => m - 1);
    } else {
      const ns = new Date(weekStart);
      ns.setDate(ns.getDate() - 7);
      setWeekStart(ns);
      setCurrentMonth(ns.getMonth());
      setCurrentYear(ns.getFullYear());
    }
  }

  function next() {
    if (view === "month") {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
      else setCurrentMonth(m => m + 1);
    } else {
      const ns = new Date(weekStart);
      ns.setDate(ns.getDate() + 7);
      setWeekStart(ns);
      setCurrentMonth(ns.getMonth());
      setCurrentYear(ns.getFullYear());
    }
  }

  function openAdd() {
    setEditingEvent(null);
    setFormData({ title: "", date: "", time: "", description: "" });
    setErrors({});
    setShowForm(true);
  }

  function openEdit(ev) {
    setEditingEvent(ev);
    setFormData({
      title:       ev.title,
      date:        ev.date?.split("T")[0] || "",
      time:        ev.time || "",
      description: ev.description || ""
    });
    setErrors({});
    setShowForm(true);
  }

  function validate() {
    const e = {};
    if (!formData.title.trim()) e.title = "Title is required.";
    if (!formData.date)         e.date  = "Date is required.";
    return e;
  }

  async function saveEvent() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editingEvent) {
        await fetch(`${API}/${editingEvent._id}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(API, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(formData)
        });
      }
      await loadData();
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent() {
    if (!deletingEvent) return;
    setSaving(true);
    try {
      await fetch(`${API}/${deletingEvent._id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      await loadData();
      setDeletingEvent(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSaving(false);
    }
  }

  // Dot color by event type
  function dotColor(ev) {
    const t = ev.type || "";
    if (t === "membership_start" || t === "membership_expiry") return "dot-membership";
    if (t === "gym")     return "dot-gym";
    if (t === "routine") return "dot-routine";
    if (t === "invite")  return "dot-invite";
    return "dot-personal";
  }

  const selectedDayEvents    = selectedDay ? getPersonalForDay(selectedDay)   : [];
  const selectedDayGym       = selectedDay ? getGymForDay(selectedDay)        : [];
  const selectedDayMembership= selectedDay ? getMembershipForDay(selectedDay) : [];

  return (
    <div className="gc-page">

      {/* HEADER */}
      <div className="gc-header">
        <div>
          <h1 className="gc-title">My Calendar</h1>
          <p className="gc-sub">Workouts, memberships, and personal events</p>
        </div>
        <div className="gc-header-actions">
          <div className="gc-view-toggle">
            <button className={`gc-toggle-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month</button>
            <button className={`gc-toggle-btn ${view === "week"  ? "active" : ""}`} onClick={() => setView("week")}>Week</button>
          </div>
          <button className="gc-btn-primary" onClick={openAdd}>+ Add Event</button>
        </div>
      </div>

      {/* NAV */}
      <div className="gc-nav">
        <button className="gc-nav-btn" onClick={prev}>←</button>
        <div className="gc-nav-center">
          <select className="gc-nav-select" value={currentMonth} onChange={e => setCurrentMonth(+e.target.value)}>
            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="gc-nav-select" value={currentYear} onChange={e => setCurrentYear(+e.target.value)}>
            {Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button className="gc-nav-btn" onClick={next}>→</button>
      </div>

      {/* LEGEND */}
      <div className="gc-legend">
        <span className="gc-legend-item routine">● Routine</span>
        <span className="gc-legend-item membership">● Membership</span>
        <span className="gc-legend-item gym">● Gym Event</span>
        <span className="gc-legend-item personal">● Personal</span>
        <span className="gc-legend-item invite">● Invite</span>
      </div>

      {/* MONTH VIEW */}
      {view === "month" && (
        <div className="gc-month-grid">
          {DAY_LABELS.map(d => <div key={d} className="gc-day-label">{d}</div>)}
          {monthDays.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            return (
              <div
                key={i}
                className={`gc-day-cell ${!day ? "empty" : ""} ${day && isToday(day) ? "today" : ""} ${dayEvents.length > 0 ? "has-events" : ""}`}
                onClick={() => day && setSelectedDay(day)}
              >
                {day && <span className="gc-day-number">{day}</span>}
                {day && (
                  <div className="gc-event-dots">
                    {dayEvents.slice(0, 4).map((ev, j) => (
                      <span key={j} className={`gc-dot ${dotColor(ev)}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div className="gc-week-view">
          {weekDays.map((wd, i) => {
            const dayEvs = getEventsForDay(wd.date);
            return (
              <div
                key={i}
                className={`gc-week-day ${isToday(wd.date) ? "today" : ""}`}
                onClick={() => setSelectedDay(wd.date)}
              >
                <div className="gc-week-day-label">{wd.label}</div>
                <div className="gc-week-day-number">{wd.date}</div>
                <div className="gc-week-events">
                  {dayEvs.slice(0, 4).map((ev, j) => (
                    <div key={j} className={`gc-week-event ${dotColor(ev)}`}>
                      {ev.time && <span className="gc-week-event-time">{fmtTime(ev.time)}</span>}
                      <span>{ev.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY DETAIL MODAL */}
      {selectedDay && (
        <div className="gc-modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="gc-modal" onClick={e => e.stopPropagation()}>
            <h3 className="gc-modal-title">{MONTH_NAMES[currentMonth]} {selectedDay}, {currentYear}</h3>

            {/* Membership events */}
            {selectedDayMembership.length > 0 && (
              <div className="gc-modal-section">
                <div className="gc-modal-section-label membership">Membership</div>
                {selectedDayMembership.map((ev, i) => (
                  <div key={i} className="gc-event-item membership">
                    <div className="gc-event-info">
                      <span className="gc-event-title">{ev.title}</span>
                      {ev.branch && <span className="gc-event-meta">{ev.category} · {ev.branch}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gym events */}
            {selectedDayGym.length > 0 && (
              <div className="gc-modal-section">
                <div className="gc-modal-section-label gym">Gym Events</div>
                {selectedDayGym.map((ev, i) => (
                  <div key={i} className="gc-event-item gym">
                    <div className="gc-event-info">
                      <span className="gc-event-title">{ev.title}</span>
                      {ev.time && <span className="gc-event-meta">{fmtTime(ev.time)}</span>}
                      {ev.description && <span className="gc-event-desc">{ev.description}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Personal events */}
            <div className="gc-modal-section">
              <div className="gc-modal-section-label personal">Your Events</div>
              {selectedDayEvents.length === 0 && (
                <p className="gc-empty">No personal events.</p>
              )}
              {selectedDayEvents.map((ev, i) => (
                <div key={i} className="gc-event-item personal">
                  <div className="gc-event-info">
                    <span className="gc-event-title">{ev.title}</span>
                    {ev.time && <span className="gc-event-meta">{fmtTime(ev.time)}</span>}
                    {ev.description && <span className="gc-event-desc">{ev.description}</span>}
                  </div>
                  <div className="gc-event-actions">
                    <button className="gc-btn-ghost" onClick={() => { setSelectedDay(null); openEdit(ev); }}>Edit</button>
                    <button className="gc-btn-ghost danger" onClick={() => { setSelectedDay(null); setDeletingEvent(ev); }}>Del</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedDayMembership.length === 0 && selectedDayGym.length === 0 && selectedDayEvents.length === 0 && (
              <p className="gc-empty">Nothing on this day.</p>
            )}

            <div className="gc-modal-actions">
              <button className="gc-btn-ghost" onClick={() => setSelectedDay(null)}>Close</button>
              <button className="gc-btn-primary" onClick={() => { setSelectedDay(null); openAdd(); }}>+ Add Event</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="gc-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="gc-modal" onClick={e => e.stopPropagation()}>
            <p className="gc-modal-title">{editingEvent ? "Edit Event" : "Add Event"}</p>
            <div className="gc-modal-form">
              <div className="gc-modal-field">
                <label className="gc-field-label">Title</label>
                <input
                  className="gc-modal-input"
                  type="text"
                  placeholder="e.g. Leg Day"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <span className="gc-error">{errors.title}</span>}
              </div>
              <div className="gc-modal-row">
                <div className="gc-modal-field">
                  <label className="gc-field-label">Date</label>
                  <input
                    className="gc-modal-input"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                  {errors.date && <span className="gc-error">{errors.date}</span>}
                </div>
                <div className="gc-modal-field">
                  <label className="gc-field-label">Time</label>
                  <input
                    className="gc-modal-input"
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="gc-modal-field">
                <label className="gc-field-label">Description</label>
                <textarea
                  className="gc-modal-input gc-modal-textarea"
                  placeholder="Optional notes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="gc-modal-actions">
              <button className="gc-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="gc-btn-primary" onClick={saveEvent} disabled={saving}>
                {saving ? "Saving..." : editingEvent ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deletingEvent && (
        <div className="gc-modal-overlay" onClick={() => setDeletingEvent(null)}>
          <div className="gc-modal gc-modal-sm" onClick={e => e.stopPropagation()}>
            <p className="gc-modal-title">Delete Event</p>
            <p className="gc-confirm-text">Delete <strong>{deletingEvent.title}</strong>?</p>
            <div className="gc-modal-actions">
              <button className="gc-btn-ghost" onClick={() => setDeletingEvent(null)}>Cancel</button>
              <button className="gc-btn-danger" onClick={deleteEvent} disabled={saving}>
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Routine;