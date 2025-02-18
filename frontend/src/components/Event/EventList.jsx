

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, DollarSign } from 'lucide-react';
import { UserCircle, Search, Filter, Menu, X, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import axios from "axios";
import EventDashboard from './EventDashboard';

const EventList = ({ isGuestLogin }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Fetch all events
        const getAllEvent = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND}/event/all`;
                const response = await axios.get(url, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setEvents(response.data.data);
                    setIsRegistered(response.data.data.isAttending); // You need to set if the user is registered
                } else {
                    toast.error("No events found.");
                }

                const socketInstance = io(import.meta.env.VITE_BACKEND);
                setSocket(socketInstance);

                socketInstance.on('updateAttendeeList', (updatedEvent) => {
                    setEvents(prevEvents =>
                        prevEvents.map(event =>
                            event._id === updatedEvent._id ? updatedEvent : event
                        )
                    );
                });

                // Cleanup on component unmount
                return () => socketInstance.disconnect();
            } catch (error) {
                console.error(error);
                toast.error("Error fetching events.");
            }
        };

        getAllEvent();
    }, []);

    useEffect(() => {
        const filtered = events.filter(event => {
            if (activeFilter === 'all') return true;
            return event.status.toLowerCase() === activeFilter.toLowerCase();
        });
        setFilteredEvents(filtered);
    }, [activeFilter, events]);

    // const handleRegister = async (event) => {
    //     const url = `${import.meta.env.VITE_BACKEND}/event/register`;
    //     const data = { eventId: event._id };
    //     try {
    //         const response = await axios.post(url, data, {
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.data.success) {
    //             toast.success("Registered successfully.");
    //             setSelectedEvent(event._id);
    //             setIsRegistered(true); // Update registration status
    //             if (socket) {
    //                 socket.emit('enrollment', event._id); // Notify socket about the registration
    //             }
    //         } else {
    //             toast.warning("Already registered for the event.");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Error registering for event.");
    //     }
    // };

    const filterButtons = [
        { id: 'all', icon: <TrendingUp size={18} />, label: 'All Government Scheme' },
        { id: 'Upcoming', icon: <Clock size={18} />, label: 'Upcoming Scheme' },
        { id: 'Past', icon: <Calendar size={18} />, label: 'Private Scheme' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 bg-white bg-opacity-50">
            <EventDashboard
                setActiveFilter={setActiveFilter}
                filterButtons={filterButtons}
                activeFilter={activeFilter}
                events={filteredEvents}
                socket={socket}
                isGuestLogin={isGuestLogin}
            />
        </div>
    );
};

export default EventList;
