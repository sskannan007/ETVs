// Admin.jsx
import React, { useState, useEffect } from 'react';
import CustomNavbar from "./navbar";
import SideNavbar from '../components/common/SideNavbar';
import { Container, Card, Button, Table, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DownloadModal from '../components/common/DownloadModal';
import { getLanguageLabel } from '../config/Languages';
import { FaFileAlt, FaVideo } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Admin = () => {
  const navigate = useNavigate();
  const [allRecordings, setAllRecordings] = useState([]);
  const [recordedUsers, setRecordedUsers] = useState([]);
  const [savedRecordsCount, setSavedRecordsCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');


  useEffect(() => {
    const fetchAllRecordings = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/admin/recordings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setAllRecordings(data);
      } catch (err) {
        setAllRecordings([]);
      }
    };
    fetchAllRecordings();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/admin/recorded-users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRecordedUsers(data))
      .catch(() => setRecordedUsers([]));
  }, []);

  // Fetch saved records count
  useEffect(() => {
    const fetchSavedRecordsCount = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/admin/saved-records`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedRecordsCount(data.records?.length || 0);
        }
      } catch (err) {
        console.error('Failed to fetch saved records count:', err);
      }
    };
    fetchSavedRecordsCount();
  }, []);


  const handleRecordsToggle = () => {
    // Navigate to Saved Records page
    navigate('/admin/saved-records');
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };



  const handleRecordedUserClick = (username) => {
    navigate(`/admin/user-records/${encodeURIComponent(username)}`);
  };

  const handleVideoSpeechToTextView = (username) => {
    navigate(`/admin/user-records/${encodeURIComponent(username)}?tab=video-speech-to-text`);
  };

  const handleDownloadVideoSpeechToText = async (email) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/video-records/download-all/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to download video speech-to-text records');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${email.split('@')[0]}_video_speech_to_text_records.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDownload = async (email, language) => {
    const token = localStorage.getItem('token');
    try {
      const emailPrefix = email.split('@')[0];
      const response = await fetch(`${API_BASE_URL}/admin/user-records/download?username=${encodeURIComponent(email)}&language=${language}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${emailPrefix}_${getLanguageLabel(language)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleSendResetLink = async (userEmail) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8000/admin/send-reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Password reset link sent!');
        // Refresh user list to update the button
        const response = await fetch(`${API_BASE_URL}/admin/users/list`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
      } else {
        alert(data.detail || 'Failed to send reset link');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <>
      <div className="d-flex">
        <SideNavbar role="admin" />
        <div className="flex-grow-1" style={{ marginLeft: '250px', minHeight: '100vh' }}>
          <Container className="py-4" style={{ paddingTop: '2rem !important' }}>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Admin;