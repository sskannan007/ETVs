import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaVolumeUp, FaArrowRight } from 'react-icons/fa';
import SideNavbar from '../components/common/SideNavbar';
import './registeration.scss';

const MainHome = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage or API
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user name from token or API call
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setUserName(userInfo.name || 'User');
    } catch (error) {
      console.error('Error parsing user info:', error);
      setUserName('User');
    }
  }, [navigate]);

  const handleASRClick = () => {
    navigate('/home'); // Navigate to existing ASR Home page
  };

  const handleTTSClick = () => {
    // Navigate to TTS page (to be created later)
    navigate('/tts-home');
  };

  return (
    <div className="d-flex">
      <SideNavbar />
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
          <Row className="align-items-center flex-grow-1">
            <Col xl={6} lg={6} md={12} className="mb-4">
              <h1 className="display-4 fw-bold mb-3" style={{ lineHeight: 1.2 }}>
                Welcome, {userName || 'Creator'}
              </h1>
              <p className="lead text-light opacity-75 mb-4">
                Build multilingual voice and text experiences in seconds. Start with ASR for speech-to-text and TTS for text-to-speech.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="px-4 py-2 border-0"
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #38bdf8, #2563eb)'
                  }}
                  onClick={handleASRClick}
                >
                  Launch ASR <FaArrowRight className="ms-2" />
                </Button>
                <Button
                  size="lg"
                  className="px-4 py-2"
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'transparent',
                    color: '#fff'
                  }}
                  onClick={handleTTSClick}
                >
                  Launch TTS <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Col>
            <Col xl={6} lg={6} md={12}>
              <Row className="g-4">
                <Col sm={6}>
                  <Card
                    className="h-100 text-start"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff'
                    }}
                  >
                    <Card.Body>
                      <div
                        className="d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(56,189,248,0.15)'
                        }}
                      >
                        <FaMicrophone size={24} />
                      </div>
                      <h5 className="fw-semibold mb-2">ASR Voices</h5>
                      <p className="text-light opacity-75 mb-0" style={{ fontSize: '0.95rem' }}>
                        Enable accurate speech-to-text with multilingual support, tailored for production workloads.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card
                    className="h-100 text-start"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff'
                    }}
                  >
                    <Card.Body>
                      <div
                        className="d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(248,113,113,0.2)'
                        }}
                      >
                        <FaVolumeUp size={24} />
                      </div>
                      <h5 className="fw-semibold mb-2">TTS Studio</h5>
                      <p className="text-light opacity-75 mb-0" style={{ fontSize: '0.95rem' }}>
                        Convert your scripts to natural audio with customizable pitch, pace, voice, and language.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12}>
                  <Card
                    className="h-100 text-start"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff'
                    }}
                  >
                    <Card.Body>
                      <h6 className="text-uppercase opacity-75" style={{ letterSpacing: '0.08em' }}>
                        Platform Highlights
                      </h6>
                      <Row className="g-3 pt-2">
                        <Col xs={6}>
                          <div className="border border-light border-opacity-25 rounded-3 p-3">
                            <div className="fw-semibold fs-4">Multilingual</div>
                            <div className="text-light opacity-75">Languages</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="border border-light border-opacity-25 rounded-3 p-3">
                            <div className="fw-semibold fs-4">Support</div>
                            <div className="text-light opacity-75">User Friendly</div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
