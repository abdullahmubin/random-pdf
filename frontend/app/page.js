/**
 * Main Home Page - Upload and Convert Interface
 */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import GoogleSignIn from '@/components/GoogleSignIn';
import FileUpload from '@/components/FileUpload';
import ChatPreview from '@/components/ChatPreview';
import { apiClient } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();
  const [files, setFiles] = useState(null);
  const [imageFiles, setImageFiles] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfFiles, setPdfFiles] = useState(null);

  // Register PWA service worker and ensure manifest is linked
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('ServiceWorker registered:', reg.scope);
        }).catch(err => {
          console.warn('ServiceWorker registration failed:', err);
        });
      });
    }

    if (typeof document !== 'undefined' && !document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);

      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#0f172a';
      document.head.appendChild(meta);
    }
  }, []);

  const handleFileSelect = async (selectedFiles) => {
    // normalize to array
    const arr = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    setFiles(arr);
    setPreview(null);
    setError('');

    // Get preview (works without authentication now)
    setIsProcessing(true);
    try {
      console.log('Requesting preview for files:', arr.map(f=>f.name));
      const previewData = await apiClient.previewChat(arr);
      console.log('Preview data received:', previewData);
      setPreview(previewData);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageFilesSelect = async (selected) => {
    const arr = Array.isArray(selected) ? selected : [selected];
    setImageFiles(arr);
  };

  const handlePdfFilesSelect = async (selected) => {
    const arr = Array.isArray(selected) ? selected : [selected];
    setPdfFiles(arr);
  };

  const handleGeneratePDF = async () => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      const pdfBlob = await apiClient.generatePDF(files);

      // Download PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      // choose a base name from first file or first .txt
      const txt = files.find(f => f.name.toLowerCase().endsWith('.txt')) || files[0];
      a.download = txt.name.replace('.txt', '').replace('.zip','') + '_converted.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset state
      setFiles(null);
      setPreview(null);
      alert('PDF generated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Convert WhatsApp Chats to PDF
          </h1>
          <p className={styles.subtitle}>
            Transform your WhatsApp chat exports into professional, court-ready PDFs instantly. No sign-in required!
          </p>
        </section>

        {/* Auth Section - Optional */}
        {!user && (
          <section className={styles.authSection}>
            <div className={styles.authCard}>
              <h2>🚀 Sign in for Premium Features</h2>
              <div className={styles.benefits}>
                <p>✅ Convert without signing in (with watermark)</p>
                <p>🎯 Sign in for:</p>
                <ul>
                  <li>✨ No watermark on PDFs</li>
                  <li>📦 Larger files (up to 10MB)</li>
                  <li>📜 Conversion history</li>
                </ul>
              </div>
              <GoogleSignIn />
            </div>
          </section>
        )}

        {/* Upload Section - Always visible */}
        <section className={styles.uploadSection}>
          <FileUpload
            onFileSelect={handleFileSelect}
            maxSize={30}
          />

            {files && (
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>
                  📄 {files.map(f=>f.name).join(', ')}
                </p>
                <p className={styles.fileSize}>
                  Size: {(files.reduce((s,f)=>s+f.size,0) / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                ❌ {error}
              </div>
            )}

            {isProcessing && (
              <div className={styles.processing}>
                <div className={styles.spinner}></div>
                <p>Processing your chat...</p>
              </div>
            )}
        </section>

        {/* Preview Section */}
        {preview && (
          <>
            <ChatPreview
              preview={preview.preview}
              blurred={preview.blurred}
              images={preview.images}
              participants={preview.participants}
            />

            <section className={styles.downloadSection}>
              <div className={styles.chatInfo}>
                <p><strong>Total Messages:</strong> {preview.total}</p>
                <p><strong>Date Range:</strong> {preview.dateRange.start} - {preview.dateRange.end}</p>
                {!user && (
                  <p className={styles.watermarkNote}>
                    ℹ️ PDF will include a watermark. Sign in for watermark-free PDFs.
                  </p>
                )}
                {user?.subscription === 'free' && (
                  <p className={styles.watermarkNote}>
                    ℹ️ Free tier includes watermark. Upgrade to Premium for watermark-free PDFs.
                  </p>
                )}
              </div>

              <button
                onClick={handleGeneratePDF}
                disabled={isProcessing}
                className={styles.generateButton}
              >
                {isProcessing ? 'Generating...' : '📥 Download PDF'}
              </button>
            </section>
          </>
        )}

        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.featuresTitle}>Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>No Sign-In Required</h3>
              <p>Start converting immediately. Just upload your chat and download the PDF.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>100% Private</h3>
              <p>Your chats are never stored. Processed in-memory and immediately discarded.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚖️</div>
              <h3>Court-Ready</h3>
              <p>Professional PDF format with timestamps, sender names, and clean formatting.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Universal Support</h3>
              <p>Works with both Android and iPhone WhatsApp export formats.</p>
            </div>
          </div>
        </section>

        {/* Images -> PDF Section */}
        <section className={styles.imagesToPdf}>
          <h2 className={styles.featuresTitle}>Images to PDF</h2>
          <p className={styles.subtitle}>Upload multiple images (JPG/PNG) and convert them into a single PDF.</p>

          <FileUpload onFileSelect={handleImageFilesSelect} maxSize={30} />

          {imageFiles && (
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>🖼️ {imageFiles.map(f=>f.name).join(', ')}</p>
              <p className={styles.fileSize}>Size: {(imageFiles.reduce((s,f)=>s+f.size,0) / 1024).toFixed(2)} KB</p>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button
              onClick={async () => {
                if (!imageFiles || imageFiles.length === 0) return setError('No images selected');
                setIsProcessing(true);
                setError('');
                try {
                  const pdfBlob = await apiClient.imagesToPDF(imageFiles);
                  const url = window.URL.createObjectURL(pdfBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'images.pdf';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  setImageFiles(null);
                  alert('PDF generated successfully!');
                } catch (err) {
                  setError(err.message || err.toString());
                } finally {
                  setIsProcessing(false);
                }
              }}
              className={styles.generateButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Generating...' : '📥 Convert Images to PDF'}
            </button>
          </div>
        </section>

        {/* Merge PDFs Section */}
        <section className={styles.imagesToPdf}>
          <h2 className={styles.featuresTitle}>Merge PDFs</h2>
          <p className={styles.subtitle}>Upload multiple PDF files and merge them into a single PDF.</p>

          <FileUpload onFileSelect={handlePdfFilesSelect} maxSize={50} />

          {pdfFiles && (
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>📚 {pdfFiles.map(f=>f.name).join(', ')}</p>
              <p className={styles.fileSize}>Size: {(pdfFiles.reduce((s,f)=>s+f.size,0) / 1024).toFixed(2)} KB</p>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button
              onClick={async () => {
                if (!pdfFiles || pdfFiles.length === 0) return setError('No PDFs selected');
                setIsProcessing(true);
                setError('');
                try {
                  const merged = await apiClient.mergePDF(pdfFiles);
                  const url = window.URL.createObjectURL(merged);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'merged.pdf';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  setPdfFiles(null);
                  alert('PDFs merged successfully!');
                } catch (err) {
                  setError(err.message || err.toString());
                } finally {
                  setIsProcessing(false);
                }
              }}
              className={styles.generateButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Merging...' : '📥 Merge PDFs'}
            </button>
          </div>
        </section>

        {/* Instructions */}
        <section className={styles.instructions}>
          <h2>How to Export WhatsApp Chats</h2>
          <div className={styles.instructionSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Open WhatsApp</h3>
                <p>Open the chat you want to export</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Access Options</h3>
                <p>Tap on the three dots (⋮) or contact name</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Export Chat</h3>
                <p>Select "Export chat" and choose "Without media"</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Save File</h3>
                <p>Save the .txt file and upload it here</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

