import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import HODNavbar from '../Login/Navbar';
import { fetchLogs } from '../../services/api';
import './ActivityLogs.css';

const ActivityLogs = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const response = await fetchLogs();
        setRequests(response);
      } catch (error) {
        const errorMessage = error.message || 'Failed to fetch requests';
        setError(errorMessage);
        setRequests([
          {
            _id: 'sample1',
            userId: { name: 'John Doe (Sample)' },
            assetType: 'Laptop',
            reason: 'Need for development work',
            status: 'Approved',
            requestedAt: new Date().toISOString(),
          },
          {
            _id: 'sample2',
            userId: { name: 'Jane Smith (Sample)' },
            assetType: 'Projector',
            reason: 'Presentation needs',
            status: 'Rejected',
            requestedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <HODNavbar />
      <section className="hod-section">
        <h2>Request Activity Logs</h2>
        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <table className="hod-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Asset Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested At</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">No requests available</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.userId?.name || 'System'}</td>
                    <td>{request.assetType || 'N/A'}</td>
                    <td>{request.reason || 'N/A'}</td>
                    <td>
                      {request.status ? (
                        <span className={`badge badge-${request.status.toLowerCase() === 'approved' ? 'success' : 'danger'}`}>
                          {request.status}{' '}
                          {request.status.toLowerCase() === 'approved' ? <FaCheck /> : <FaTimes />}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>{formatDate(request.requestedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
};

export default ActivityLogs;