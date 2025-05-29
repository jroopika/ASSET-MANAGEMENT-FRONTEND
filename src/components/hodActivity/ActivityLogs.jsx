import React, { useState, useEffect } from 'react';
import { Card, Table, Container, Badge } from 'react-bootstrap';
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
        console.error('Error fetching requests:', errorMessage, error);
        setError(errorMessage);
        setRequests([
          {
            _id: 'sample1',
            userId: { name: 'John Doe (Sample)' },
            assetType: 'Laptop',
            reason: 'Need for development work',
            status: 'Approved',
            hodApprovalStatus: 'Pending',
            requestedAt: new Date().toISOString(),
          },
          {
            _id: 'sample2',
            userId: { name: 'Jane Smith (Sample)' },
            assetType: 'Projector',
            reason: 'Presentation needs',
            status: 'Rejected',
            hodApprovalStatus: 'Pending',
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
      <Container className="mt-4">
        <Card bg="dark" text="light" className="shadow-lg">
          <Card.Header as="h5" className="text-center">HOD Request Logs</Card.Header>
          <Card.Body>
            {loading && <p className="text-center">Loading requests...</p>}
            {error && <p className="text-center text-danger">Error: {error}</p>}
            {!loading && !error && requests.length > 0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Asset Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>HOD Approval</th>
                    <th>Requested At</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.userId?.name || 'System'}</td>
                      <td>{request.assetType || 'N/A'}</td>
                      <td>{request.reason || 'N/A'}</td>
                      <td>
                        {request.status ? (
                          <Badge
                            bg={request.status.toLowerCase() === 'approved' ? 'success' : 'danger'}
                          >
                            {request.status}{' '}
                            {request.status.toLowerCase() === 'approved' ? (
                              <FaCheck />
                            ) : (
                              <FaTimes />
                            )}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {request.hodApprovalStatus ? (
                          <Badge
                            bg={
                              request.hodApprovalStatus.toLowerCase() === 'approved'
                                ? 'success'
                                : request.hodApprovalStatus.toLowerCase() === 'pending'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {request.hodApprovalStatus}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{formatDate(request.requestedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              !loading && !error && <p className="text-center">No requests available</p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ActivityLogs;