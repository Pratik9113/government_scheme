const cron = require("node-cron");
const EventModel = require("./models/EventSchema");

const node_cron = async() => {
        cron.schedule("0 * * * *", async () => { 
        console.log("🔄 Updating event statuses...");
        const currentDate = new Date();

        try {
            await EventModel.updateMany(
                { date: { $lt: currentDate } },
                { $set: { status: "Completed" } }
            );

            await EventModel.updateMany(
                { date: { $gte: currentDate, $lte: new Date(currentDate.setHours(23, 59, 59, 999)) } },
                { $set: { status: "Past" } }
            );

            await EventModel.updateMany(
                { date: { $gt: new Date() } },
                { $set: { status: "Upcoming" } }
            );

            console.log("✅ Event statuses updated successfully!");
        } catch (error) {
            console.error("❌ Error updating event statuses:", error);
        }
    });
}
module.exports = node_cron;