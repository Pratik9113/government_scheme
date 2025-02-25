import React, { useState } from 'react';
import './filter.css';

const Filter = () => {
    const [selectedMinistry, setSelectedMinistry] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        level: [],
        benefitType: [],
        applicationMode: []
    });

    const ministries = [
        "Comptroller And Auditor General Of India",
        "Ministry Of Agriculture and Farmers Welfare",
        "Ministry Of Chemicals And Fertilizers",
        "Ministry Of Commerce And Industry",
        "Ministry Of Communication"
    ];

    const levels = ["Central", "State"];
    const benefitTypes = ["Cash", "Composite", "In Kind"];
    const applicationModes = ["Online", "Offline", "Online - via CSCs"];

    const handleCheckboxChange = (category, value) => {
        setSelectedFilters(prevState => {
            const updatedCategory = prevState[category].includes(value)
                ? prevState[category].filter(item => item !== value)
                : [...prevState[category], value];

            return { ...prevState, [category]: updatedCategory };
        });
    };

    const resetFilters = () => {
        setSelectedMinistry('');
        setSelectedFilters({ level: [], benefitType: [], applicationMode: [] });
    };

    return (
        <div className="filter-container">
            <div className="filter-header">
                <h3>Filter By</h3>
                <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
            </div>

            <label>Ministry Name</label>
            <select value={selectedMinistry} onChange={(e) => setSelectedMinistry(e.target.value)}>
                <option value="">Select</option>
                {ministries.map((ministry, index) => (
                    <option key={index} value={ministry}>{ministry}</option>
                ))}
            </select>

            <div className="filter-section">
                <h4>Level</h4>
                {levels.map((level, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.level.includes(level)}
                            onChange={() => handleCheckboxChange('level', level)}
                        />
                        {level}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <h4>Benefit Type</h4>
                {benefitTypes.map((type, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.benefitType.includes(type)}
                            onChange={() => handleCheckboxChange('benefitType', type)}
                        />
                        {type}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <h4>Application Mode</h4>
                {applicationModes.map((mode, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.applicationMode.includes(mode)}
                            onChange={() => handleCheckboxChange('applicationMode', mode)}
                        />
                        {mode}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Filter;
