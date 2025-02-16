
import React, { useState } from 'react';
import { UserCircle, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import EventDetails from './EventDetails';

const EventDashboard = ({ setActiveFilter, filterButtons, activeFilter, events, socket, isGuestLogin }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate("/create");
    };

    // Filter events based on search query
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white  bg-transparent">
            <nav className="bg-white sticky shadow-sm top-0 z-50 border-b">
                <div className="mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-800">
                                EventHub
                            </span>
                        </div>

                        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
                                onClick={handleCreateEvent}
                            >
                                Create Event
                            </button>
                        </div>

                        <button className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                            <UserCircle className="mr-2" size={30} />
                        </button>
                    </div>

                    <div className="py-3 flex items-center gap-3 overflow-x-auto">
                        {filterButtons.map((button) => (
                            <button
                                key={button.id}
                                onClick={() => setActiveFilter(button.id)}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all
                                    ${activeFilter === button.id
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="mr-2">{button.icon}</span>
                                {button.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Event List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            setSelectedEvent={setSelectedEvent}
                            socket={socket}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-4">No events found</p>
                )}
            </div>

            {selectedEvent && (
                <EventDetails
                    isGuestLogin={isGuestLogin}
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    socket={socket}
                />
            )}
        </div>
    );
};

export default EventDashboard;
