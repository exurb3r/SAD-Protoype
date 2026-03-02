const UserRoutine = require("../../models/user_models/UserRoutine");
const UserGameDetails = require("../../models/user_models/UserGameDetails");
const UserSocial = require("../../models/user_models/UserSocial");
const AppUsers = require("../../models/user_models/AppUsers");
const GymEvents = require("../../models/admin_models/GymEvents");

const gymcalendarData = async (req, res) => {
    try {
        const userId = req.user.id;
        let events = [];
        let personalEvents = [];
        let theGymEvents = [];

        const routines = await UserRoutine.findOne({ userId });

        if (routines) {
            routines.routines.forEach(routine => {
                if (routine.dayAssigned) {
                    const dayMap = {
                        Sunday: 0,
                        Monday: 1,
                        Tuesday: 2,
                        Wednesday: 3,
                        Thursday: 4,
                        Friday: 5,
                        Saturday: 6,
                    };

                    events.push({
                        title: `${routine.routineName}`,
                        daysOfWeek: [dayMap[routine.dayAssigned]],
                        backgroundColor: "#4CAF50"
                    });
                }
            });
        }

        const gameDetails = await UserGameDetails.findOne({ userId });

        if (gameDetails) {
            gameDetails.acceptedInvites.forEach(invite => {
                events.push({
                    title: "Workout Invite",
                    date: invite.date,
                    backgroundColor: "#2196F3"
                });
            });
        }

        const user = await AppUsers.findOne({ userId });

        if (user && user.membershipStatus.length > 0) {
            const membership = user.membershipStatus[0];

            if (membership.startDate) {
                events.push({
                    title: "Membership Started",
                    date: membership.startDate,
                    backgroundColor: "#9C27B0"
                });
            }

            if (membership.expiryDate) {
                events.push({
                    title: "Membership Expires",
                    date: membership.expiryDate,
                    backgroundColor: "#F44336"
                });
            }
        }

        const gymEvents = await GymEvents.findOne();

        if (gymEvents) {
            gymEvents.event.forEach(event => {
                events.push({
                    title: event.title,
                    date: event.date,
                    
                    backgroundColor: "#FF9800"
                });
                theGymEvents.push({
                    
                    _id: event._id,
                    title: event.title,
                    date: event.date,
                    time: event.time
                })
            });
        }

        const social = await UserSocial.findOne({ userId });

        if (social) {
            social.calendar.forEach(event => {
                events.push({
                    title: event.title,
                    date: event.date,
                    backgroundColor: "#607D8B"
                });
                personalEvents.push({
                    _id: event._id,
                    title: event.title,
                    date: event.date,
                    time: event.time
                })
            });
        }

        res.status(200).json({
            events,
            personalEvents,
            gymEvents: theGymEvents
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const addEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, date, time } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date required" });
    }

    const social = await UserSocial.findOne({ userId });

    if (!social) {
      return res.status(404).json({ message: "UserSocial not found" });
    }

    social.calendar.push({
      title,
      date,
      time
    });

    await social.save();

    res.status(201).json({ message: "Event added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const editEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, date, time } = req.body;

    const social = await UserSocial.findOne({ userId });

    if (!social) {
      return res.status(404).json({ message: "UserSocial not found" });
    }

    const event = social.calendar.id( id );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title;
    event.date = date;
    event.time = time;

    await social.save();

    res.json({ message: "Event updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const social = await UserSocial.findOne({ userId });

    if (!social) {
      return res.status(404).json({ message: "UserSocial not found" });
    }

    social.calendar.pull( id );

    await social.save();

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { gymcalendarData, addEvent, editEvent, deleteEvent };