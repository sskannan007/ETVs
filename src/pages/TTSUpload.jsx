import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES, getLanguageDisplayName } from '../config/Languages.jsx';
import SideNavbar from '../components/common/SideNavbar';
import { Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

const resolveLanguageLabel = (language) => {
  if (!language) return '';
  if (typeof language === 'string') {
    return getLanguageDisplayName(language) || language;
  }
  if (typeof language === 'object') {
    return (
      language.label ||
      language.name ||
      getLanguageDisplayName(language.code) ||
      language.code ||
      ''
    );
  }
  return '';
};

const getLanguageKey = (language, idx) => {
  if (!language) return idx;
  if (typeof language === 'string') return language;
  if (typeof language === 'object') return language.code || language.label || idx;
  return idx;
};

const TTSUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  
  // Enhanced upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [convertingFiles, setConvertingFiles] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] = useState('');
  const [canUploadFolder, setCanUploadFolder] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Refs for file inputs
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRole(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(buildApiUrl('/users/me'), {
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
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Fetch available languages from backend
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch(buildApiUrl('/languages'));
        const data = await res.json();
        if (data.languages) {
          setAvailableLanguages(data.languages); // This must update dropdown
        }
      } catch (err) {
        console.error("Failed to load languages", err);
      }
    };
    fetchLanguages();
  }, []);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadError('');
    setUploadSuccess('');
    setPreview('');
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target.result);
        };
        reader.readAsText(selectedFile);
      } else {
        setUploadError('Please select a .txt file only.');
        setFile(null);
        return;
      }
    } else {
      setPreview('');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setUploadError('Authentication required.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch(buildApiUrl('/tts/upload-text'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const data = await res.json();
        setUploadSuccess(data.message || 'File uploaded successfully!');
        setUploadError('');
        
        // Update available languages after successful upload
        const langRes = await fetch(buildApiUrl('/languages'));
        if (langRes.ok) {
          const langData = await langRes.json();
          setAvailableLanguages(langData.languages || []);
        }
      } else {
        const data = await res.json();
        setUploadError(data.detail || 'Failed to upload file.');
        setUploadSuccess('');
      }
    } catch (err) {
      setUploadError('Network error. Please try again.');
      setUploadSuccess('');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Enhanced drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const selectedFile = files[0]; // For now, handle only the first file
      setFile(selectedFile);
      setUploadError('');
      setUploadSuccess('');
      setPreview('');
      
      if (selectedFile) {
        if (selectedFile.name.toLowerCase().endsWith('.txt')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPreview(event.target.result);
          };
          reader.readAsText(selectedFile);
        } else {
          setUploadError('Please select a .txt file only.');
          setFile(null);
          return;
        }
      }
    }
  };

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // For folder upload, we'll handle the first txt file found
      const txtFile = files.find(file => file.name.endsWith('.txt'));
      if (txtFile) {
        handleFileUpload({ target: { files: [txtFile] } });
      } else {
        setUploadError('No .txt file found in the selected folder.');
      }
    }
  };

  if (loading) return null;
  if (role !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontWeight: 600 }}>
        Access Denied: You do not have permission to view this page.
      </div>
    );
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
                  Upload File
                </h3>
              </div>
              <p className="pt-2 mb-0 text-light opacity-75">
                Drag your .txt scripts here, preview the content, and send them to the TTS pipeline in one streamlined interface.
              </p>
            </div>
            <div
              style={{
                minWidth: '240px',
                background: 'hsla(0, 0.00%, 100.00%, 0.08)',
                borderRadius: '20px',
                padding: '1.2rem'
              }}
            >
              <h6 className="text-uppercase opacity-75" style={{ letterSpacing: '0.08em' }}>
                Available Languages
              </h6>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {availableLanguages.length > 0 ? (
                  availableLanguages.map((language, idx) => (
                    <span
                      key={getLanguageKey(language, idx)}
                      style={{
                        padding: '0.2rem 0.8rem',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.15)',
                        fontSize: '0.85rem'
                      }}
                    >
                      {resolveLanguageLabel(language) || 'Language'}
                    </span>
                  ))
                ) : (
                  <span style={{ fontStyle: 'italic', opacity: 0.8 }}>Loading...</span>
                )}
              </div>
            </div>
          </div>

          <Card
            style={{
              borderRadius: '24px',
              border: 'none',
              boxShadow: '0 30px 80px rgba(15,23,42,0.35)',
              flexGrow: 1
            }}
          >
            <Card.Body>
              <Row className="g-4">
                <Col xl={6} lg={6} md={12}>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '0.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 20px 50px rgba(15,23,42,0.1)'
                    }}
                  >
                    <h3 className="fw-semibold mb-3" style={{ color: '#0f172a' }}>
                      Upload Text Files
                    </h3>
                    <div
                      className="upload-area p-5 border-2 border-dashed border-primary rounded"
                      style={{
                        borderStyle: 'dashed',
                        borderColor: isDragOver ? '#2563eb' : '#94a3b8',
                        backgroundColor: isDragOver ? '#eff6ff' : '#f8fafc',
                        width: '100%',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="fas fa-cloud-upload-alt fa-3x mb-3" style={{ color: '#2563eb' }}></i>
                      <h5 className="mb-2" style={{ color: '#0f172a' }}>Drag & drop .txt files here</h5>
                      <p className="text-muted mb-0">or click to browse your computer</p>
                      <small className="text-muted">Allowed types: .txt only</small>
                      <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center">
                        <div>
                          <input
                            type="file"
                            multiple
                            accept=".txt"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            id="file-upload"
                            ref={fileInputRef}
                          />
                          <label htmlFor="file-upload">
                            <Button
                              variant="outline-primary"
                              as="span"
                              disabled={isUploading || convertingFiles}
                              style={{ color: '#fff', border: 'none', background: 'linear-gradient(45deg, rgb(56, 189, 248), rgb(37, 99, 235))', padding: '8px 24px', fontSize: '20px', borderRadius: '12px' }}
                            >
                              <i className="fas fa-file me-2"></i>
                              Select Files
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    {(isUploading || convertingFiles) && (
                      <div className="mt-4">
                        {isUploading && (
                          <div className="mb-3">
                            <div className="progress" style={{ height: '12px' }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{ width: `${uploadProgress}%` }}
                              >
                                {uploadProgress}%
                              </div>
                            </div>
                            <small className="text-muted">Uploading to server...</small>
                          </div>
                        )}
                        {convertingFiles && (
                          <div>
                            <div className="progress" style={{ height: '12px' }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                role="progressbar"
                                style={{ width: `${conversionProgress}%` }}
                              >
                                {conversionProgress}%
                              </div>
                            </div>
                            <small className="text-muted">
                              {currentProcessingFile ? `Processing: ${currentProcessingFile}` : 'Processing files...'}
                            </small>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      {uploadError && (
                        <Alert variant="danger" onClose={() => setUploadError('')} dismissible>
                          {uploadError}
                        </Alert>
                      )}
                      {uploadSuccess && (
                        <Alert variant="success" onClose={() => setUploadSuccess('')} dismissible>
                          {uploadSuccess}
                        </Alert>
                      )}
                    </div>
                  </div>
                </Col>

                <Col xl={6} lg={6} md={12}>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '2rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 20px 50px rgba(15,23,42,0.1)'
                    }}
                  >
                    <h3 className="fw-semibold mb-3" style={{ color: '#0f172a' }}>
                      File Preview & Upload
                    </h3>
                    <div className="mb-3">
                      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Preview</div>
                      <div
                        style={{
                          height: 320,
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1rem',
                          background: '#f8fafc',
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto'
                        }}
                      >
                        {preview ? preview : <span style={{ color: '#94a3b8' }}>No .txt file uploaded yet.</span>}
                      </div>
                    </div>

                    <div className="mt-auto">
                      {file && (
                        <form onSubmit={handleSubmit} className="text-end">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={!file || isUploading || convertingFiles}
                            style={{
                              padding: '0.6rem 1.8rem',
                              borderRadius: '14px',
                              fontWeight: 600,
                              border: 'none',
                              background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                            }}
                          >
                            {isUploading ? 'Uploading...' : 'Upload File'}
                          </Button>
                        </form>
                      )}
                      {!file && (
                        <p className="text-muted text-center mb-0">
                          Select a .txt file to enable uploading.
                        </p>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TTSUpload;
