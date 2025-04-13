
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true, enum: ["Conference", "Workshop", "Webinar", "Social"] },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: 100 },
    attendeesCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Upcoming", "Past", "Completed"], default: "Upcoming" },
    image: { type: String },
    isPublic: { type: Boolean, default: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    price: { type: Number, default: 0 },
    tags: [{ type: String }],
}, { timestamps: true });

const EventModel = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default EventModel;
