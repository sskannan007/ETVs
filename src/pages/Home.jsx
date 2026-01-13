import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../components/common/SideNavbar';
import { Button, Alert, Table, Dropdown, Modal, Form, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaFilter, FaFolderOpen, FaLanguage, FaArrowRight, FaEllipsisV, FaFile, FaCheckCircle, FaCheckDouble, FaUpload, FaHistory, FaSearch } from 'react-icons/fa';
import './registeration.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const resolveMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

const isVideoSource = (url) => {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return ['.mp4', '.mov', '.webm', '.mkv', '.avi'].some(ext => normalized.includes(ext));
};
import './registeration.scss';

// CSS to hide volume control and other unnecessary controls in table media players only
const mediaStyle = `
  .audio-player::-webkit-media-controls-volume-slider {
    display: none !important;
  }
  .audio-player::-webkit-media-controls-mute-button {
    display: none !important;
  }
  .audio-player::-webkit-media-controls-timeline {
    max-width: 100px !important;
  }
  .audio-player::-webkit-media-controls-panel {
    width: 150px !important;
    overflow: hidden !important;
  }
  .audio-player::-webkit-media-controls-current-time-display,
  .audio-player::-webkit-media-controls-time-remaining-display {
    display: none !important;
  }
  .audio-player::-webkit-media-controls-enclosure {
    overflow: hidden !important;
    width: 150px !important;
  }
  .video-player::-webkit-media-controls-volume-slider {
    display: none !important;
  }
  .video-player::-webkit-media-controls-mute-button {
    display: none !important;
  }
  .video-player::-webkit-media-controls-timeline {
    max-width: 100px !important;
  }
  .video-player::-webkit-media-controls-panel {
    width: 150px !important;
    overflow: hidden !important;
  }
  .video-player::-webkit-media-controls-current-time-display,
  .video-player::-webkit-media-controls-time-remaining-display {
    display: none !important;
  }
  .video-player::-webkit-media-controls-enclosure {
    overflow: hidden !important;
    width: 150px !important;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const baseStatusBadgeStyle = {
  borderRadius: '4px',
  padding: '4px 8px',
  fontWeight: 600,
  display: 'inline-block',
  opacity: 1,
  textTransform: 'capitalize',
  fontSize: '14px'
};

const statusPalette = {
  completed: { color: '#007852', background: '#E4FFF1' },
  uploaded: { color: '#F2F3F7', background: '#C5C5C5' },
  processing: { color: '#786000', background: '#FFF9CF' }
};

const getStatusBadgeStyle = (status = '') => {
  const normalized = status.toLowerCase();
  const palette = statusPalette[normalized];
  if (palette) {
    return { ...baseStatusBadgeStyle, ...palette };
  }
  return {
    ...baseStatusBadgeStyle,
    background: '#E2E8F0',
    color: '#475569'
  };
};

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [role, setRole] = useState(null);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [selectedTranscription, setSelectedTranscription] = useState('');
  const [showFileDetailsModal, setShowFileDetailsModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setUserName(`${user.firstname} ${user.lastname}`);
          setUserEmail(user.email);
          setRole(user.role);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  // Fetch uploaded audio files
  useEffect(() => {
    let isMounted = true;
    let fetchTimeout = null;

    const fetchUploadedFiles = async (isInitialLoad = false) => {
      if (!userEmail || !isMounted) return;

      if (isInitialLoad) {
        setLoading(true);
      }

      try {
        const token = localStorage.getItem('token');
        const audioRes = await fetch(`${API_BASE_URL}/user/uploaded-audio-files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!isMounted) return;

        if (audioRes.ok) {
          const audioData = await audioRes.json();
          const newFiles = audioData.files || [];

          setUploadedAudioFiles(prevFiles => {
            if (prevFiles.length !== newFiles.length) {
              return newFiles;
            }

            const prevMap = new Map(prevFiles.map(f => [f.id, f]));
            const newMap = new Map(newFiles.map(f => [f.id, f]));

            if (prevMap.size !== newMap.size) {
              return newFiles;
            }

            for (const [id, newFile] of newMap) {
              const prevFile = prevMap.get(id);
              if (!prevFile) {
                return newFiles;
              }

              if (
                prevFile.filename !== newFile.filename ||
                prevFile.extracted_text !== newFile.extracted_text ||
                prevFile.confirmed !== newFile.confirmed ||
                prevFile.status !== newFile.status ||
                prevFile.audio_url !== newFile.audio_url
              ) {
                return newFiles;
              }
            }

            return prevFiles;
          });
        } else {
          console.error('Failed to fetch uploaded audio files:', audioRes.status);
          if (isInitialLoad && isMounted) {
            setUploadedAudioFiles([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch uploaded audio files:', err);
        if (isInitialLoad && isMounted) {
          setUploadedAudioFiles([]);
        }
      } finally {
        if (isInitialLoad && isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUploadedFiles(true);

    const scheduleRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchTimeout = setTimeout(() => {
          if (isMounted && document.visibilityState === 'visible') {
            fetchUploadedFiles(false);
            scheduleRefresh();
          }
        }, 60000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        fetchUploadedFiles(false);
        scheduleRefresh();
      } else if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    scheduleRefresh();

    return () => {
      isMounted = false;
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userEmail]);

  const formattedAudioFiles = React.useMemo(() => {
    return uploadedAudioFiles.map((file) => ({
      id: `upload_${file.id}`,
      filename: file.filename,
      audio_url: file.audio_url,
      confirmed: file.confirmed || false,
      uploaded_at: file.uploaded_at,
      file_id: file.id,
      extracted_text: file.extracted_text || null,
      status: file.status
    }));
  }, [uploadedAudioFiles]);

  const totalFiles = formattedAudioFiles.length;
  const confirmedCount = formattedAudioFiles.filter(file => file.confirmed).length;
  const extractedCount = formattedAudioFiles.filter(file => file.extracted_text && !file.confirmed).length;

  const handleAudioFileSelect = (file) => {
    if (selectedAudioFile && selectedAudioFile.file_id === file.file_id) {
      setSelectedAudioFile(null);
      setExtractedText('');
      setShowFileDetailsModal(false);
    } else {
      setSelectedAudioFile(file);
      setExtractedText(file.extracted_text || '');
      setSubmitSuccess(null);
      setErrorMsg('');
      setShowFileDetailsModal(true);
    }
  };

  const handleExtractTranscription = async () => {
    if (!selectedAudioFile) return;

    setIsExtracting(true);
    setErrorMsg('');
    setSubmitSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/user/extract-audio-transcription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_id: selectedAudioFile.file_id,
          language: selectedLanguage
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedText(data.transcription || '');
        setSubmitSuccess('Transcription extracted successfully!');

        const audioRes = await fetch(`${API_BASE_URL}/user/uploaded-audio-files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (audioRes.ok) {
          const audioData = await audioRes.json();
          const newFiles = audioData.files || [];

          setUploadedAudioFiles(prevFiles => {
            const updatedFile = newFiles.find(f => f.id === selectedAudioFile.file_id);
            if (!updatedFile) return prevFiles;

            const prevFile = prevFiles.find(f => f.id === selectedAudioFile.file_id);
            if (prevFile &&
              prevFile.extracted_text === updatedFile.extracted_text &&
              prevFile.confirmed === updatedFile.confirmed &&
              prevFile.status === updatedFile.status) {
              return prevFiles;
            }

            return prevFiles.map(f =>
              f.id === selectedAudioFile.file_id ? updatedFile : f
            );
          });

          const updatedFile = newFiles.find(f => f.id === selectedAudioFile.file_id);
          if (updatedFile) {
            setSelectedAudioFile({
              ...selectedAudioFile,
              extracted_text: updatedFile.extracted_text,
              confirmed: updatedFile.confirmed
            });
            setExtractedText(updatedFile.extracted_text || '');
          }
        }
      } else {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { detail: `Server error: ${res.status} ${res.statusText}` };
        }
        console.error('Extract transcription error:', errorData);

        let errorMessage = 'Failed to extract transcription';
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        setErrorMsg(errorMessage);
      }
    } catch (err) {
      console.error('Extract transcription exception:', err);
      setErrorMsg('Failed to extract transcription: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmTranscription = async (fileId) => {
    if (!window.confirm('Confirm and save this transcription to Saved Records?')) return;

    setErrorMsg('');
    setSubmitSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/user/confirm-audio-transcription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_id: fileId,
          language: selectedLanguage || 'unknown'
        })
      });

      if (res.ok) {
        setSubmitSuccess('Transcription confirmed and saved to Saved Records!');

        setTimeout(() => {
          setShowFileDetailsModal(false);
          setSelectedAudioFile(null);
          setExtractedText('');
        }, 2000);

        const audioRes = await fetch(`${API_BASE_URL}/user/uploaded-audio-files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (audioRes.ok) {
          const audioData = await audioRes.json();
          const newFiles = audioData.files || [];

          setUploadedAudioFiles(prevFiles => {
            const updatedFile = newFiles.find(f => f.id === fileId);
            if (!updatedFile) return prevFiles;

            const prevFile = prevFiles.find(f => f.id === fileId);
            if (prevFile && prevFile.confirmed === updatedFile.confirmed) {
              return prevFiles;
            }

            return prevFiles.map(f =>
              f.id === fileId ? updatedFile : f
            );
          });

          if (selectedAudioFile && selectedAudioFile.file_id === fileId) {
            const updatedFile = newFiles.find(f => f.id === fileId);
            if (updatedFile) {
              setSelectedAudioFile({
                ...selectedAudioFile,
                confirmed: updatedFile.confirmed
              });
            }
          }
        }
      } else {
        const error = await res.json().catch(() => ({ detail: 'Failed to confirm transcription' }));
        setErrorMsg(error.detail || 'Failed to confirm transcription');
      }
    } catch (err) {
      setErrorMsg('Failed to confirm transcription: ' + err.message);
    }
  };

  useEffect(() => {
    if (selectedAudioFile && selectedAudioFile.extracted_text) {
      setExtractedText(selectedAudioFile.extracted_text);
    } else if (!selectedAudioFile) {
      setExtractedText('');
    }
  }, [selectedAudioFile]);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const filteredItems = formattedAudioFiles.filter(file => {
    // Apply status filter
    let matchesFilter = true;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'pending') matchesFilter = !file.extracted_text && !file.confirmed;
    else if (filter === 'extracted') matchesFilter = file.extracted_text && !file.confirmed;
    else if (filter === 'confirmed') matchesFilter = file.confirmed;

    // Apply search filter (filename only)
    const matchesSearch = searchQuery.trim() === '' ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'extracted', label: 'Extracted' },
    { value: 'confirmed', label: 'Confirmed' }
  ];

  return (
    <>
      <style>{mediaStyle}</style>
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
            {/* <div>
                <h2 className="fw-bold mb-3" style={{ lineHeight: 1.2 }}>
                  Speech-to-text
                </h2>
                <p className="text-light opacity-75 mb-0">
                  Upload, transcribe, and confirm audio files with a polished review flow.
                </p>
              </div> */}
            <Row className="align-items-center g-4 mb-4">
              <Col xl={12} lg={12} md={12}>
                <div className="d-flex align-items-center gap-3 flex-nowrap" style={{ overflowX: 'auto' }}>
                  {[
                    { label: 'Total Files', value: totalFiles, icon: FaFile, iconColor: '#60a5fa' },
                    { label: 'Extracted', value: extractedCount, icon: FaCheckCircle, iconColor: '#a78bfa' },
                    { label: 'Confirmed', value: confirmedCount, icon: FaCheckDouble, iconColor: '#34d399' }
                  ].map((stat, idx) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.label} style={{ flex: '0 0 auto', minWidth: '200px' }}>
                        <Card
                          className="h-100"
                          style={{
                            border: 'none',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.09)',
                            backdropFilter: 'blur(12px)',
                            color: '#fff',
                          }}
                        >
                          <Card.Body className="d-flex align-items-center p-3">
                            <div
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '47px',
                                height: '47px',
                                borderRadius: '50%',
                                background: '#fff',
                                flexShrink: 0
                              }}
                            >
                              <IconComponent size={24} style={{ color: stat.iconColor }} />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold mb-0" style={{ fontSize: '1.75rem', lineHeight: 1.2 }}>
                                {String(stat.value).padStart(2, '0')}
                              </div>
                              <div className="text-light opacity-75" style={{ fontSize: '0.875rem', marginTop: '2px' }}>
                                {stat.label}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    );
                  })}
                  <div className="d-flex align-items-center gap-2" style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
                    <Button
                      variant="outline-light"
                      className="d-flex align-items-center justify-content-center gap-2"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'transparent',
                        padding: '12px 16px',
                        fontWeight: 500,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        color: '#fff'
                      }}
                      onClick={() => navigate('/bulk-upload')}
                    >
                      <FaUpload size={18} style={{ color: '#fff' }} />
                      Bulk Upload
                    </Button>
                    <Button
                      variant="light"
                      className="d-flex align-items-center justify-content-center gap-2"
                      style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: '#fff',
                        color: '#0f172a',
                        padding: '12px 16px',
                        fontWeight: 500,
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => navigate('/admin/saved-records')}
                    >
                      <FaHistory size={18} />
                      History
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            <div
              style={{
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '24px',
                border: '1px solid rgba(15,23,42,0.08)',
                boxShadow: '0 30px 80px rgba(15,23,42,0.25)',
                padding: '1rem',
                color: '#0f172a',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Dropdown>
                    <Dropdown.Toggle
                      className='filter-dropdown-button'
                      variant="outline-secondary"
                      size="sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, borderRadius: '6px', color: '#1e1b4b', borderColor: '#1e1b4b' }}
                      id="filter-dropdown"
                    >
                      <FaFilter style={{ marginRight: 4 }} /> Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {filterOptions.map(opt => (
                        <Dropdown.Item
                          key={opt.value}
                          active={filter === opt.value}
                          onClick={() => setFilter(opt.value)}
                        >
                          {opt.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <div style={{ position: 'relative', minWidth: '250px' }}>
                    <FaSearch
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Search by filename..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        paddingLeft: '38px',
                        borderRadius: '6px',
                        borderColor: '#1e1b4b',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(15,23,42,0.05)', height: 'calc(100vh - 15rem)', overflow: 'hidden' }}>
                <div style={{ overflowY: 'auto', height: '100%' }}>
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 mb-0 text-muted">Fetching your uploads…</p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center p-5">
                      <h5 className="fw-semibold text-dark mb-2">No audio files yet</h5>
                      <p className="text-muted mb-3">Start by uploading audio through the ASR Bulk Upload page.</p>
                      <Button variant="primary" onClick={() => window.open('/bulk-upload', '_self')}>
                        Go to Bulk Upload
                      </Button>
                    </div>
                  ) : (
                    <>
                      {submitSuccess && (
                        <Alert variant="success" onClose={() => setSubmitSuccess(null)} dismissible>
                          {submitSuccess}
                        </Alert>
                      )}
                      {errorMsg && (
                        <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>
                          {errorMsg}
                        </Alert>
                      )}
                      <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                          <thead style={{ background: '#f8fafc' }}>
                            <tr>
                              <th style={{ width: '60px' }}>S.No</th>
                              <th>Filename</th>
                              <th>Status</th>
                              <th>Extracted Text</th>
                              <th>Confirmed</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.map((file, idx) => (
                              <tr key={file.id}>
                                <td>{idx + 1}</td>
                                <td className="fw-semibold">{file.filename}</td>
                                <td>
                                  <span style={getStatusBadgeStyle(file.status || '')}>
                                    {file.status || 'unknown'}
                                  </span>
                                </td>
                                <td style={{ maxWidth: 250 }}>
                                  {file.extracted_text ? (
                                    <div className="d-flex align-items-center gap-2">
                                      <div className={file.extracted_text.length > 40 ? "text-truncate flex-grow-1" : "flex-grow-1"} style={{ minWidth: 0 }}>{file.extracted_text}</div>
                                      {file.extracted_text.length > 40 && (
                                        <Button
                                          variant="link"
                                          size="sm"
                                          className="ps-0 flex-shrink-0"
                                          style={{ whiteSpace: 'nowrap' }}
                                          onClick={() => {
                                            setSelectedTranscription(file.extracted_text);
                                            setShowTranscriptionModal(true);
                                          }}
                                        >
                                          View
                                        </Button>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted">Not extracted</span>
                                  )}
                                </td>
                                <td className="text-center">{file.confirmed ? 'Yes' : 'No'}</td>
                                <td>
                                  <div className="d-flex justify-content-center action-dropdown">
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="link"
                                        id={`dropdown-${file.id}`}
                                        style={{
                                          border: 'none',
                                          padding: '4px 8px',
                                          color: '#6c757d',
                                          textDecoration: 'none',
                                          background: 'transparent'
                                        }}
                                      >
                                        <FaEllipsisV size={18} />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu align="end">
                                        <Dropdown.Item
                                          onClick={() => handleAudioFileSelect(file)}
                                        >
                                          Extract
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() => {
                                            setSelectedAudioFile(file);
                                            setSelectedTranscription(file.extracted_text || '');
                                            setShowTranscriptionModal(true);
                                          }}
                                          disabled={!file.extracted_text}
                                        >
                                          Transcript
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showFileDetailsModal} onHide={() => setShowFileDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedAudioFile ? selectedAudioFile.filename : 'File Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAudioFile ? (
            <>
              <Row className="g-3">
                <Col md={6}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <p className="text-uppercase mb-1 text-muted" style={{ letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                          File Overview
                        </p>
                        <div className="fw-semibold text-truncate" title={selectedAudioFile.filename}>
                          {selectedAudioFile.filename}
                        </div>
                      </div>
                      <span style={{ ...getStatusBadgeStyle(selectedAudioFile.status || ''), fontSize: '12px', padding: '4px 10px' }}>
                        {selectedAudioFile.status || 'unknown'}
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                      <div>
                        <strong className="text-dark">Uploaded:</strong> {selectedAudioFile.uploaded_at || 'n/a'}
                      </div>
                      <div>
                        <strong className="text-dark">Duration:</strong> {selectedAudioFile.duration || '—'}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Form.Label className="fw-semibold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Transcription Language</Form.Label>
                      <Form.Select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        disabled={isExtracting || selectedAudioFile.confirmed || !!selectedAudioFile.extracted_text}
                        style={{ maxWidth: '200px', fontSize: '0.85rem', padding: '4px 8px' }}
                      >
                        <option value="">Select Language</option>
                        <option value="english">🇺🇸 English</option>
                        <option value="hindi">🇮🇳 Hindi</option>
                        <option value="telugu">🇮🇳 Telugu</option>
                      </Form.Select>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', minHeight: '192px' }}>
                    <p className="text-uppercase mb-2 text-muted" style={{ letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                      Preview
                    </p>
                    {selectedAudioFile.audio_url ? (
                      isVideoSource(resolveMediaUrl(selectedAudioFile.audio_url)) ? (
                        <video
                          controls
                          className="video-player w-100"
                          style={{ borderRadius: '10px', maxHeight: '160px' }}
                          src={resolveMediaUrl(selectedAudioFile.audio_url)}
                        />
                      ) : (
                        <audio
                          controls
                          className="custom-audio audio-player w-100"
                          src={resolveMediaUrl(selectedAudioFile.audio_url)}
                        />
                      )
                    ) : (
                      <div className="text-muted">No media preview available.</div>
                    )}
                  </div>
                </Col>
              </Row>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginTop: '12px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <p className="text-uppercase mb-0 text-muted" style={{ letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                    Extracted Transcription
                  </p>
                  {!selectedAudioFile?.confirmed && (
                    <Button variant="link" size="sm" onClick={() => setExtractedText('')} disabled={!extractedText}>
                      Clear
                    </Button>
                  )}
                </div>
                <Form.Control
                  className='extracted-transcription-textarea'
                  as="textarea"
                  rows={3}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  style={{ background: '#f8fafc', borderRadius: '10px', borderColor: '#e2e8f0', fontSize: '0.9rem' }}
                />
              </div>
              <div className="d-flex gap-2 justify-content-end mt-3">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="extract-tooltip">
                      {!selectedLanguage ? 'Choose the language first' : ''}
                    </Tooltip>
                  }
                  show={!selectedLanguage && !isExtracting ? undefined : false}
                >
                  <span className="d-inline-block">
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-4"
                      onClick={handleExtractTranscription}
                      disabled={isExtracting || !selectedLanguage}
                      style={!selectedLanguage || isExtracting ? { pointerEvents: 'none' } : {}}
                    >
                      {isExtracting ? 'Extracting…' : 'Extract'}
                    </Button>
                  </span>
                </OverlayTrigger>
                <Button
                  variant="success"
                  size="sm"
                  className="px-4"
                  onClick={() => selectedAudioFile && handleConfirmTranscription(selectedAudioFile.file_id)}
                  disabled={!selectedAudioFile || selectedAudioFile.confirmed}
                >
                  {selectedAudioFile?.confirmed ? 'Confirmed' : 'Confirm & Save'}
                </Button>
              </div>
            </>
          ) : (
            <p className="mb-0 text-muted">Select a file to view its details.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showTranscriptionModal} onHide={() => setShowTranscriptionModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Transcription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              maxHeight: '60vh',
              overflowY: 'auto',
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
          >
            {selectedTranscription || 'No transcription available.'}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTranscriptionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;