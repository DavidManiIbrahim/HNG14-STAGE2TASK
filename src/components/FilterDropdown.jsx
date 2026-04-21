import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterDropdown.css';

const FilterDropdown = ({ filterStatuses, setFilterStatuses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const options = ['Draft', 'Pending', 'Paid'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    setFilterStatuses(prev => 
      prev.includes(option) 
        ? prev.filter(s => s !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className="filter-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="filter-text">Filter <span className="hide-mobile">by status</span></span>
        <ChevronDown 
          size={16} 
          color="#7c5dfa" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} 
        />
      </button>

      {isOpen && (
        <div className="filter-menu animate-fade-in">
          {options.map(option => (
            <label key={option} className="filter-option">
              <div className={`checkbox ${filterStatuses.includes(option) ? 'checked' : ''}`}>
                {filterStatuses.includes(option) && (
                  <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4.5l2.124 2.124L8.97 1.28" stroke="#FFF" strokeWidth="2" fill="none" fillRule="evenodd"/>
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                checked={filterStatuses.includes(option)}
                onChange={() => toggleOption(option)}
                className="sr-only"
              />
              <span className="option-label">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
