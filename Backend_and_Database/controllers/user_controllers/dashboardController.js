const AppUser = require("../../models/user_models/AppUsers");
const UserGameDetails = require("../../models/user_models/UserGameDetails");
const UserProgress = require("../../models/user_models/UserProgress");
const UserPreferenceAndMisc = require("../../models/user_models/UserPreferenceAndMisc");
const UserRoutine = require("../../models/user_models/UserRoutine");

const dashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await AppUser.findOne({ userId: userId } );
        if (!user) return res.status(404).json({ message: "User not found" });

        const gameDetails = await UserGameDetails.findOne( { userId: userId } );
        const progressDoc = await UserProgress.findOne( { userId: userId } );
        const preferences = await UserPreferenceAndMisc.findOne( { userId: userId });
        const routines = await UserRoutine.findOne( { userId: userId } );


        const membershipData = user.membershipStatus[0] || {};
        const membership = membershipData.category || "No Membership";
        const membershipDuration = membershipData.remainingDays || 0;

        const level = gameDetails?.level || 1;
        const exp = gameDetails?.exp_points || 0;
        const currentStreak = gameDetails?.currentStreak || 0;

        const recentAchievements = gameDetails?.achievements
            ?.slice(-3)
            .map(a => a.title) || [];

        const notifications = preferences?.notifications?.map((n, index) => ({
            id: index + 1,
            message: `${n.title} - ${n.description}`
        })) || [];


        const weeklyWorkouts = new Array(7).fill(0);
        const weeklyHours = new Array(7).fill(0);

        const workoutDistributionMap = {};

        if (progressDoc?.progress) {
            progressDoc.progress.forEach(entry => {
                const date = new Date(entry.date);
                const day = date.getDay();

                weeklyWorkouts[day] += entry.totalWorkouts || 0;
                weeklyHours[day] += entry.hoursSpent || 0;

                entry.distribution.forEach(d => {
                    if (!workoutDistributionMap[d.workoutType]) {
                        workoutDistributionMap[d.workoutType] = 0;
                    }
                    workoutDistributionMap[d.workoutType] += d.numberofWorkouts || 0;
                });
            });
        }


        const workoutTypes = ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"];

        const workoutDistribution = workoutTypes.map(type =>
            workoutDistributionMap[type] || 0
        );

        let numberOfWorkouts = 0;
        let duration = 0;
        let focus = [];
        let expGained = 0;

        if (routines?.routineHistory?.length > 0) {
            const lastWorkout = routines.routineHistory[
                routines.routineHistory.length - 1
            ];

            numberOfWorkouts = lastWorkout.exercises.length;
            duration = lastWorkout.duration || 0;
            expGained = lastWorkout.expGained || 0;

            const focusSet = new Set();
            lastWorkout.exercises.forEach(ex => {
                if (ex.category) focusSet.add(ex.category);
            });

            focus = Array.from(focusSet);
        }

        res.status(200).json({
            username: user.username,
            membership,
            membershipDuration,
            currentStreak,
            recentAchievements,
            exp,
            level,
            notifications,
            weeklyWorkouts,
            weeklyHours,
            workoutDistribution,

            numberOfWorkouts,
            duration,
            focus,
            expGained
    });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { dashboardData };