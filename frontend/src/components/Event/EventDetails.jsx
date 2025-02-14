

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import axios from "axios"
const EventDetails = ({ isGuestLogin, event, onClose, socket }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const [isRegistered, setIsRegistered] = useState('');


    const handleRegister = async (event) => {
        if (isGuestLogin) {
            toast.warning("You cannot register as a guest. Please log in to register for events.");
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND}/event/register`;
        const data = { eventId: event._id };
        try {
            const response = await axios.post(url, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                toast.success("Registered successfully.");
                setIsRegistered(response.data.data.isAttending);
                if (socket) {
                    socket.emit('enrollment', event._id);
                }
            } else {
                toast.warning("Already registered for the event.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error registering for event.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />

                    <div className="space-y-4">
                        <p className="text-gray-600">{event.description}</p>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span>{formatDate(event.date)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span>{new Date(event.date).toLocaleTimeString()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-600" />
                                <span>{event.location}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-600" />
                                <span>{event.attendees.length} attending ({event.maxAttendees - event.attendees.length} spots left)</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-600" />
                                <div className="flex flex-wrap gap-2">
                                    {event.tags?.map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRegister(event)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                        >
                            {isRegistered ? "Already Registered" : "Register Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
