/**
 * File Upload Component
 */
'use client';

import { useState, useRef } from 'react';
import styles from './FileUpload.module.css';

export default function FileUpload({ onFileSelect, maxSize = 30 }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError('');

    // Check allowed types: .txt, .zip, images, pdf
    const allowed = ['.txt', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const name = file.name.toLowerCase();
    const ok = allowed.some(ext => name.endsWith(ext));
    if (!ok) {
      setError('Please upload a .txt, .zip, image file, or PDF');
      return false;
    }

    // Check file size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size must be under ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const filesArray = Array.from(e.dataTransfer.files);
      // validate all
      const valid = filesArray.every(f => validateFile(f));
      if (valid) onFileSelect(filesArray);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length) {
      const filesArray = Array.from(e.target.files);
      const valid = filesArray.every(f => validateFile(f));
      if (valid) onFileSelect(filesArray);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
          <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.zip,image/*,.pdf,application/pdf"
          onChange={handleChange}
          multiple
          className={styles.fileInput}
        />
        
        <div className={styles.uploadIcon}>📁</div>
        <p className={styles.uploadText}>
          Drag and drop your WhatsApp chat export here
        </p>
        <p className={styles.uploadSubtext}>
          or click to browse
        </p>
        <p className={styles.uploadNote}>
          Accepts .txt, .zip (contains .txt + images), images, or PDFs. Max {maxSize}MB per file
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
