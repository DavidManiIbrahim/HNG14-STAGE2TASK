import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
            <path fill="#FFF" fillRule="evenodd" d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"/>
          </svg>
        </div>
      </div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {isDarkMode ? <Sun size={20} color="#888eb0" /> : <Moon size={20} color="#7e88c3" />}
        </button>
        <div className="divider"></div>
        <div className="avatar">
          <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User avatar" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
