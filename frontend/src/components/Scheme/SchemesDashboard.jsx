import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const SchemesDashboard = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [filters, setFilters] = useState({ tags: [], tagMode: 'any', hasSteps: false, hasLink: false });
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const getSchemeData = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND}/scheme/getScheme?lang=${language}`;
                const response = await axios.get(url);
                const list = response.data.data || [];
                setSchemes(list);
                setFilteredSchemes(list);
                const uniqueTags = Array.from(new Set(list.flatMap(s => Array.isArray(s.tags) ? s.tags : []).filter(Boolean))).sort();
                setAllTags(uniqueTags);
            } catch (error) {
                console.error("Error fetching scheme data:", error);
                alert("Failed to load schemes. Please try again.");
            }
        };

        if (language) {
            getSchemeData();
        }
    }, [language]);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        const selectedTags = filters.tags || [];
        const tempSchemes = schemes.filter((scheme) => {
            const matchesState = true;
            const matchesQuery = query
                ? (
                    (scheme.title || "").toLowerCase().includes(query) ||
                    (scheme.description || "").toLowerCase().includes(query) ||
                    (Array.isArray(scheme.tags) ? scheme.tags.join(" ").toLowerCase().includes(query) : false)
                )
                : true;
            const matchesTags = selectedTags.length > 0
                ? (Array.isArray(scheme.tags) && (
                    filters.tagMode === 'all'
                        ? selectedTags.every(t => scheme.tags.includes(t))
                        : selectedTags.some(t => scheme.tags.includes(t))
                  ))
                : true;
            const matchesSteps = filters.hasSteps ? !!(scheme.steps && String(scheme.steps).trim().length > 0) : true;
            const matchesLink = filters.hasLink ? !!(scheme.link && String(scheme.link).trim().length > 0) : true;
            return matchesState && matchesQuery && matchesTags && matchesSteps && matchesLink;
        });
        setFilteredSchemes(tempSchemes);
    }, [filters, searchQuery, schemes]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
    };

    const toggleTag = (tag) => {
        setFilters(prev => {
            const exists = prev.tags.includes(tag);
            return { ...prev, tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] };
        });
    };

    // Farmer-friendly tokens
    const pageBg = 'bg-gradient-to-br from-emerald-50 to-lime-100';
    const surfaceClass = 'bg-white/80 backdrop-blur';

    return (
        <div className={`min-h-screen ${pageBg}`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800">Government Schemes</h1>
                    <div className={`flex items-center gap-2 ${surfaceClass} border border-gray-200 rounded-lg px-3 py-2 w-full md:w-96`}>
                        <Search className="w-5 h-5 text-gray-500" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, description, or tag"
                            className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className={`p-4 rounded-lg border border-gray-200 ${surfaceClass}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {allTags.length === 0 && (
                                <span className="text-sm text-gray-500">No tags available</span>
                            )}
                            {allTags.map(tag => {
                                const active = filters.tags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm border transition ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/70 text-gray-700 border-gray-300 hover:bg-emerald-50'}`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                        {allTags.length > 0 && (
                            <div className="mt-3 flex items-center gap-4 text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="tagMode" value="any" checked={filters.tagMode === 'any'} onChange={handleFilterChange} />
                                    <span>Match any</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="tagMode" value="all" checked={filters.tagMode === 'all'} onChange={handleFilterChange} />
                                    <span>Match all</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggles */}
                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    <label className={`px-3 py-2 rounded-md border border-gray-200 ${surfaceClass} flex items-center gap-2`}>
                        <input type="checkbox" name="hasSteps" checked={filters.hasSteps} onChange={handleFilterChange} />
                        <span>Has steps</span>
                    </label>
                    <label className={`px-3 py-2 rounded-md border border-gray-200 ${surfaceClass} flex items-center gap-2`}>
                        <input type="checkbox" name="hasLink" checked={filters.hasLink} onChange={handleFilterChange} />
                        <span>Has link</span>
                    </label>
                </div>

                {/* Results count */}
                <div className="text-sm text-gray-600 mb-4">Total {filteredSchemes.length} schemes</div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map((scheme, index) => (
                        <div key={index} className={`p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition ${surfaceClass}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xs text-gray-500">{scheme.state}</div>
                                    <h3 className="text-lg font-bold text-emerald-700 mt-1">
                                        <a href={scheme.link} target="_blank" rel="noreferrer">{scheme.title}</a>
                                    </h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{scheme.description}</p>
                            {Array.isArray(scheme.tags) && scheme.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {scheme.tags.slice(0, 6).map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 flex items-center justify-between">
                                <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md px-3 py-1.5"
                                >
                                    Apply / Learn More
                                </a>
                                {scheme.steps && (
                                    <span className="text-xs text-gray-500">Steps available</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchemesDashboard;
