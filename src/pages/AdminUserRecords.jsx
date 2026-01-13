import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import SideNavbar from '../components/common/SideNavbar';
import { Container, Table, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { LANGUAGES, DEFAULT_LANG } from '../config/Languages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const AdminUserRecords = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [audioTranscriptions, setAudioTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [activeTab, setActiveTab] = useState('text-to-speech');
  const filteredRecords = records.filter(rec =>
    selectedLanguage === 'all' ? true : rec.lang === selectedLanguage
  );

  useEffect(() => {
    // Fetch user role
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setRole(user.role);
        }
      } catch (err) { }
    };
    fetchUser();
  }, []);

  const fetchRecords = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/admin/user-recordings/${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchAudioTranscriptions = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/admin/saved-records?user_email=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAudioTranscriptions(data.records || []);
      })
      .catch(err => {
        console.error('Failed to fetch audio transcriptions:', err);
        setAudioTranscriptions([]);
      });
  };

  useEffect(() => {
    fetchRecords();
    fetchAudioTranscriptions();
    // eslint-disable-next-line
  }, [email]);

  const handleDelete = async (lang, sentence_number) => {
    if (!window.confirm('Are you sure you want to delete and reassign this audio?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/admin/delete-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: email, lang, sentence_number })
    });
    if (res.ok) {
      alert('Audio deleted and reassigned!');
      fetchRecords();
    } else {
      alert('Failed to delete audio.');
    }
  };


  return (
    <>
      <TopNavbar />
      <SideNavbar role={role} />
      <div style={{ marginLeft: 220, overflowX: 'hidden' }}>
        <div className="main-content" style={{ marginTop: '8rem' }}>
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Saved Records for {email}</h2>
            </div>

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'text-to-speech')}
              className="mb-3"
            >
              <Tab eventKey="text-to-speech" title="Text-to-Speech">
                <div className="d-flex justify-content-end align-items-center mb-3">
                  <Form.Select
                    style={{ width: 'auto', minWidth: '150px' }}
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="all">All Languages</option>
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Sl. No</th>
                        <th>Language</th>
                        <th>Audio</th>
                        <th>Subtitle</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.length === 0 ? (
                        <tr><td colSpan={5} className="text-center">
                          {selectedLanguage === 'all'
                            ? 'No recordings found.'
                            : `No recordings found for ${LANGUAGES.find(l => l.value === selectedLanguage)?.label || selectedLanguage}.`
                          }
                        </td></tr>
                      ) : (
                        filteredRecords.map((rec, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{LANGUAGES.find(l => l.value === rec.lang)?.label || rec.lang}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <audio className="custom-audio" style={{ width: '250px' }} controls src={`${API_BASE_URL}${rec.url}`} />
                                <a
                                  href={`${API_BASE_URL}${rec.url}`}
                                  download
                                  style={{ marginLeft: 12, color: '#1976d2', fontSize: 20, verticalAlign: 'middle', marginBottom: 6 }}
                                  title="Download audio"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <FaDownload />
                                </a>
                              </div>
                            </td>
                            <td>{rec.subtitle || ''}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDelete(rec.lang, rec.sentence_number)}>
                                Delete & Reassign
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Tab>

              <Tab eventKey="audio-transcriptions" title="Audio Transcriptions">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sl. No</th>
                      <th>Filename</th>
                      <th>Audio</th>
                      <th>Transcription</th>
                      <th>Language</th>
                      <th>Confirmed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audioTranscriptions.length === 0 ? (
                      <tr><td colSpan={6} className="text-center">
                        No audio transcriptions found.
                      </td></tr>
                    ) : (
                      audioTranscriptions.map((record, idx) => (
                        <tr key={record.id}>
                          <td>{idx + 1}</td>
                          <td>{record.filename}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <audio className="custom-audio" style={{ width: '250px' }} controls src={`${API_BASE_URL}${record.audio_url}`} />
                              <a
                                href={`${API_BASE_URL}${record.audio_url}`}
                                download
                                style={{ marginLeft: 12, color: '#1976d2', fontSize: 20, verticalAlign: 'middle', marginBottom: 6 }}
                                title="Download audio"
                                onClick={e => e.stopPropagation()}
                              >
                                <FaDownload />
                              </a>
                            </div>
                          </td>
                          <td>
                            <div style={{
                              maxWidth: '400px',
                              maxHeight: '100px',
                              overflowY: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}>
                              {record.transcription_text}
                            </div>
                          </td>
                          <td>{record.language || 'Unknown'}</td>
                          <td>{new Date(record.confirmed_at).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AdminUserRecords; 