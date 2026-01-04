"use client";
import { useState, useEffect, useRef } from 'react';
import FileUpload from '@/components/FileUpload';
import { apiClient } from '@/lib/api';
import styles from '../page.module.css';

export default function MergePage(){
  const [files,setFiles] = useState(null);
  const [isGenerating,setIsGenerating] = useState(false);
  const [error,setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadPhase, setUploadPhase] = useState('idle');
  const processingTimerRef = useRef(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const handleFileSelect = (selected)=>{
    const arr = Array.isArray(selected) ? selected : [selected];
    setFiles(arr);
    setError('');
    try{ const size = (arr||[]).reduce((s,f)=>s+(f.size||0),0); setTotalSize(size);}catch(e){setTotalSize(0)}
  }

  const handleGenerate = async ()=>{
    if (!files || files.length===0) return setError('No files');
    setIsGenerating(true); setError(''); setUploadProgress(0); setUploadPhase('uploading');
    try{
      const blob = await apiClient.mergePDFWithProgress(files, (percent, loaded, total)=>{
        const pct = typeof percent === 'number' ? percent : 0;
        if (pct < 100) {
          setUploadProgress(pct);
        } else {
          setUploadPhase('processing');
          setUploadProgress(prev => (prev > 1 && prev < 99) ? prev : 1);
          if (!processingTimerRef.current) {
            processingTimerRef.current = setInterval(()=>{
              setUploadProgress(prev => { if (prev>=99) return prev; const inc = Math.random()<0.5?1:2; return Math.min(prev+inc,99); });
            }, 5000);
          }
        }
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='merged.pdf'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); document.body.removeChild(a);
      if (processingTimerRef.current) { clearInterval(processingTimerRef.current); processingTimerRef.current = null; }
      setUploadProgress(100); setUploadPhase('done');
      setFiles(null);
      if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null; }
      setToast({ type: 'success', message: 'Download started' });
      toastTimerRef.current = setTimeout(()=>{ setToast(null); toastTimerRef.current = null; }, 4500);
    }catch(e){ setError(e.message||e.toString()); }
    setIsGenerating(false);
  }

  useEffect(()=>{ return ()=>{ if (processingTimerRef.current) { clearInterval(processingTimerRef.current); processingTimerRef.current = null; } if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current=null } } },[])

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'; const thresh=1024; if (Math.abs(bytes)<thresh) return bytes+' B'; const units=['KB','MB','GB']; let u=-1; do{ bytes/=thresh; ++u } while(Math.abs(bytes)>=thresh && u<units.length-1); return bytes.toFixed(1)+' '+units[u];
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Merge PDFs</h1>
          <p className={styles.subtitle}>Upload multiple PDFs and merge them into one file.</p>
        </section>

        <section className={styles.uploadSection}>
          <FileUpload onFileSelect={handleFileSelect} maxSize={50} />
          {files && <div className={styles.fileInfo}><p className={styles.fileName}>📚 {files.map(f=>f.name).join(', ')}</p></div>}
          {error && <div className={styles.error}>❌ {error}</div>}
          <div style={{marginTop:12}}>
            <button className={styles.generateButton} onClick={handleGenerate} disabled={isGenerating}>{isGenerating? 'Processing...':'📥 Merge PDFs'}</button>
          </div>
        </section>
        {isGenerating && (
          <div className={styles.generateOverlay} aria-live="polite">
            <div className={styles.generateCard}>
              <div className={styles.generateSpinner} role="img" aria-hidden="true" />
              <h3>Converting to PDF…</h3>
              <p>{uploadPhase === 'uploading' ? 'Uploading your files — please wait.' : 'Your PDFs are being merged. This may take a few seconds.'}</p>
              <div style={{marginTop:12}}>
                <p className={styles.fileSize}><strong>Size:</strong> {formatBytes(totalSize)}</p>
                <div className={styles.progressBarWrapper} aria-hidden="false" style={{marginTop:8}}>
                  <div className={styles.progressBar} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={uploadProgress}>
                    <div className={styles.progressFill} style={{width: `${uploadProgress}%`}} />
                  </div>
                  <div style={{marginTop:6, fontSize:12, color:'#475569'}}>{uploadPhase === 'uploading' ? `${uploadProgress}% uploaded` : `${uploadProgress}% — Converting on server...`}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {toast && (
          <div className={styles.toastContainer} role="status" aria-live="polite">
            <div className={`${styles.toast} ${styles.toastSuccess}`}>
              <div className={styles.toastMessage}>{toast.message}</div>
              <button className={styles.toastClose} onClick={() => { if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null; } setToast(null); }} aria-label="Dismiss">×</button>
            </div>
          </div>
        )}
      </div></main>
    </div>
  )
}
