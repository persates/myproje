import React, { useState, useEffect } from 'react';
import './Notepad.css';

const Notepad = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // LocalStorage'dan notları yükle
    const savedNotes = localStorage.getItem('notepadContent');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    // Her değişiklikte otomatik kaydet
    localStorage.setItem('notepadContent', notes);
  }, [notes]);

  const handleChange = (e) => {
    setNotes(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="notepad-overlay" onClick={onClose}>
      <div className="notepad-container" onClick={(e) => e.stopPropagation()}>
        <div className="notepad-header">
          <h3>Not Defteri</h3>
          <button className="notepad-close" onClick={onClose}>×</button>
        </div>
        <textarea
          className="notepad-textarea"
          value={notes}
          onChange={handleChange}
          placeholder="Notlarınızı buraya yazın..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default Notepad;
