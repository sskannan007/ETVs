import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Card, Alert, Badge, Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import SideNavbar from '../components/common/SideNavbar';

const baseStatusBadgeStyle = {
  borderRadius: '4px',
  padding: '8px 12px',
  fontWeight: 600,
  display: 'inline-block',
  opacity: 1,
  textTransform: 'capitalize'
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const BulkUpload = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Bulk upload states
  const [bulkUploads, setBulkUploads] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Enhanced upload states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [convertingFiles, setConvertingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Refs for file inputs
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRole(null);
        setLoading(false);
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
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      fetchBulkUploads();
    }
  }, [role]);

  const fetchBulkUploads = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bulk-uploads`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setBulkUploads(data.uploads || []);
    } catch (err) {
      console.error('Failed to fetch bulk uploads:', err);
    }
  };

  const handleChooseFiles = () => {
    // Trigger file input click
    document.getElementById('fileInput').click();
  };

  // Drag and drop handlers
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
    handleFileSelect({ target: { files } });
  };

  const handleFileUpload = (e) => {
    handleFileSelect(e);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log('DEBUG: Selected files:', files);
    console.log('DEBUG: File types:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));

    // Filter files to accept only audio files
    const audioExtensions = ['.mp3', '.wav', '.mp4'];
    const filteredFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      return audioExtensions.some(ext => fileName.endsWith(ext)) || file.type.startsWith('audio/');
    });

    console.log('DEBUG: Filtered audio files:', filteredFiles);
    setSelectedFiles(filteredFiles);
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select files to upload');
      return;
    }

    console.log('DEBUG: Starting upload with files:', selectedFiles);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      console.log(`DEBUG: Adding file ${index}:`, file.name, file.type, file.size);
      formData.append('files', file);
    });

    try {
      console.log('DEBUG: Sending request to bulk upload endpoint');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch(`${API_BASE_URL}/admin/bulk-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('DEBUG: Response status:', res.status);
      console.log('DEBUG: Response headers:', res.headers);

      if (res.ok) {
        const data = await res.json();
        console.log('DEBUG: Upload successful:', data);
        setUploadSuccess(data.message);
        setSelectedFiles([]);
        fetchBulkUploads();
      } else {
        const error = await res.json();
        console.log('DEBUG: Upload failed:', error);
        setUploadError(error.detail || 'Upload failed');
      }
    } catch (err) {
      console.log('DEBUG: Upload error:', err);
      setUploadError('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
          <div className="py-4 px-5 flex-grow-1 d-flex flex-column">
            <Row className="g-4 flex-grow-1">
              <Col md={12}>
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <Button
                        variant="link"
                        onClick={() => navigate('/home')}
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
                      Drag in MP3/WAV/MP4 files, track batch progress, and sync your dataset in one flow.
                    </p>
                  </div>
                  <div
                    style={{
                      minWidth: '240px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      color: '#fff',
                      padding: '1.25rem'
                    }}
                  >
                    <h6 className="text-uppercase opacity-75 mb-2" style={{ letterSpacing: '0.08em' }}>
                      Last Upload
                    </h6>
                    {bulkUploads[0] ? (
                      <>
                        <div className="fw-semibold text-truncate">{bulkUploads[0].filename}</div>
                        <span
                          className="badge mt-2 text-uppercase"
                          style={{ letterSpacing: '0.08em', ...getStatusBadgeStyle(bulkUploads[0].status || '') }}
                        >
                          {bulkUploads[0].status || 'unknown'}
                        </span>
                      </>
                    ) : (
                      <p className="mb-0 opacity-80">No files uploaded yet.</p>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    border: '1px solid rgba(15,23,42,0.08)',
                    boxShadow: '0 25px 60px rgba(15,23,42,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                  }}
                >

                  {message.text && (
                    <Alert
                      variant={message.type}
                      onClose={() => setMessage({ type: '', text: '' })}
                      dismissible
                      style={{ marginBottom: '1rem' }}
                    >
                      {message.text}
                    </Alert>
                  )}

                  {selectedFiles.length === 0 ? (
                    // Full width upload area when no files selected
                    <div
                      className="upload-area p-5 border-2 border-dashed border-primary rounded"
                      style={{
                        borderStyle: 'dashed',
                        borderColor: isDragOver ? '#1d4ed8' : '#94a3b8',
                        backgroundColor: isDragOver ? '#eff6ff' : '#f8fafc',
                        width: '100%',
                        marginBottom: '1rem',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="fas fa-cloud-upload-alt fa-3x mb-3" style={{ color: '#2563eb' }}></i>
                      <h5 className="mb-2" style={{ color: '#0f172a' }}>Drag & drop audio files here</h5>
                      <p className="text-muted mb-4">or click to browse your computer</p>
                      <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Button
                          size="lg"
                          className="px-4 py-2 border-0"
                          style={{
                            borderRadius: '12px',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          disabled={isUploading || convertingFiles}
                        >
                          Select Files
                        </Button>
                      </div>
                      {isUploading && (
                        <div className="mb-3 mt-3">
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
                        <div className="mt-3">
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
                  ) : (
                    // Split layout when files are selected
                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <div
                          className="upload-area p-4 border-2 border-dashed border-primary rounded h-100"
                          style={{
                            borderStyle: 'dashed',
                            borderColor: isDragOver ? '#1d4ed8' : '#94a3b8',
                            backgroundColor: isDragOver ? '#eff6ff' : '#f8fafc',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="fas fa-cloud-upload-alt fa-2x mb-3" style={{ color: '#2563eb' }}></i>
                          <h6 className="mb-2" style={{ color: '#0f172a' }}>Drag & drop audio files here</h6>
                          <p className="text-muted mb-3 small">or click to browse your computer</p>
                          <Button
                            size="md"
                            className="px-3 py-2 border-0"
                            style={{
                              borderRadius: '12px',
                              fontWeight: 600,
                              background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            disabled={isUploading || convertingFiles}
                          >
                            Select Files
                          </Button>
                          {isUploading && (
                            <div className="mb-2 mt-3">
                              <div className="progress" style={{ height: '12px' }}>
                                <div
                                  className="progress-bar progress-bar-striped progress-bar-animated"
                                  role="progressbar"
                                  style={{ width: `${uploadProgress}%` }}
                                >
                                  {uploadProgress}%
                                </div>
                              </div>
                              <small className="text-muted">Uploading...</small>
                            </div>
                          )}
                          {convertingFiles && (
                            <div className="mt-3">
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
                                {currentProcessingFile ? `Processing: ${currentProcessingFile}` : 'Processing...'}
                              </small>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div
                          className="h-100"
                          style={{
                            border: '1px solid rgba(15,23,42,0.08)',
                            borderRadius: '12px',
                            padding: '1rem',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <h6 className="fw-semibold mb-3" style={{ color: '#0f172a' }}>
                            Selected Files ({selectedFiles.length})
                          </h6>
                          <div
                            style={{
                              maxHeight: '250px',
                              overflowY: 'auto'
                            }}
                          >
                            <ul className="list-unstyled mb-0">
                              {selectedFiles.map((file, idx) => (
                                <li key={idx} className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
                                  <span className="small" style={{ color: '#475569', wordBreak: 'break-word', flex: 1, marginRight: '8px' }}>{file.name}</span>
                                  <Badge bg="info">Audio</Badge>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="audio/*,.mp3,.wav,.mp4"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />

                  {uploadError && <Alert variant="danger">{uploadError}</Alert>}
                  {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}

                  <div className="d-flex justify-content-end">
                    <Button
                      size="lg"
                      className="px-4 py-2 border-0"
                      style={{
                        borderRadius: '14px',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                      }}
                      onClick={handleUploadFiles}
                      disabled={selectedFiles.length === 0 || isUploading || convertingFiles}
                    >
                      {isUploading
                        ? 'Uploading...'
                        : convertingFiles
                          ? 'Processing...'
                          : selectedFiles.length
                            ? `Upload ${selectedFiles.length} Files`
                            : 'Upload Files'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* <Row className="mt-4">
              <Col md={12}>
                <Card style={{ borderRadius: '16px' }}>
                  <Card.Header className="d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Uploaded Files</h5>
                    <small className="text-muted">{bulkUploads.length} records</small>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: 'calc(100vh - 320px)', overflowY: 'auto' }}>
                      {bulkUploads.length === 0 ? (
                        <div className="text-center text-muted py-5">
                          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📁</div>
                          <h6 style={{ marginBottom: '8px', color: '#6c757d' }}>No files uploaded yet</h6>
                          <p className="small mb-0" style={{ color: '#94a3b8' }}>
                            Upload MP3, WAV, or MP4 files to get started with transcription.
                          </p>
                        </div>
                      ) : (
                        <Table style={{ border: '1px solid #ddd' }} striped hover>
                          <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                              <th style={{ width: '60px', borderRight: '1px solid #ddd', padding: '12px 8px' }}>S.No.</th>
                              <th style={{ borderRight: '1px solid #ddd', padding: '12px 8px' }}>File Name</th>
                              <th style={{ width: '80px', borderRight: '1px solid #ddd', padding: '12px 8px' }}>Type</th>
                              <th style={{ width: '100px', borderRight: '1px solid #ddd', padding: '12px 8px' }}>Status</th>
                              <th style={{ width: '100px', padding: '12px 8px' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkUploads.map((upload, index) => {
                              const fileExtension = upload.filename.split('.').pop().toUpperCase();

                              const getFileTypeBadgeColor = (ext) => {
                                switch (ext) {
                                  case 'MP4':
                                    return 'primary';
                                  case 'MP3':
                                    return 'success';
                                  case 'WAV':
                                    return 'info';
                                  default:
                                    return 'secondary';
                                }
                              };

                              return (
                                <tr key={upload.id} style={{ height: '60px' }}>
                                  <td
                                    style={{
                                      borderRight: '1px solid #ddd',
                                      padding: '16px 8px',
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      borderRight: '1px solid #ddd',
                                      maxWidth: '200px',
                                      wordWrap: 'break-word',
                                      wordBreak: 'break-all',
                                      whiteSpace: 'normal',
                                      lineHeight: '1.3',
                                      padding: '16px 8px',
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    {upload.filename}
                                  </td>
                                  <td
                                    style={{
                                      borderRight: '1px solid #ddd',
                                      padding: '16px 8px',
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    <Badge
                                      bg={getFileTypeBadgeColor(fileExtension)}
                                      style={{
                                        fontSize: '11px',
                                        padding: '6px 10px',
                                        fontWeight: '500'
                                      }}
                                    >
                                      {fileExtension}
                                    </Badge>
                                  </td>
                                  <td
                                    style={{
                                      borderRight: '1px solid #ddd',
                                      padding: '16px 8px',
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    <span
                                      style={{
                                        ...getStatusBadgeStyle(upload.status || ''),
                                        fontSize: '12px',
                                        padding: '6px 12px'
                                      }}
                                    >
                                      {upload.status || 'unknown'}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: '16px 8px',
                                      verticalAlign: 'middle',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {new Date(upload.uploaded_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
