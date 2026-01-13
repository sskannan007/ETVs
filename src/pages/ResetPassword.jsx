import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Container, FloatingLabel, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './registeration.scss';
import SLogo from '../assets/Asr&tts.png';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setError('');
    } else {
      setError('No reset token found in URL');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please enter both passwords');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.detail || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid login-wrapper d-flex">
          <div className="right-panel d-flex align-items-center justify-content-center">
            <div className="form-container sign-in">
              <Container className='pt-3 register-container'>
                <Alert variant="danger">
                  Invalid reset link. Please request a new password reset.
                </Alert>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container-fluid login-wrapper d-flex">
        {/* Left Panel (Branding) */}
        <div className="left-panel d-flex flex-column align-items-center justify-content-center">
          <img src={SLogo} alt="Logo" style={{ width: 240, marginBottom: 20 }} />
          <h2 className="mb-3">Welcome Back!</h2>
          <p className="text-center px-3">Reset your password to regain access to your account.</p>
        </div>
        {/* Right Panel (Reset Form) */}
        <div className="right-panel d-flex align-items-center justify-content-center">
          <div className="form-container sign-in">
            <Container className='pt-3 register-container'>
              <div className="img-title mb-4">
                <h3>Reset Password</h3>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {token && (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    {/* <p className="text-muted">Resetting password for: <strong>{token}</strong></p> */}
                  </div>
                  
                  <div className="mb-3 position-relative">
                    <FloatingLabel controlId="newPassword" label="New Password">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </FloatingLabel>
                  </div>
                  <div className="mb-3 position-relative">
                    <FloatingLabel controlId="confirmPassword" label="Confirm Password">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      {/* Single eye icon for both fields */}
                      <span
                        className="password-toggle-icon"
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 2
                        }}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </FloatingLabel>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className='mt-3 w-100'
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </Form>
              )}
              
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 