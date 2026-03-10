const AppUsers = require("../../models/user_models/AppUsers");
const UserSideGymLog = require("../../models/user_models/UserGymLog");

const getGymHistory = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await AppUsers.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const memberships = user.membershipStatus || [];

        const logDoc = await UserSideGymLog.findOne({ userId: userId });

        const logs = logDoc
            ? [...logDoc.userlog].sort((a,b)=> new Date(b.date) - new Date(a.date))
            : [];


        const loginEvents = logs.map(log => ({
            title: ` Login (${log.branch})`,
            date: log.date,
            extendedProps: {
                type: "login",
                branch: log.branch,
                timeIn: log.timeIn,
                timeOut: log.timeOut
            }
        }));


        const membershipEvents = memberships.flatMap(m => {

            const events = [];

            if (m.startDate) {
                events.push({
                    title: `🟢 Membership Start (${m.branch})`,
                    date: m.startDate,
                    extendedProps: {
                        type: "membership_start",
                        category: m.category,
                        branch: m.branch
                    }
                });
            }

            if (m.expiryDate) {
                events.push({
                    title: `🔴 Membership Expiry (${m.branch})`,
                    date: m.expiryDate,
                    extendedProps: {
                        type: "membership_expiry",
                        category: m.category,
                        branch: m.branch
                    }
                });
            }

            return events;

        });

        const calendarEvents = [
            ...loginEvents,
            ...membershipEvents
        ];

        res.status(200).json({
            memberships,
            logs,
            calendarEvents
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getGymHistory };