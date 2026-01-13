import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { LANGUAGES, DEFAULT_LANG } from '../../config/Languages';

const DownloadModal = ({ show, onHide, onDownload }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANG);

  const handleDownload = () => {
    onDownload(selectedLanguage);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Language for Download</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Choose language</Form.Label>
          <Form.Select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleDownload}>Download</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DownloadModal;