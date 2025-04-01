

import React, { useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, DollarSign } from 'lucide-react';

const EventCard = ({ event, setSelectedEvent, socket }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    useEffect(() => {
        if (socket) {
            socket.emit('enrollment', event._id);
        }
    }, [])


    return (
        <div
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden m-2.5  bg-transparent"
            onClick={() => setSelectedEvent(event)}
        >
            <div className="relative">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                    className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium
                    ${event.status === 'Upcoming' ? 'bg-green-100 text-green-800' :
                            event.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}
                >
                    {event.status}
                </span>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">{event.location}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm border border-gray-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium">
                            {event.attendees.length}/{event.maxAttendees}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-semibold">{event.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
