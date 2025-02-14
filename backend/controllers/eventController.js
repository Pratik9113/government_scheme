const EventModel = require("../models/EventSchema.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require('path');

const eventController = async(req,res)=>{
    const {title, description, date, location,
        category, maxAttendees, status, image,
        isPublic, companyId, price, tags} = req.body;
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY
    })
    const userId = req.userId;
    if(!title || !description || !date || !location || !category){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log("File is", req.file);
        const filePath = req.file.path;
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ message: "File not found on server" });
        }
        const cld_upload = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
            folder: "images", // Specifying the types of the media (i.e videos)
        });
        console.log("Cloudinary Metadata", cld_upload);

        const newEvent = new EventModel({
            title, description, date, location,
            category, organizer: userId, maxAttendees,
            status, image:cld_upload.secure_url, isPublic, companyId, price, tags
        });
        await newEvent.save();
        fs.unlink(filePath, (err) => {
            if (err) {
            console.error("Failed to delete local file:", err);
            } else {
            console.log("Local file deleted successfully");
            }
        });

        res.status(201).json({success:true,data:newEvent,message: "Event created successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}


const getAllEventController = async (req, res) => {
    try {
        const events = await EventModel.find({ isPublic: true });
        if (!events || events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No public events found",
            });
        }

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error("Error fetching public events:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


const getEventControllerForEventManager = async(req,res)=>{
    const userId = req.userId;
    try {
        const events = await EventModel.find({organizer: userId});
        res.status(200).json({success:true,data:events});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}


const registerStudentForEventController = async(req,res)=>{
    const {eventId} = req.body;
    const userId = req.userId;
    if(!eventId){
        return res.status(400).json({message: "Please provide event id"});
    }
    try {
        const event = await EventModel.findOne({_id:eventId});
        if(!event){
            return res.status(404).json({message: "Event not found"});
        }
        if(event.maxAttendees <= event.attendees.length){
            return res.status(400).json({message: "Event is full"});
        }
        if(event.attendees.includes(userId)){
            return res.status(400).json({message: "You are already registered for this event"});
        }
        event.attendees.push(userId);
        const eventWithAttendanceStatus = {
            ...event.toObject(),
            isAttending: event.attendees.some(id => id.toString() === userId.toString())
        };
        await event.save();
        return res.status(200).json({success:true,data:eventWithAttendanceStatus,message: "Registered successfully for the event"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {eventController, getAllEventController, getEventControllerForEventManager, registerStudentForEventController};