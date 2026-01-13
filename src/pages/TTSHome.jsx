import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../components/common/SideNavbar';
import { Container, Table, Button, Form, Alert, Modal, Row, Col, Card } from 'react-bootstrap';
import { FaTable, FaEraser, FaUpload, FaHistory, FaSearch } from 'react-icons/fa';
import './registeration.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const resolveMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

const availableLanguages = [
  { code: 'English', label: 'English', value: 'en-IN' },
  { code: 'Hindi', label: 'Hindi', value: 'hi-IN' },
  { code: 'Telugu', label: 'Telugu', value: 'te-IN' }
];

const voiceOptions = {
  Female: ['anushka', 'manisha', 'vidya', 'arya'],
  Male: ['abhilash', 'karun', 'hitesh']
};

const TTSHome = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [selectedUploads, setSelectedUploads] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isTextLocked, setIsTextLocked] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [textError, setTextError] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [ttsSettings, setTtsSettings] = useState({
    language: 'English',
    gender: 'Female',
    speaker: 'anushka',
    pitch: 0.4,
    pace: 0.95,
    loudness: 1.0,
    audio_format: 'wav'
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRole(null);
        setLoadingUser(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setRole(user.role);
        } else {
          setRole(null);
        }
      } catch (err) {
        setRole(null);
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  const fetchUploads = async () => {
    setUploadsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/tts/uploads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUploads(data.uploads || []);
      }
    } catch (err) {
      setErrorMsg('Network error while fetching uploads.');
    }
    setUploadsLoading(false);
  };

  useEffect(() => {
    if (role) {
      fetchUploads();
    }
  }, [role]);

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

  const handleTextChange = (value) => {
    if (isTextLocked) return;
    setTextInput(value);
    setTextError('');
  };

  const handleResetText = () => {
    setTextInput('');
    setSelectedUpload(null);
    setSelectedUploads([]);
    setIsTextLocked(false);
    setGeneratedAudio(null);
    setTextError('');
  };

  const handleUploadSelection = (upload) => {
    setSelectedUpload(upload);
    setTextInput(upload.text_content);
    setIsTextLocked(true);
    setSelectedUploads([upload.id]);
    setGeneratedAudio(null);
    setShowTableModal(false);
  };

  const prepareTextUpload = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required.');
    const trimmed = textInput.trim();
    if (!trimmed) {
      setTextError('Please enter text before generating audio.');
      throw new Error('Text is required.');
    }

    if (isTextLocked && selectedUpload) {
      return selectedUpload.id;
    }

    const formData = new FormData();
    const filename = `typed_text_${Date.now()}.txt`;
    const file = new File([trimmed], filename, { type: 'text/plain' });
    formData.append('file', file);
    formData.append('language', ttsSettings.language);

    const uploadRes = await fetch(`${API_BASE_URL}/tts/upload-text`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to upload text.');
    }

    const data = await uploadRes.json();
    const newUpload = {
      id: data.id,
      filename: data.filename || filename,
      text_content: trimmed,
      language: ttsSettings.language,
      uploaded_at: new Date().toISOString(),
      status: 'uploaded'
    };

    setSelectedUpload(newUpload);
    setSelectedUploads([data.id]);
    setIsTextLocked(true);
    setUploads(prev => [newUpload, ...prev]);
    return data.id;
  };

  const selectUploadsOnServer = async (uploadIds, token) => {
    const selectRes = await fetch(`${API_BASE_URL}/tts/select-uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: uploadIds })
    });

    if (!selectRes.ok) {
      const errorData = await selectRes.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to select uploads.');
    }
  };

  const generatePreviewOnServer = async (token) => {
    const formData = new FormData();
    Object.keys(ttsSettings).forEach(key => formData.append(key, ttsSettings[key]));
    formData.append('text', textInput); // Add the text content

    const generateRes = await fetch(`${API_BASE_URL}/tts/generate-preview`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!generateRes.ok) {
      const errorData = await generateRes.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate audio.');
    }

    return await generateRes.json();
  };

  const handleGenerateAudio = async () => {
    setGenerating(true);
    setErrorMsg('');
    setSuccessMsg('');
    setGeneratedAudio(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Authentication required. Please log in again.');
        return;
      }

      const uploadId = await prepareTextUpload();
      await selectUploadsOnServer([uploadId], token);
      const previewData = await generatePreviewOnServer(token);
      setGeneratedAudio(previewData);
      setShowPreviewModal(true);
      setSuccessMsg(`Generated ${previewData.generated_count} audio file(s). Review below and confirm.`);
    } catch (err) {
      if (err.message !== 'Text is required.') {
        setErrorMsg(err.message || 'Unable to generate audio. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmAndStore = async () => {
    if (!generatedAudio) {
      setErrorMsg('Please generate audio before confirming.');
      return;
    }
    if (!selectedUploads.length) {
      setErrorMsg('No upload selected.');
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('token');

    try {
      const confirmRes = await fetch(`${API_BASE_URL}/tts/confirm-and-store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          upload_ids: selectedUploads,
          generated_audio: generatedAudio
        })
      });

      if (confirmRes.ok) {
        const data = await confirmRes.json();
        setSuccessMsg(`Stored ${data.stored_count} record(s) in TTS Records.`);
        setGeneratedAudio(null);
        setShowPreviewModal(false);
        handleResetText();
        fetchUploads();
        // Navigate to history page
        navigate('/admin/tts-records');
      } else {
        const errorData = await confirmRes.json();
        setErrorMsg(errorData.detail || 'Failed to store records.');
      }
    } catch (err) {
      setErrorMsg('Network error during storage.');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingUser) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="d-flex">
      <SideNavbar role={role} />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: '250px',
          minHeight: '100vh',
          width: 'calc(100% - 250px)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="py-3 px-5 flex-grow-1 d-flex flex-column">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-2" style={{ lineHeight: 1.2 }}>
                Text-to-Speech
              </h2>
              <p className="text-light opacity-75 mb-0">
                Configure voices, type or import scripts, preview audio, and confirm outputs into TTS Records.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-3">
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
                onClick={() => navigate('/TTSUpload')}
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
                onClick={() => navigate('/admin/tts-records')}
              >
                <FaHistory size={18} />
                History
              </Button>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 30px 80px rgba(15,23,42,0.35)',
              color: '#0f172a',
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

            <Row className="g-4 align-items-stretch">
              <Col xl={5} lg={5} md={12} className="d-flex">
                <Card
                  className="h-100 w-100"
                  style={{
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 15px 45px rgba(15,23,42,0.15)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Card.Header className="fw-bold bg-white border-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    TTS Settings
                  </Card.Header>
                  <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Form style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Row className="g-3 mb-3">
                        <Col xs={12} sm={6}>
                          <Form.Label>Language</Form.Label>
                          <Form.Select
                            value={ttsSettings.language}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, language: e.target.value })}
                          >
                            {availableLanguages.map(lang => (
                              <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            value={ttsSettings.gender}
                            onChange={(e) => {
                              const newGender = e.target.value;
                              setTtsSettings({
                                ...ttsSettings,
                                gender: newGender,
                                speaker: voiceOptions[newGender][0]
                              });
                            }}
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="g-3 mb-3">
                        <Col xs={12} sm={6}>
                          <Form.Label>Voice</Form.Label>
                          <Form.Select
                            value={ttsSettings.speaker}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, speaker: e.target.value })}
                          >
                            {voiceOptions[ttsSettings.gender].map(voice => (
                              <option key={voice} value={voice}>{voice}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Label>Audio Format</Form.Label>
                          <Form.Select
                            value={ttsSettings.audio_format}
                            onChange={(e) => setTtsSettings({ ...ttsSettings, audio_format: e.target.value })}
                          >
                            <option value="wav">WAV</option>
                            <option value="mp3">MP3</option>
                          </Form.Select>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Pitch: {ttsSettings.pitch}</Form.Label>
                        <Form.Range
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={ttsSettings.pitch}
                          onChange={(e) => setTtsSettings({ ...ttsSettings, pitch: parseFloat(e.target.value) })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Pace: {ttsSettings.pace}</Form.Label>
                        <Form.Range
                          min="0.5"
                          max="1.5"
                          step="0.05"
                          value={ttsSettings.pace}
                          onChange={(e) => setTtsSettings({ ...ttsSettings, pace: parseFloat(e.target.value) })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-0">
                        <Form.Label>Loudness: {ttsSettings.loudness}</Form.Label>
                        <Form.Range
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={ttsSettings.loudness}
                          onChange={(e) => setTtsSettings({ ...ttsSettings, loudness: parseFloat(e.target.value) })}
                        />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={7} lg={7} md={12} className="d-flex">
                <Card
                  className="h-100 w-100"
                  style={{
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 15px 45px rgba(15,23,42,0.12)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Card.Header className="fw-bold bg-white border-0 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h4>Text to Speech</h4>
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        className="px-2 py-2 uploaded-file-btn"
                        style={{
                          borderRadius: '8px',
                          fontWeight: 600,
                          borderColor: '#133A60',
                          color: '#133A60'
                        }}
                        variant="outline-light"
                        onClick={() => setShowTableModal(true)}
                      >
                        <FaTable className="me-2" style={{ marginBottom: '4px' }} />
                        Uploaded File
                      </Button>
                      <Button
                        className="px-2 py-2 border-0"
                        style={{
                          borderRadius: '8px',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                        }}
                        onClick={handleResetText}
                        disabled={!textInput}
                      >
                        <FaEraser className="me-2" style={{ marginBottom: '4px' }} />
                        Clear Text
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {isTextLocked && (
                      <Alert variant="info" className="py-2">
                        Text loaded from uploads is read-only. Clear to type new text.
                      </Alert>
                    )}
                    <Form.Group className="mb-3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Form.Label>Enter text to convert</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={12}
                        value={textInput}
                        onChange={(e) => handleTextChange(e.target.value)}
                        disabled={isTextLocked}
                        placeholder="Type or select text from uploaded file to convert..."
                        style={{ resize: 'vertical', flex: 1 }}
                      />
                      {textError && <div className="text-danger mt-2">{textError}</div>}
                    </Form.Group>
                    <div className="d-flex flex-wrap gap-3" style={{ marginTop: 'auto' }}>
                      <Button
                        variant="primary"
                        onClick={handleGenerateAudio}
                        disabled={generating || processing}
                        style={{
                          minWidth: 140,
                          border: 'none',
                          background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                        }}
                      >
                        {generating ? 'Generating...' : 'Generate Audio'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

              </Col>
            </Row>
          </div>
        </div>
      </div>

      <Modal show={showTableModal} onHide={() => setShowTableModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Text Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadsLoading ? (
            <div className="text-center py-4">Loading uploads...</div>
          ) : uploads.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-2">No uploads available. Please upload a text file first.</p>
              <Button variant="primary" onClick={() => navigate('/TTSUpload')}>
                Go to TTS Bulk Upload
              </Button>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Filename</th>
                  <th>Text Preview</th>
                  <th>Language</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map(upload => (
                  <tr key={upload.id}>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedUpload?.id === upload.id}
                        onChange={() => handleUploadSelection(upload)}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{upload.filename}</td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {upload.text_content}
                    </td>
                    <td>{upload.language || 'Not specified'}</td>
                    <td>{upload.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTableModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Preview Generated Audio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {generatedAudio && generatedAudio.preview_files && generatedAudio.preview_files.length > 0 ? (
            <Table hover responsive className="align-middle">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>Filename</th>
                  <th>Text Preview</th>
                  <th>Audio</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {generatedAudio.preview_files.map((file, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold">{file.filename}</td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {file.text_preview}
                    </td>
                    <td>
                      <audio
                        className="custom-audio"
                        controls
                        src={resolveMediaUrl(file.audio_url)}
                        style={{ width: '200px', height: '32px' }}
                        controlsList="nodownload"
                      />
                    </td>
                    <td>{file.processing_time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No preview available.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmAndStore}
            disabled={!generatedAudio || processing}
            style={{
              border: 'none',
              background: 'linear-gradient(45deg, #34d399, #059669)'
            }}
          >
            {processing ? 'Saving...' : 'Confirm to Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TTSHome;
