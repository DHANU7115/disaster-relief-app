import React, { useEffect, useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VolunteerDashboard = () => {
  const { requests, updateRequestStatus } = useRequests();
  const [filter, setFilter] = useState({ urgency: 'all', type: 'all' });
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    let tempRequests = [...requests];

    if (filter.urgency !== 'all') {
      tempRequests = tempRequests.filter(req => req.urgency === parseInt(filter.urgency));
    }

    if (filter.type !== 'all') {
      tempRequests = tempRequests.filter(req => req.needType.includes(filter.type));
    }

    setFilteredRequests(tempRequests);
  }, [requests, filter]);

  const handleAccept = async (req) => {
    await updateRequestStatus(req.id || req.localId, { status: 'in-progress' });
  };

  const handleResolve = async (req) => {
    await updateRequestStatus(req.id || req.localId, { status: 'resolved' });
  };

  return (
    <div style={{ padding: '2rem 1rem', backgroundColor: '#f0f4f8', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center', color: '#0b3d91', marginBottom: '1.5rem' }}>
        Volunteer Dashboard
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <label>
          Urgency:
          <select
            value={filter.urgency}
            onChange={e => setFilter({ ...filter, urgency: e.target.value })}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', borderRadius: '5px' }}
          >
            <option value="all">All</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Less</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Critical</option>
          </select>
        </label>

        <label>
          Need Type:
          <select
            value={filter.type}
            onChange={e => setFilter({ ...filter, type: e.target.value })}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', borderRadius: '5px' }}
          >
            <option value="all">All</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
            <option value="medicine">Medicine</option>
            <option value="shelter">Shelter</option>
            <option value="rescue">Rescue</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      {/* Requests List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {filteredRequests.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%', color: '#333' }}>
            No requests available.
          </p>
        )}

        {filteredRequests.map(req => (
          <div
            key={req.id || req.localId}
            style={{
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: '5px solid #0b3d91',
              boxShadow: '0px 1px 5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginTop: '0', color: '#0b3d91' }}>{req.requesterName}</h3>
            <p><strong>Phone:</strong> {req.phone}</p>
            <p><strong>Needs:</strong> {req.needType.join(', ')}</p>
            <p><strong>Description:</strong> {req.description}</p>
            <p><strong>Urgency:</strong> {req.urgency}</p>
            <p><strong>Status:</strong> {req.status}</p>

            <button
              onClick={() => handleAccept(req)}
              disabled={req.status !== 'pending'}
              style={{
                marginTop: '0.5rem',
                marginRight: '0.5rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: req.status !== 'pending' ? '#ccc' : '#0b3d91',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: req.status !== 'pending' ? 'not-allowed' : 'pointer',
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleResolve(req)}
              disabled={req.status === 'resolved'}
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: req.status === 'resolved' ? '#ccc' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: req.status === 'resolved' ? 'not-allowed' : 'pointer',
              }}
            >
              Resolve
            </button>
          </div>
        ))}
      </div>

      {/* Map View */}
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#0b3d91' }}>
        Map View
      </h2>
      <MapContainer
        center={[17.385, 78.4867]}
        zoom={12}
        style={{ height: '400px', width: '100%', borderRadius: '8px', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredRequests.map(req => (
          <Marker key={req.id || req.localId} position={[req.location.lat, req.location.lng]}>
            <Popup>
              <strong>{req.requesterName}</strong><br />
              Needs: {req.needType.join(', ')}<br />
              Urgency: {req.urgency}<br />
              Status: {req.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default VolunteerDashboard;
