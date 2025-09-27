import React, { useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { apiService } from '../services/apiService';

const NEED_TYPES = ['food', 'water', 'medicine', 'shelter', 'rescue', 'clothing', 'other'];

const RequestForm = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    phone: '',
    needType: [],
    description: '',
    urgency: 3,
    location: { lat: null, lng: null }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOnline, addQueuedRequest } = useRequests();

  const handleNeedTypeChange = (need) => {
    setFormData(prev => ({
      ...prev,
      needType: prev.needType.includes(need)
        ? prev.needType.filter(n => n !== need)
        : [...prev.needType, need]
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        () => {
          // Fallback mock location
          setFormData(prev => ({
            ...prev,
            location: { lat: 17.3850, lng: 78.4867 }
          }));
          alert('📍 Using demo location. Please enable location in production.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.lat) {
      alert('Please set your location first');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isOnline) {
        await apiService.createRequest(formData);
        alert('✅ Help request submitted successfully!');
      } else {
        const localId = await addQueuedRequest(formData);
        alert(`📱 Request saved offline (ID: ${localId.slice(0, 8)}). Will sync when online.`);
      }

      setFormData({
        requesterName: '',
        phone: '',
        needType: [],
        description: '',
        urgency: 3,
        location: { lat: null, lng: null }
      });
    } catch (error) {
      alert('❌ Error submitting request: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '700px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#0b3d91', marginBottom: '1.5rem' }}>Submit Help Request</h2>

      {/* Name */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Your Name *</label>
        <input
          type="text"
          value={formData.requesterName}
          onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Phone Number *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Need Types */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 600 }}>What do you need? *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
          {NEED_TYPES.map(need => (
            <label key={need} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={formData.needType.includes(need)}
                onChange={() => handleNeedTypeChange(need)}
              />
              {need.charAt(0).toUpperCase() + need.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your situation..."
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            minHeight: '100px'
          }}
        />
      </div>

      {/* Urgency */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>
          Urgency Level: {formData.urgency} {formData.urgency === 5 ? '(Critical)' : ''}
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <span>1 (Low)</span>
          <span>5 (Critical)</span>
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 600 }}>Location *</label>
        <button
          type="button"
          onClick={getCurrentLocation}
          style={{
            marginTop: '5px',
            padding: '0.5rem 1rem',
            backgroundColor: '#0b3d91',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          📍 Use My Current Location
        </button>
        {formData.location.lat && (
          <p style={{ marginTop: '5px', color: 'green' }}>
            ✅ Location set: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.location.lat}
        style={{
          width: '100%',
          padding: '0.7rem',
          backgroundColor: '#0b3d91',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        {isSubmitting ? 'Submitting...' : isOnline ? 'Submit Request' : 'Save Offline'}
      </button>

      {!isOnline && (
        <p style={{ color: '#f44336', fontWeight: 600, marginTop: '0.5rem', textAlign: 'center' }}>
          ⚠️ You are offline. Request will be saved locally.
        </p>
      )}
    </form>
  );
};

export default RequestForm;
