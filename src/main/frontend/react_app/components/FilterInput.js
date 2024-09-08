import React, { useState } from 'react';

const FilterInput = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        onFilterChange(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Поиск"
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};

export default FilterInput;