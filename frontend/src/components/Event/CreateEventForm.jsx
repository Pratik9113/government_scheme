import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Upload, Tags } from 'lucide-react';
import axios from "axios"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const CreateEventForm = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Conference',
        maxAttendees: 100,
        status: 'Upcoming',
        image: null,
        isPublic: true,
        price: 0,
        tags: []
    });
    const [preview, setPreview] = useState(null);

    const [tagInput, setTagInput] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                setEventData((prev) => ({
                    ...prev,
                    [name]: type === "file" ? files[0] : value
                }));
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setEventData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!eventData.tags.includes(tagInput.trim())) {
                setEventData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setEventData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const onClose = (e) => {
        e.preventDefault();
        navigate("/")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!eventData.image) {
            alert("Please select an image.");
            return;
        }
        const combinedDateTime = new Date(`${eventData.date}T${eventData.time}`);
        const formData = new FormData();
        formData.append("image", eventData.image);
        formData.append("title", eventData.title);
        formData.append("description", eventData.description);
        formData.append("date", combinedDateTime.toISOString());
        formData.append("location", eventData.location);
        formData.append("category", eventData.category);
        formData.append("maxAttendees", eventData.maxAttendees);
        formData.append("status", eventData.status);
        formData.append("isPublic", eventData.isPublic);
        formData.append("price", eventData.price);
        formData.append("tags", JSON.stringify(eventData.tags));
        console.log("Form submitted:", formData);
        const url = `${import.meta.env.VITE_BACKEND}/event/create`;
        try {
            const createEvent = await axios.post(url, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (createEvent.data.success) {
                toast.success(createEvent.data.message);

                setEventData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    category: 'Conference',
                    maxAttendees: 100,
                    status: 'Upcoming',
                    image: null,
                    isPublic: true,
                    price: 0,
                    tags: []
                });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Upload failed. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
                        <button
                            onClick={(e) => onClose(e)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prompt Description
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter your problem
                            </label>
                            <textarea
                                name="description"
                                required
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={eventData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={eventData.time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={eventData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventData.category}
                                onChange={handleChange}
                            >
                                <option value="Conference">Conference</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Webinar">Webinar</option>
                                <option value="Social">Social</option>
                            </select>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Attendees
                            </label>
                            <input
                                type="number"
                                name="maxAttendees"
                                min="1"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventData.maxAttendees}
                                onChange={handleChange}
                            />
                        </div> */}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (Press Enter to add)
                        </label>
                        <div className="relative">
                            <Tags className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add tags..."
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {eventData.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Price and Visibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Money Required (Rs)
                            </label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventData.price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isPublic"
                                id="isPublic"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={eventData.isPublic}
                                onChange={handleChange}
                            />
                            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                                Make this event public
                            </label>
                        </div> */}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="image"
                                            type="file"
                                            accept='image/*'
                                            className="sr-only"
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {preview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium">Preview:</p>
                                <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
                            </div>
                        )}
                    </div>


                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventForm;