// src/components/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import TopNavbar from './TopNavbar';
import SideNavbar from '../components/common/SideNavbar';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserRole(decoded.role);
      } catch (e) {
        setCurrentUserRole(null);
      }
    }
    fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details');
      });
  }, [userId]);

  const loadUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/emails`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers([]); // Always set to array on error
        const data = await response.json();
        console.error('Failed to load users:', data);
      }
    } catch (err) {
      setUsers([]); // Always set to array on error
      console.error('Error loading users:', err);
    }
  };

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User accepted successfully!');
        setUser({ ...user, status: 'Active' });
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to accept user');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User rejected and deleted successfully!');
        navigate('/admin');
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to reject user');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/delete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User deleted successfully!');
        navigate('/admin');
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to delete user');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleAddAdminClick = () => {
    loadUsers();
    setShowAddAdminModal(true);
  };

  const handleConfirmAdminChange = async () => {
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/change-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_admin_email: selectedUser })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setShowConfirmModal(false);
        setShowAddAdminModal(false);
        setSelectedUser('');

        // Redirect to admin page after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to change admin');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetLink = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    setSuccessMessage('');
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/send-reset-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'Reset link sent successfully!');
      } else {
        setError(data.detail || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="main-content" style={{ marginTop: '6rem', marginLeft: 220 }}>
        <Container className="py-4">
          <p className="text-danger">{error}</p>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="main-content" style={{ marginTop: '6rem', marginLeft: 220 }}>
        <Container className="py-4">
          <p>Loading...</p>
        </Container>
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      <SideNavbar role="admin" />
      <div className="main-content" style={{ marginTop: '6rem', marginLeft: 220 }}>
        <Container className="py-4 close-navbar-additional">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2>User Details</h2>
            <div>
              <Button variant="primary" onClick={handleAddAdminClick} style={{ marginRight: 10 }}>
                Add Admin
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </div>
          </div>

          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Card className="shadow-sm">
            <Card.Body>
              <Table striped bordered responsive>
                <tbody>
                  <tr>
                    <td><strong>First Name</strong></td>
                    <td>{user.firstname}</td>
                  </tr>
                  <tr>
                    <td><strong>Last Name</strong></td>
                    <td>{user.lastname}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Date of Birth</strong></td>
                    <td>{user.dob}</td>
                  </tr>
                  <tr>
                    <td><strong>Contact Number</strong></td>
                    <td>{user.contactno}</td>
                  </tr>
                  <tr>
                    <td><strong>Place</strong></td>
                    <td>{user.place}</td>
                  </tr>
                  <tr>
                    <td><strong>City</strong></td>
                    <td>{user.city}</td>
                  </tr>
                  <tr>
                    <td><strong>State</strong></td>
                    <td>{user.state}</td>
                  </tr>
                  <tr>
                    <td><strong>Pincode</strong></td>
                    <td>{user.pincode}</td>
                  </tr>
                  <tr>
                    <td><strong>Gender</strong></td>
                    <td>{user.gender}</td>
                  </tr>
                  <tr>
                    <td><strong>Account Created</strong></td>
                    <td>{new Date(user.account_created_at).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Role</strong></td>
                    <td>{user.role}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>{user.status}</td>
                  </tr>
                </tbody>
              </Table>
              {user.status === 'Pending' && (
                <div className="mt-3">
                  <Button variant="success" onClick={handleAccept} style={{ marginRight: 10 }}>
                    Accept
                  </Button>
                  <Button variant="warning" onClick={handleReject}>
                    Reject
                  </Button>
                </div>
              )}
              {currentUserRole === 'admin' && (
                <Button
                  variant="info"
                  className="mt-3"
                  onClick={handleSendResetLink}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              )}
              <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin')}>
                Back to Admin
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure want to delete this account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { setShowDeleteModal(false); handleDelete(); }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Admin Modal */}
      <Modal show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">Select a user to make them the new admin. The current admin will become a regular user.</p>
          <Form.Group>
            <Form.Label>Select New Admin</Form.Label>
            <Form.Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {Array.isArray(users) && users.map((user, index) => (
                <option key={index} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAdminModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            disabled={!selectedUser}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Admin Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the admin to <strong>{selectedUser}</strong>?
          <br />
          <small className="text-muted">The current admin will become a regular user.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAdminChange}
            disabled={isLoading}
          >
            {isLoading ? 'Changing...' : 'Yes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserDetails;