import React from "react";
import { Link } from "react-router-dom";
import logo1 from '../assets/logo1.jpg'
const Home = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={logo1}
            alt="Disaster Relief"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#0b3d91', marginBottom: '1rem' }}>
            Disaster Relief Volunteer Platform
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#333' }}>
            Bridging the gap between <strong>those in need</strong> and <strong>volunteers ready to help</strong>.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/submit-help">
              <button style={{
                padding: '0.7rem 1.5rem',
                backgroundColor: '#e53935',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>🚨 Request Help</button>
            </Link>
            <Link to="/volunteer">
              <button style={{
                padding: '0.7rem 1.5rem',
                backgroundColor: '#43a047',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>🙌 Become a Volunteer</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#0b3d91' }}>
          How We Make a Difference
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <div style={{
            flex: '1 1 300px',
            backgroundColor: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>For People in Need</h3>
            <p style={{ color: '#333' }}>
              Submit urgent requests for food, shelter, medicine, or rescue with just a few clicks.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: '#e8f5e9',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>For Volunteers</h3>
            <p style={{ color: '#333' }}>
              Find real-time requests near you and make an immediate impact when it matters most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
