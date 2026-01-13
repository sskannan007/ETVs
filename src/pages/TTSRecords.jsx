import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../components/common/SideNavbar';
import { Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FaDownload, FaArrowLeft, FaCopy, FaTrashAlt } from 'react-icons/fa';
import './registeration.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
const resolveMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

const TTSRecords = () => {
  const navigate = useNavigate();
  const [ttsRecords, setTtsRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('all');
  const [userEmails, setUserEmails] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    // Fetch user role
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(buildApiUrl('/users/me'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setRole(user.role);
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  // Fetch unique user emails from TTS records
  useEffect(() => {
    const fetchUserEmails = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(buildApiUrl('/tts/admin/records'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const emails = [...new Set(data.records?.map(r => r.user_email) || [])];
          setUserEmails(emails);
        }
      } catch (err) {
        console.error('Failed to fetch user emails:', err);
      }
    };
    fetchUserEmails();
  }, []);

  const fetchTtsRecords = () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const token = localStorage.getItem('token');
    const url = selectedUserEmail === 'all' 
      ? buildApiUrl('/tts/admin/records')
      : buildApiUrl(`/tts/admin/records?user_email=${encodeURIComponent(selectedUserEmail)}`);
    
    console.log('Fetching TTS records from:', url);
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setTtsRecords(data.records || []);
        setLoading(false);
        if (!data.records || data.records.length === 0) {
          console.log('No TTS records found in response');
        } else {
          console.log(`Found ${data.records.length} TTS records`);
        }
      })
      .catch(err => {
        console.error('Failed to fetch TTS records:', err);
        setErrorMsg(`Failed to fetch TTS records: ${err.message}`);
        setTtsRecords([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTtsRecords();
  }, [selectedUserEmail]);

  // Auto-dismiss messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleDownload = async (record) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/tts/admin/records/${record.id}/download`), {
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
      const baseName = record?.source_filename
        ? record.source_filename.replace(/\.[^/.]+$/, '')
        : 'tts_audio';
      const extension = record?.audio_format || 'wav';
      a.download = `${baseName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setSuccessMsg('Audio downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      setErrorMsg('Failed to download audio. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedUserEmail === 'all'
        ? buildApiUrl('/tts/admin/records/download-all')
        : buildApiUrl(`/tts/admin/records/download-all?user_email=${encodeURIComponent(selectedUserEmail)}`);
      
      const response = await fetch(url, {
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
      const filename = selectedUserEmail === 'all' 
        ? 'all_tts_records.zip'
        : `${selectedUserEmail.split('@')[0]}_tts_records.zip`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setSuccessMsg('All TTS records downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      setErrorMsg('Failed to download TTS records. Please try again.');
    }
  };

  const handleDeleteOrReassign = async (record) => {
    const isManual = record?.from_manual_input;
    const actionLabel = isManual ? 'delete this generated speech permanently' : 'reassign this upload for processing again';
    if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = isManual
        ? buildApiUrl(`/tts/admin/records/${record.id}`)
        : buildApiUrl(`/tts/admin/records/${record.id}/reassign`);
      const response = await fetch(endpoint, {
        method: isManual ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(isManual ? {} : { 'Content-Type': 'application/json' })
        }
      });

      if (response.ok) {
        setSuccessMsg(
          isManual
            ? 'TTS record deleted successfully.'
            : 'Record deleted and upload reassigned to the queue.'
        );
        fetchTtsRecords();
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMsg(data.detail || 'Unable to complete the requested action.');
      }
    } catch (error) {
      console.error('Record action error:', error);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const filteredRecords = ttsRecords;

  return (
    <>
      <div className="d-flex">
        <SideNavbar role={role} />
        <div
          className="flex-grow-1"
          style={{
            marginLeft: '250px',
            minHeight: '100vh',
            width: 'calc(100% - 250px)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="py-3 px-5 flex-grow-1 d-flex flex-column">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Button
                    variant="link"
                    onClick={() => navigate('/tts-home')}
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      border: '1px solid #ffffff',
                    }}
                  >
                    <FaArrowLeft size={18} />
                    <span>Back</span>
                  </Button>
                  <h3 className="fw-bold">
                    Saved TTS Records
                  </h3>
                </div>
                <p className="pt-2 mb-0 text-light opacity-75">
                  Review generated speech outputs, download audio archives, or trigger regeneration with updated voices.
                </p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Form.Select
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                  style={{
                    width: '220px',
                    borderRadius: '12px',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }}
                >
                  <option value="all">All Users</option>
                  {userEmails.map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </Form.Select>
                <Button
                  className="px-4"
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #38bdf8, #2563eb)',
                    border: 'none'
                  }}
                  onClick={handleDownloadAll}
                >
                  <FaDownload className="me-2" />
                  Download All
                </Button>
              </div>
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 25px 60px rgba(15,23,42,0.3)',
                border: '1px solid rgba(15,23,42,0.08)',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {successMsg && (
                <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible>
                  {successMsg}
                </Alert>
              )}
              {errorMsg && (
                <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>
                  {errorMsg}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading TTS records...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No TTS records found.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table hover responsive className="align-middle">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th>S.No</th>
                        <th>User Email</th>
                        <th>Text</th>
                        <th>Language</th>
                        <th>Audio</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record, idx) => (
                        <tr key={record.id}>
                          <td>{idx + 1}</td>
                          <td className="fw-semibold">{record.user_email}</td>
                          <td>
                            {record.text ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    maxWidth: '250px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {record.text.length > 70
                                    ? `${record.text.substring(0, 70)}...`
                                    : record.text}
                                </span>
                                {record.text.length > 70 && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    style={{ padding: 0, fontSize: '12px' }}
                                    onClick={() => {
                                      setSelectedText(record.text);
                                      setSelectedRecord(record);
                                      setShowTextModal(true);
                                    }}
                                  >
                                    More
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted fst-italic">N/A</span>
                            )}
                          </td>
                          <td>{record.language || 'Unknown'}</td>
                          <td>
                            {record.audio_url && (
                              <audio
                                className="custom-audio"
                                controls
                                src={resolveMediaUrl(record.audio_url)}
                                style={{ width: '200px', height: '32px' }}
                                controlsList="nodownload"
                              />
                            )}
                          </td>
                          <td>{record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleDownload(record)}
                                title="Download Audio"
                              >
                                <FaDownload />
                              </Button>
                          <Button
                            variant={record.from_manual_input ? 'outline-danger' : 'outline-warning'}
                            size="sm"
                            onClick={() => handleDeleteOrReassign(record)}
                            title={record.from_manual_input ? 'Delete this manual entry' : 'Reassign this upload'}
                          >
                            <FaTrashAlt />
                          </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showTextModal} onHide={() => setShowTextModal(false)} size="lg" centered>
        <Modal.Header style={{ justifyContent: 'space-between' }}>
          <Modal.Title>Full Text</Modal.Title>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(selectedText);
                  setSuccessMsg('Text copied to clipboard!');
                  setTimeout(() => setSuccessMsg(''), 3000);
                } catch (err) {
                  setErrorMsg('Failed to copy to clipboard. Please try again.');
                  setTimeout(() => setErrorMsg(''), 3000);
                }
              }}
              title="Copy to Clipboard"
            >
              <FaCopy />
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => {
                if (selectedRecord) {
                  handleDownload(selectedRecord);
                }
              }}
              title="Download Audio"
            >
              <FaDownload />
            </Button>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowTextModal(false)}
              aria-label="Close"
            ></button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              maxHeight: '400px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {selectedText || 'No text available'}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TTSRecords;
