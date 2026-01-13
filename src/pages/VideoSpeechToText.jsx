import React, { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import SideNavbar from '../components/common/SideNavbar';
import { Container, Button, Modal, Alert, Table, Badge, Dropdown } from 'react-bootstrap';
import { FaDownload, FaPlay, FaShare, FaFilter, FaVideo } from 'react-icons/fa';
import { LANGUAGES, DEFAULT_LANG, getLanguageDisplayName } from '../config/Languages';

const VideoSpeechToText = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [role, setRole] = useState(null);
  const [videoTasks, setVideoTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [sharing, setSharing] = useState(false);
  
  // New state for layout
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [tempExtractedText, setTempExtractedText] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8000/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setUserName(`${user.firstname} ${user.lastname}`);
          setUserEmail(user.email);
          setRole(user.role);
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  // Fetch video tasks
  useEffect(() => {
    if (userEmail) {
      fetchVideoTasks();
    }
  }, [userEmail]);

  const fetchVideoTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/user/video-tasks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVideoTasks(data.tasks || []);
        
        // Extract unique languages from video tasks
        const languages = [...new Set(data.tasks?.map(task => task.language) || [])];
        setAvailableLanguages(languages);
        
        // Set default language to first available language
        if (languages.length > 0) {
          setLang(languages[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch video tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredVideoTasks = videoTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'assigned') return task.status === 'assigned';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'shared') return task.shared_with_admin;
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'completed', label: 'Completed' },
    { value: 'shared', label: 'Shared' }
  ];

  const handleProcessVideo = async (task) => {
    if (!task) return;
    
    // Check if task is in a processable state
    if (task.status === 'completed' && task.extracted_text) {
      alert('Video is already processed. Extracted text: ' + task.extracted_text);
      return;
    }
    
    if (task.status === 'processing') {
      alert('Video is already being processed. Please wait...');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to process the video "${task.video_filename}"?`)) {
      return;
    }
    
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:8000/user/process-video/${task.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('DEBUG: Processing successful:', data);
        
        // Update the task in the list
        setVideoTasks(prev => prev.map(t => 
          t.id === task.id 
            ? { ...t, extracted_text: data.extracted_text, status: 'completed' }
            : t
        ));
        
        alert('Video processed successfully! Extracted text: ' + (data.extracted_text || 'No text extracted'));
      } else {
        const error = await res.json();
        console.log('DEBUG: Processing failed:', error);
        
        // Update task status to failed
        setVideoTasks(prev => prev.map(t => 
          t.id === task.id 
            ? { ...t, status: 'failed', error_message: error.detail }
            : t
        ));
        
        alert('Processing failed: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      console.log('DEBUG: Processing error:', err);
      
      // Update task status to failed
      setVideoTasks(prev => prev.map(t => 
        t.id === task.id 
          ? { ...t, status: 'failed', error_message: err.message }
          : t
      ));
      
      alert('Processing failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectVideo = (task) => {
    setSelectedVideo(task);
    setShowVideoPlayer(true);
    setExtractedText(task.extracted_text || '');
  };

  const handleExtractText = async () => {
    if (!selectedVideo) return;
    
    console.log('DEBUG: Selected video:', selectedVideo);
    console.log('DEBUG: Video task ID:', selectedVideo.id);
    console.log('DEBUG: Video task status:', selectedVideo.status);
    
    // Check if task is in a processable state
    if (selectedVideo.status === 'completed' && selectedVideo.extracted_text) {
      setTempExtractedText(selectedVideo.extracted_text);
      setShowExtractedText(true);
      setExtractedText(selectedVideo.extracted_text);
      return;
    }
    
    if (selectedVideo.status === 'processing') {
      alert('Video is already being processed. Please wait...');
      return;
    }
    
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:8000/user/process-video/${selectedVideo.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      console.log('DEBUG: Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('DEBUG: Extraction successful:', data);
        
        // Check if this is an already processed video
        if (data.message === "Video already processed") {
          // Video was already processed, show existing text
          setTempExtractedText(data.extracted_text || 'No text extracted');
          setShowExtractedText(true);
          setExtractedText(data.extracted_text);
          
          // Update the task in the list
          setVideoTasks(prev => prev.map(task => 
            task.id === selectedVideo.id 
              ? { ...task, extracted_text: data.extracted_text, status: 'completed' }
              : task
          ));
        } else {
          // New processing, show the extracted text with save/cancel options
          setTempExtractedText(data.extracted_text || 'No text extracted');
          setShowExtractedText(true);
          
          // Update the task status to completed but don't save the text yet
          setVideoTasks(prev => prev.map(task => 
            task.id === selectedVideo.id 
              ? { ...task, status: 'completed' }
              : task
          ));
        }
      } else {
        const error = await res.json();
        console.log('DEBUG: Extraction failed:', error);
        alert('Extraction failed: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      console.log('DEBUG: Extraction error:', err);
      alert('Extraction failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleResetTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to reset this task? This will allow you to try processing again.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/user/reset-video-task/${taskId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        alert('Task reset successfully! You can now try processing again.');
        fetchVideoTasks(); // Refresh the task list
      } else {
        const error = await res.json();
        alert('Failed to reset task: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to reset task: ' + err.message);
    }
  };

  const handleSaveText = async () => {
    if (!selectedVideo || !extractedText) return;
    
    setSharing(true);
    try {
      const res = await fetch(`http://localhost:8000/user/share-video-text/${selectedVideo.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        alert('Text saved and shared with admin successfully!');
        // Update the task in the list
        setVideoTasks(prev => prev.map(task => 
          task.id === selectedVideo.id 
            ? { ...task, shared_with_admin: true }
            : task
        ));
        setShowVideoPlayer(false);
        setSelectedVideo(null);
        setExtractedText('');
      } else {
        const error = await res.json();
        alert('Failed to save text: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to save text: ' + err.message);
    } finally {
      setSharing(false);
    }
  };

  const handleDeleteText = () => {
    setExtractedText('');
    setShowVideoPlayer(false);
    setSelectedVideo(null);
  };

  const handleSaveExtractedText = () => {
    if (!selectedVideo || !tempExtractedText) return;
    
    // Update the task with the extracted text (temporary display only)
    setVideoTasks(prev => prev.map(task => 
      task.id === selectedVideo.id 
        ? { ...task, extracted_text: tempExtractedText }
        : task
    ));
    
    // Update the main extractedText state for the player
    setExtractedText(tempExtractedText);
    
    // Hide the text input area and show confirm button
    setShowExtractedText(false);
    setShowConfirmButton(true);
    
    alert('Text saved for review. Click "Confirm" to store in database.');
  };

  const handleConfirmExtractedText = async () => {
    if (!selectedVideo || !tempExtractedText) return;
    
    setSharing(true);
    try {
      // Share with admin (this stores in database)
      const res = await fetch(`http://localhost:8000/user/share-video-text/${selectedVideo.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        alert('Text confirmed and stored in database successfully!');
        setShowConfirmButton(false);
        setTempExtractedText('');
      } else {
        const error = await res.json();
        alert('Failed to confirm text: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to confirm text: ' + err.message);
    } finally {
      setSharing(false);
    }
  };

  const handleCancelExtractedText = () => {
    setShowExtractedText(false);
    setShowConfirmButton(false);
    setTempExtractedText('');
    // Reset the task status back to assigned so it can be processed again
    if (selectedVideo) {
      setVideoTasks(prev => prev.map(task => 
        task.id === selectedVideo.id 
          ? { ...task, status: 'assigned', extracted_text: null }
          : task
      ));
    }
  };

  const confirmProcessVideo = async () => {
    if (!selectedTask) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:8000/user/process-video/${selectedTask.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        const data = await res.json();
        alert('Video processed successfully! Extracted text: ' + data.extracted_text);
        fetchVideoTasks();
      } else {
        const error = await res.json();
        alert('Processing failed: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Processing failed: ' + err.message);
    } finally {
      setProcessing(false);
      setShowConfirmModal(false);
      setSelectedTask(null);
    }
  };

  const handleShareText = async (task) => {
    if (!window.confirm('Are you sure you want to share the extracted text with the admin? This action cannot be undone.')) {
      return;
    }

    setSharing(true);
    try {
      const res = await fetch(`http://localhost:8000/user/share-video-text/${task.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        alert('Text shared with admin successfully!');
        fetchVideoTasks();
      } else {
        const error = await res.json();
        alert('Failed to share text: ' + (error.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to share text: ' + err.message);
    } finally {
      setSharing(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'assigned': 'warning',
      'processing': 'info',
      'completed': 'success',
      'failed': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <>
      <TopNavbar />
      <SideNavbar role={role} />
      <div style={{ overflowX: 'hidden' }}>
        <div className="main-content">
          <div className="row">
            {/* Left half: Video tasks list */}
            <div className="col-md-7">
              <Container style={{ margin: '0 0 0 1rem', padding: 0 }}>
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 0rem 0 1rem', border: '1px solid #e0e0e0', height: 'calc(100vh - 11rem)' }}>
                  <h4 className="mb-4 d-flex justify-content-between align-items-center">
                    <span>Video Tasks</span>
                    <span style={{ position: 'relative', marginRight: 16 }}>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          size="sm"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: '86', fontWeight: 500 }}
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
                              style={filter === opt.value ? { background: '#1976d2', color: '#fff' } : {}}
                            >
                              {opt.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  </h4>
                  <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 14rem)' }}>
                    {loading ? (
                      <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading video tasks...</p>
                      </div>
                    ) : (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Sl. No</th>
                            <th>Video Record</th>
                            <th>Sentence Converted</th>
                            <th>Checkbox</th>
                            <th>Delete</th>
                            <th>Confirm</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVideoTasks.length === 0 ? (
                            <tr><td colSpan={6} className="text-center">
                              No video tasks assigned yet.
                            </td></tr>
                          ) : (
                            filteredVideoTasks.map((task, idx) => (
                              <tr key={task.id}>
                                <td><div style={{ marginTop: '12px' }}>{idx + 1}</div></td>
                                <td>
                                  <div style={{
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {task.video_filename}
                                  </div>
                                </td>
                                <td>
                                  <div style={{
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    whiteSpace: 'normal',
                                  }}>
                                    {task.extracted_text ? (
                                      <span style={{ color: '#28a745', fontWeight: '500' }}>
                                        {task.extracted_text}
                                      </span>
                                    ) : task.status === 'processing' ? (
                                      <span style={{ color: '#007bff', fontStyle: 'italic' }}>
                                        Processing...
                                      </span>
                                    ) : task.status === 'failed' ? (
                                      <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                                        Processing failed
                                      </span>
                                    ) : task.status === 'completed' && !task.extracted_text ? (
                                      <span style={{ color: '#ffc107', fontStyle: 'italic' }}>
                                        Ready to save
                                      </span>
                                    ) : (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                        Not processed
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center justify-content-center mt-3">
                                    <input
                                      style={{ width: '20px', height: '20px', accentColor: '#133a60' }}
                                      type="checkbox"
                                      checked={selectedVideo?.id === task.id}
                                      onChange={e => {
                                        if (e.target.checked) {
                                          handleSelectVideo(task);
                                        } else {
                                          setSelectedVideo(null);
                                          setShowVideoPlayer(false);
                                        }
                                      }}
                                      disabled={task.shared_with_admin}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <Button
                                    className='delete-btn'
                                    style={{ marginTop: '12px' }}
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this video task?')) {
                                        // Add delete functionality here
                                        console.log('Delete task:', task.id);
                                      }
                                    }}
                                    disabled={task.shared_with_admin}
                                  >
                                    Delete
                                  </Button>
                                </td>
                                <td>
                                  <div className="d-flex gap-1 flex-wrap">
                                    {/* Process Button */}
                                    {task.status === 'assigned' || task.status === 'failed' ? (
                                      <Button
                                        style={{ marginTop: '12px' }}
                                        size="sm"
                                        variant="primary"
                                        onClick={() => handleProcessVideo(task)}
                                        disabled={processing}
                                      >
                                        Process
                                      </Button>
                                    ) : task.status === 'processing' ? (
                                      <Button
                                        style={{ marginTop: '12px' }}
                                        size="sm"
                                        variant="warning"
                                        onClick={() => handleResetTask(task.id)}
                                      >
                                        Reset
                                      </Button>
                                    ) : null}
                                    
                                    {/* Confirm Button */}
                                    {task.extracted_text && (
                                      <Button
                                        style={{ marginTop: '12px' }}
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleSaveText()}
                                        disabled={task.shared_with_admin || sharing}
                                      >
                                        {task.shared_with_admin ? 'Confirmed' : 'Confirm'}
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              </Container>
            </div>

            {/* Right half: Video player and controls */}
            <div className="col-md-5">
              <Container style={{ padding: 0 }}>
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', border: '1px solid #e0e0e0', marginRight: '12px' }}>
                  <h2 className="mb-4 text-center">Hello, Admin main</h2>
                  
                  <div className="mb-3 d-flex align-items-center justify-content-center" style={{ gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label className='language-title' htmlFor="language-select" style={{ fontWeight: 600, marginBottom: 4 }}>Select language</label>
                      <select
                        id="language-select"
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                        className="form-select"
                        style={{ minWidth: 140, fontWeight: 600 }}
                        disabled={availableLanguages.length === 0}
                      >
                        {availableLanguages.length === 0 ? (
                          <option value="">No assigned languages</option>
                        ) : (
                          availableLanguages.map(language => (
                            <option key={language} value={language}>
                              {getLanguageDisplayName(language)}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3" style={{ fontSize: '20px' }}>
                    <strong>
                      Assigned No: {selectedVideo ? selectedVideo.id : '-'}
                    </strong>
                  </div>

                  {showVideoPlayer && selectedVideo && (
                    <div className="mb-4">
                      <div className="mb-2"><strong>Video: {selectedVideo.video_filename}</strong></div>
                      
                      {/* Video Player */}
                      <div className="mb-3">
                        <video 
                          controls 
                          width="100%" 
                          height="300"
                          style={{ borderRadius: '8px', backgroundColor: '#000' }}
                          onError={(e) => {
                            console.error('Video load error:', e);
                            // Fallback to placeholder if video fails to load
                          }}
                        >
                          <source 
                            src={`http://localhost:8000/video/${selectedVideo.video_filename}`} 
                            type="video/mp4" 
                          />
                          Your browser does not support the video tag.
                        </video>
                        <div className="mt-2">
                          <small className="text-muted">Video file: {selectedVideo.video_filename}</small>
                        </div>
                      </div>

                      {/* Extracted Text Display */}
                      {extractedText && (
                        <div className="mb-3">
                          <label className="form-label"><strong>Extracted Text:</strong></label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                            placeholder="Extracted text will appear here..."
                          />
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <Button 
                          variant="primary" 
                          onClick={handleExtractText} 
                          disabled={processing || !selectedVideo}
                        >
                          {processing ? 'Extracting...' : 
                           (selectedVideo?.status === 'completed' && selectedVideo?.extracted_text) ? 
                           'Re-extract Text' : 'Extract Text'}
                        </Button>
                        {extractedText && !showExtractedText && (
                          <>
                            <Button 
                              variant="success" 
                              onClick={handleSaveText}
                              disabled={sharing}
                            >
                              {sharing ? 'Saving...' : 'Save'}
                            </Button>
                            <Button 
                              variant="danger" 
                              onClick={handleDeleteText}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Show extracted text with save/cancel options */}
                      {showExtractedText && (
                        <div className="mt-3 p-3" style={{ 
                          backgroundColor: '#f8f9fa', 
                          border: '1px solid #dee2e6', 
                          borderRadius: '8px',
                          borderLeft: '4px solid #007bff'
                        }}>
                          <h6 className="mb-2" style={{ color: '#007bff', fontWeight: '600' }}>
                            Extracted Text:
                          </h6>
                          <div className="mb-3">
                            <textarea
                              className="form-control"
                              rows="4"
                              value={tempExtractedText}
                              onChange={(e) => setTempExtractedText(e.target.value)}
                              placeholder="Extracted text will appear here..."
                              style={{ fontSize: '14px' }}
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="success" 
                              onClick={handleSaveExtractedText}
                              disabled={sharing || !tempExtractedText.trim()}
                              size="sm"
                            >
                              {sharing ? 'Saving...' : 'Save'}
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={handleCancelExtractedText}
                              disabled={sharing}
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Show confirm button after save */}
                      {showConfirmButton && (
                        <div className="mt-3 p-3" style={{ 
                          backgroundColor: '#d4edda', 
                          border: '1px solid #c3e6cb', 
                          borderRadius: '8px',
                          borderLeft: '4px solid #28a745'
                        }}>
                          <h6 className="mb-2" style={{ color: '#155724', fontWeight: '600' }}>
                            Text Ready for Confirmation:
                          </h6>
                          <p className="mb-3" style={{ color: '#155724', fontSize: '14px' }}>
                            Text has been saved for review. Click "Confirm" to store it in the database.
                          </p>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="success" 
                              onClick={handleConfirmExtractedText}
                              disabled={sharing}
                              size="sm"
                            >
                              {sharing ? 'Confirming...' : 'Confirm'}
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={handleCancelExtractedText}
                              disabled={sharing}
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!showVideoPlayer && (
                    <div className="text-center text-muted py-4">
                      <FaVideo size={48} className="mb-3" />
                      <p>Select a video task to start processing</p>
                    </div>
                  )}
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Video Processing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to process the video file <strong>{selectedTask?.video_filename}</strong>?</p>
          <p className="text-muted">
            This will extract speech-to-text from the video. The process may take some time depending on the video length.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmProcessVideo}
            disabled={processing}
            style={{ backgroundColor: '#133a60', borderColor: '#133a60' }}
          >
            {processing ? 'Processing...' : 'Confirm Process'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VideoSpeechToText;
