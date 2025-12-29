"use client";
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { apiClient } from '@/lib/api';
import styles from '../page.module.css';

export default function ImagesPage(){
  const [files,setFiles] = useState(null);
  const [isProcessing,setIsProcessing] = useState(false);
  const [error,setError] = useState('');

  const handleFileSelect = (selected)=>{
    const arr = Array.isArray(selected) ? selected : [selected];
    setFiles(arr);
    setError('');
  }

  const handleGenerate = async ()=>{
    if (!files || files.length===0) return setError('No files');
    setIsProcessing(true); setError('');
    try{
      const blob = await apiClient.imagesToPDF(files);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='images.pdf'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); document.body.removeChild(a);
      setFiles(null);
      alert('Done');
    }catch(e){ setError(e.message||e.toString()); }
    setIsProcessing(false);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Images to PDF</h1>
          <p className={styles.subtitle}>Upload multiple images and download a single combined PDF.</p>
        </section>

        <section className={styles.uploadSection}>
          <FileUpload onFileSelect={handleFileSelect} maxSize={30} />
          {files && <div className={styles.fileInfo}><p className={styles.fileName}>🖼️ {files.map(f=>f.name).join(', ')}</p></div>}
          {error && <div className={styles.error}>❌ {error}</div>}
          <div style={{marginTop:12}}>
            <button className={styles.generateButton} onClick={handleGenerate} disabled={isProcessing}>{isProcessing? 'Processing...':'📥 Convert Images to PDF'}</button>
          </div>
        </section>
      </div></main>
    </div>
  )
}
