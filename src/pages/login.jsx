import React from 'react';
import './registeration.scss';
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FloatingLabel, Button, Modal } from 'react-bootstrap';
import SLogo from '../assets/Asr&tts.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');


  const handleSignUp = () => {
    navigate('/registration');
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setFormInput({
      ...formInput,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const [formInput, setFormInput] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formError, setFormError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!formInput.email) errors.email = "Enter a valid email";
    if (!formInput.password) errors.password = "Enter a valid password";

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setErrorMessage('');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', formInput.email);
      formData.append('password', formInput.password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);

        // Fetch user info to store name and role
        try {
          const userResponse = await fetch('http://localhost:8000/users/me', {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            localStorage.setItem('userInfo', JSON.stringify({
              name: `${userData.firstname} ${userData.lastname}`.trim(),
              role: userData.role,
              email: userData.email
            }));
          }
        } catch (err) {
          console.error('Failed to fetch user info:', err);
        }

        navigate('/'); // Changed from /mainpage to / as per App.jsx routes
      } else {
        setErrorMessage(data.detail || 'Login failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage('Network error. Please try again later.');
    }
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };
  const handleForgotCancel = () => {
    setShowForgotModal(false);
    setForgotEmail(''); setForgotError(''); setForgotSuccess(''); setIsLoading(false);
  };

  const handleSendResetLink = async () => {
    if (!forgotEmail) {
      setForgotError('Enter your email');
      return;
    }
    setIsLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await fetch('http://localhost:8000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotSuccess(data.message || 'Password reset link sent to your email');
        setTimeout(() => { handleForgotCancel(); }, 3000);
      } else {
        setForgotError(data.detail || 'Failed to send reset link');
      }
    } catch (err) {
      setForgotError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: 'min(920px, 100%)',
          borderRadius: '28px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: 'rgb(147 147 147 / 45%) 0px 40px 120px',
          background: '#fff'
        }}
      >
        <div
          style={{
            flex: '0 0 50%',
            background: 'linear-gradient(316deg, rgb(49, 46, 129) 0%, rgb(30, 27, 75) 60%, rgb(15, 23, 42) 100%)',
            color: '#fff',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <img
            src={SLogo}
            alt="App Logo"
            style={{ width: 240, height: 240, objectFit: 'contain', marginBottom: '2rem' }}
          />
          {/* <h2 className="fw-bold mb-3" style={{ lineHeight: 1.2 }}>
            Welcome back to ETV Text-to-Speech
          </h2>
          <p className="opacity-75" style={{ maxWidth: 260 }}>
            Sign in to continue generating multilingual voice content in seconds.
          </p> */}
        </div>
        <div style={{ flex: 1, padding: '3rem 3.5rem' }}>
          <div className="mb-4">
            <h3 className="fw-bold mb-1">Login</h3>
            <p className="text-muted mb-0">Enter your credentials to access your workspace.</p>
          </div>
          {errorMessage && <p className="error-message text-center">{errorMessage}</p>}
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="email" label="Email" className={`mb-4 ${isUsernameFocused || formInput.email ? 'focused' : ''}`}>
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                value={formInput.email}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChange={handleChanges}
              />
              {formError.email && <p className="error-message">{formError.email}</p>}
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password" className={`mb-3 ${isPasswordFocused || formInput.password ? 'focused' : ''}`}>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                value={formInput.password}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChange={handleChanges}
              />
              {formError.password && <p className="error-message">{formError.password}</p>}
            </FloatingLabel>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                label="Remember Me"
                checked={formInput.rememberMe}
                onChange={handleChanges}
              />
              <span
                className="forgot"
                style={{ cursor: 'pointer', color: '#133a60', fontWeight: 600 }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(45deg, rgb(49, 46, 129) 0%, rgb(30, 27, 75) 60%, rgb(34 48 80) 100%)',
                padding: '0.75rem',
                fontWeight: 600
              }}
            >
              Login
            </Button>

            <div className="text-center mt-4">
              <p className="login-button-parent">
                New User?{' '}
                <span
                  className="already-login"
                  style={{ cursor: 'pointer', color: '#133a60', fontWeight: 600 }}
                  onClick={handleSignUp}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </Form>
        </div>
      </div>
      <Modal show={showForgotModal} onHide={handleForgotCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotError && <div className="text-danger mb-2">{forgotError}</div>}
          {forgotSuccess && <div className="text-success mb-2">{forgotSuccess}</div>}

          <p className="text-muted mb-3">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <FloatingLabel controlId="forgotEmail" label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              disabled={isLoading}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleForgotCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendResetLink}
            disabled={isLoading || !forgotEmail}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;