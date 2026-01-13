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
import { Form, FloatingLabel, Row, Col, Button } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import SLogo from '../assets/Asr&tts.png';

const RegistrationPage = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [formInput, setFormInput] = useState({
      firstname: '',
      lastname: '',
      email: '',
      dob: '',
      contactno: '',
      place: '',
      city: '',
      state: '',
      pincode: '',
      gender: '',
      password: '',
      confirmPassword: '',
      checkbox: false,
    });
  
    // State for error messages
    const [formError, setFormError] = useState({});
  
    // State for input focus (used for FloatingLabel class management)
    const [isLabelsFocused, setIsLabelsFocused] = useState(false);
    const [isLastFocused, setIsLastFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPlaceFocused, setIsPlaceFocused] = useState(false);
    const [isCityFocused, setIsCityFocused] = useState(false);
    const [isStateFocused, setIsStateFocused] = useState(false);
    const [isPincodeFocused, setIsPincodeFocused] = useState(false);
    const [isPwdFocused, setIsPwdFocused] = useState(false);
    const [isConfirmPwdFocused, setIsConfirmPwdFocused] = useState(false);
  
    // Change handler
    const handleChanges = (e) => {
      const { name, value, type, checked } = e.target;
      setFormInput(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    // Phone input handler
    const handlePhoneChange = (value) => {
      setFormInput(prev => ({ ...prev, contactno: value }));
    };
  
    // Date formatting helper
    const formatToYYYYMMDD = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };
  
    // Date selection handler
    const handleDateSelect = (value) => {
      setFormInput(prev => ({ ...prev, dob: value }));
    };
  
    // Form validation
    const validateForm = () => {
      const errors = {};
      if (!formInput.firstname) errors.firstname = 'First name is required';
      if (!formInput.lastname) errors.lastname = 'Last name is required';
      if (!formInput.email) errors.email = 'Email is required';
      if (!formInput.dob) errors.dob = 'Date of birth is required';
      if (!formInput.contactno) errors.contactno = 'Phone number is required';
      if (!formInput.place) errors.place = 'Place is required';
      if (!formInput.city) errors.city = 'City is required';
      if (!formInput.state) errors.state = 'State is required';
      if (!formInput.pincode) errors.pincode = 'Pincode is required';
      if (!formInput.gender) errors.gender = 'Gender is required';
      if (!formInput.password) errors.password = 'Password is required';
      if (formInput.password !== formInput.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!formInput.checkbox) errors.checkbox = 'You must agree to the terms';
      return errors;
    };
  
    // Form submit handler
    const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormError(errors);
        return;
      }
  
      try {
        const response = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstname: formInput.firstname,
            lastname: formInput.lastname,
            email: formInput.email,
            dob: formInput.dob,
            contactno: formInput.contactno,
            place: formInput.place,
            city: formInput.city,
            state: formInput.state,
            pincode: formInput.pincode,
            gender: formInput.gender,
            password: formInput.password
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          alert('Registration successful! Please login.');
          navigate('/login');
        } else {
          alert(data.detail || 'Registration failed');
        }
      } catch (err) {
        alert('Network error. Please try again later.');
      }
    };
  
    const handleLoginRedirect = () => {
      navigate('/login');
    };

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 60%, #0f172a 100%)',
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
              style={{ width: 240, height: 240, objectFit: 'contain', marginBottom: '1.5rem' }}
            />
          </div>

          <div style={{ flex: 1, padding: '1rem 1.5rem', overflowY: 'auto', maxHeight: '90vh' }}>
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Create your account</h3>
              <p className="text-muted mb-0">Set up your profile to access ASR & TTS dashboards.</p>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FloatingLabel controlId="firstname" label="Firstname" className={`mb-3 ${isLabelsFocused || formInput.firstname ? 'focused' : ''}`}>
                            <Form.Control 
                                id="firstname" 
                                name="firstname"
                                placeholder="Firstname"
                                onFocus={() => setIsLabelsFocused(true)}
                                onBlur={() => setIsLabelsFocused(false)}
                                onChange={handleChanges}
                            />
                            {formError.firstname && <p className='error-message'>{formError.firstname}</p>}
                        </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel controlId="lastname" label="Lastname" className={`mb-3 ${isLastFocused || formInput.lastname ? 'focused' : ''}`}>
                        <Form.Control 
                            id="lastname" 
                            name="lastname"
                            placeholder="Lastname"
                            onFocus={() => setIsLastFocused(true)} // Set to true when input is focused
                            onBlur={() => setIsLastFocused(false)}
                            onChange={handleChanges} 
                        />
                        {formError.lastname && <p className='error-message'>{formError.lastname}</p>}
                    </FloatingLabel>
                    </Col>
                </Row>
                
                {/* // Conditionally add "focused" class */}
                <FloatingLabel controlId="email" label="Email" className={`mb-3 ${isEmailFocused || formInput.email ? 'focused' : ''}`}>
                    <Form.Control
                        id='email'
                        type="email"
                        name="email"
                        placeholder="Email"
                        onFocus={() => setIsEmailFocused(true)} // Set to true when input is focused
                        onBlur={() => setIsEmailFocused(false)}
                        onChange={handleChanges}
                    />
                    {formError.email && <p className="error-message">{formError.email}</p>}
                </FloatingLabel>
                <Row className="mb-3">
                    {/* Date of Birth Input Field */}
                    <Col md={6}>
                        <div className="dob-label dob-parent-1">Date of Birth</div>
                            <Form.Control 
                                id="dob-picker"
                                type="date"
                                name="dob"
                                aria-label="Date of Birth"
                                style={{ height: '45px' }}
                                value={formInput.dob ? formatToYYYYMMDD(formInput.dob) : ""}
                                onChange={(e) => handleDateSelect(e.target.value)}
                                onClick={(e) => e.target.showPicker()}
                            />
                        {formError.dob && <p className='error-message'>{formError.dob}</p>}
                    </Col>

                    <Col md={6}>
                        <div className="phone-input-container reg-phone-input">
                            <div className="phone-input-label dob-parent-1">Phone Number</div>
                            <PhoneInput
                                country={"in"}
                                value={formInput.contactno}
                                onChange={handlePhoneChange}
                                inputProps={{
                                    name: "contactno",
                                    required: true,
                                    autoFocus: false,
                                    className: "form-control"
                                }}
                                containerStyle={{ width: "100%" }}
                                inputStyle={{
                                    width: "100%",
                                    paddingLeft: "50px",
                                    height: "45px",
                                    paddingTop: "20px"
                                }}
                            />
                        </div>
                        {formError.contactno && <p className='error-message'>{formError.contactno}</p>}
                    </Col>
                </Row>
                <Row className="">
                    <Col>
                        <FloatingLabel controlId="place" label="Place" className={`mb-3 ${isPlaceFocused || formInput.place ? 'focused' : ''}`}>
                            <Form.Control className='extra-fields' id='place' type='place' name="place" placeholder="Place" onFocus={() => setIsPlaceFocused(true)} // Set to true when input is focused
                                onBlur={() => setIsPlaceFocused(false)} onChange={handleChanges} />
                            {formError.place && <p className='error-message'>{formError.place}</p>}
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="city" label="City" className={`mb-3 ${isCityFocused || formInput.city ? 'focused' : ''}`}>
                            <Form.Control className='extra-fields' id='city' type='city' name="city" placeholder="City" onFocus={() => setIsCityFocused(true)} // Set to true when input is focused
                                onBlur={() => setIsCityFocused(false)} onChange={handleChanges} />
                            {formError.city && <p className='error-message'>{formError.city}</p>}
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="">
                    <Col>
                        <FloatingLabel controlId="state" label="State" className={`mb-3 ${isStateFocused || formInput.state ? 'focused' : ''}`}>
                            <Form.Control className='extra-fields' type='state' name="state" placeholder="State" onFocus={() => setIsStateFocused(true)} // Set to true when input is focused
                                onBlur={() => setIsStateFocused(false)} onChange={handleChanges} />
                            {formError.state && <p className='error-message'>{formError.state}</p>}
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="pincode" label="Pincode" className={`mb-3 ${isPincodeFocused || formInput.pincode ? 'focused' : ''}`}>
                            <Form.Control className='extra-fields' type='pincode' name="pincode" placeholder="Pincode" onFocus={() => setIsPincodeFocused(true)} // Set to true when input is focused
                                onBlur={() => setIsPincodeFocused(false)} onChange={handleChanges} />
                            {formError.pincode && <p className='error-message'>{formError.pincode}</p>}
                        </FloatingLabel>
                    </Col>
                </Row>
                <Form.Select name="gender" className='mb-3 extra-fields gender-field' onChange={handleChanges}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </Form.Select>
                {formError.gender && <p className='error-message'>{formError.gender}</p>}

                <FloatingLabel controlId="state" label="Password" className={`mb-3 ${isPwdFocused || formInput.state ? 'focused' : ''}`}>
                    <Form.Control 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="Password"
                        onFocus={() => setIsPwdFocused(true)} // Set to true when input is focused
                        onBlur={() => setIsPwdFocused(false)}
                        onChange={handleChanges}
                    />
                    {formError.password && <p className='error-message'>{formError.password}</p>}
                </FloatingLabel>

                <FloatingLabel controlId="state" label="Confirm Password" className={`mb-3 ${isConfirmPwdFocused || formInput.state ? 'focused' : ''}`}>
                    <Form.Control 
                        id="confirmPassword" 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password"
                        onFocus={() => setIsConfirmPwdFocused(true)} // Set to true when input is focused
                        onBlur={() => setIsConfirmPwdFocused(false)}
                        onChange={handleChanges}
                    />
                    {formError.confirmPassword && <p className='error-message'>{formError.confirmPassword}</p>}
                </FloatingLabel>

                <div className='d-flex terms'>
                    <Form.Check 
                        type="checkbox" 
                        id="checkbox" 
                        name="checkbox"
                        onChange={handleChanges} 
                    />
                    <span className='d-block main-check ms-2'>
                        I accept the <span>Terms of Use</span> &{' '}
                        <span
                            className='privacy-clr'
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/privacy-policy')}
                        >
                            Privacy Policy
                        </span>
                    </span>
                    {formError.checkbox && <p className='error-message checkbox-error'>{formError.checkbox}</p>}
                </div>

                <Button type="submit" variant="primary" className='mt-3 w-100' style={{ background: 'linear-gradient(45deg, rgb(49, 46, 129) 0%, rgb(30, 27, 75) 60%, rgb(34 48 80) 100%)', border: 'none', padding: '0.75rem', fontWeight: 600 }}>Register Now</Button>
            </Form>

            {/* Already have an account? */}
            <div className="text-center mt-3 login-button-parent">
                <span>Already have an account? </span>
                <span 
                className="cursor-pointer already-login"
                onClick={handleLoginRedirect}
                style={{ cursor: 'pointer', color: '#133a60' }}
                >
                Login
                </span>
            </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
