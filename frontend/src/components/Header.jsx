import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestsContext';
import logo from '../assets/logo.png'

const Header = () => {
  const { isOnline, queuedRequests = [] } = useRequests();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      background: 'linear-gradient(90deg, #0b3d91, #3f51b5, #673ab7)',
      color: '#fff',
      padding: '1rem 0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={logo}
          alt="Disaster Relief Logo"
          style={{ width: '40px', height: '40px' }}
/>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Disaster Relief</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Hope • Help • Humanity</p>
          </div>
        </div>

        {/* Sync Status */}
        <div style={{
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 600,
          backgroundColor: isOnline ? '#4caf50' : '#f44336',
          color: '#fff'
        }}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
          {queuedRequests.length > 0 && ` (${queuedRequests.length} queued)`}
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <Link to="/submit-help" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Submit Help</Link>
          <Link to="/volunteer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Volunteer</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            display: 'none',
            cursor: 'pointer'
          }}
          className="mobile-hamburger"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#3f51b5',
          padding: '1rem 20px',
          gap: '10px'
        }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/submit-help" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Submit Help</Link>
          <Link to="/volunteer" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Volunteer</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
