import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaPlay, FaStop, FaDownload } from 'react-icons/fa';
import SideNavbar from '../components/common/SideNavbar';
import './registeration.scss';

const TTSPage = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState(null);
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info and check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user info from localStorage or API
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setUserName(userInfo.name || 'User');
      setRole(userInfo.role || 'user');
    } catch (error) {
      console.error('Error parsing user info:', error);
      setUserName('User');
    }
  }, [navigate]);

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      setMessage({ type: 'warning', text: 'Please enter some text to convert to speech.' });
      return;
    }

    setIsGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Implement TTS API call
      // For now, show a placeholder message
      setTimeout(() => {
        setMessage({ 
          type: 'info', 
          text: 'TTS feature is coming soon! This will convert your text to natural speech.' 
        });
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error generating audio. Please try again.' });
      setIsGenerating(false);
    }
  };

  return (
    <div className="d-flex">
      <SideNavbar role={role} />
      <div className="flex-grow-1" style={{ marginLeft: '250px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container fluid className="py-4">
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold text-primary mb-2">
              <FaVolumeUp className="me-3" />
              Text to Speech
            </h1>
            <p className="lead text-muted">
              Convert your text into clear, natural voice
            </p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
                <Card.Body className="p-4">
                  {message.text && (
                    <Alert variant={message.type} className="mb-4">
                      {message.text}
                    </Alert>
                  )}

                  <Form>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-dark mb-3">
                        Enter Text to Convert
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste your text here... The system will convert it into natural speech."
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                          lineHeight: '1.6',
                          resize: 'vertical'
                        }}
                        disabled={isGenerating}
                      />
                      <Form.Text className="text-muted">
                        Maximum 1000 characters. Supports English, Hindi, and Telugu.
                      </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-3 mb-4">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleGenerateAudio}
                        disabled={isGenerating || !text.trim()}
                        style={{
                          borderRadius: '25px',
                          fontWeight: '600',
                          padding: '12px 30px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #7b1fa2, #ba68c8)'
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <FaVolumeUp className="me-2" />
                            Generate Speech
                          </>
                        )}
                      </Button>

                      {text.trim() && (
                        <Button
                          variant="outline-secondary"
                          size="lg"
                          onClick={() => setText('')}
                          style={{
                            borderRadius: '25px',
                            fontWeight: '600',
                            padding: '12px 20px'
                          }}
                        >
                          Clear Text
                        </Button>
                      )}
                    </div>

                    {/* Audio Player Section (Placeholder) */}
                    {audioUrl && (
                      <div className="mt-4 p-4 bg-light rounded-3">
                        <h6 className="fw-bold mb-3">Generated Audio</h6>
                        <div className="d-flex align-items-center gap-3">
                          <audio className="custom-audio" controls style={{ flex: 1 }}>
                            <source src={audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <Button variant="outline-primary" size="sm">
                            <FaDownload className="me-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>

              {/* Features Section */}
              <Row className="mt-5 g-4">
                <Col md={4}>
                  <div className="text-center p-3">
                    <div className="mb-3" style={{ fontSize: '2rem', color: '#7b1fa2' }}>🎯</div>
                    <h6 className="fw-bold">High Accuracy</h6>
                    <p className="text-muted small">Advanced AI ensures natural pronunciation</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3">
                    <div className="mb-3" style={{ fontSize: '2rem', color: '#7b1fa2' }}>🌍</div>
                    <h6 className="fw-bold">Multi-Language</h6>
                    <p className="text-muted small">Supports English, Hindi, and Telugu</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3">
                    <div className="mb-3" style={{ fontSize: '2rem', color: '#7b1fa2' }}>⚡</div>
                    <h6 className="fw-bold">Fast Processing</h6>
                    <p className="text-muted small">Quick conversion with instant playback</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TTSPage;
