"use client";
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ChatPreview from '@/components/ChatPreview';
import { apiClient } from '@/lib/api';
import styles from '../page.module.css';
import { ScaleIcon, DocumentTextIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function WhatsAppPage(){
  const [files,setFiles] = useState(null);
  const [isProcessing,setIsProcessing] = useState(false);
  const [error,setError] = useState('');
  const [preview,setPreview] = useState([]);
  const [previewImages,setPreviewImages] = useState([]);
  const [previewParticipants,setPreviewParticipants] = useState([]);
  const [previewBlurred,setPreviewBlurred] = useState(false);

  const handleFileSelect = (selected)=>{
    const arr = Array.isArray(selected) ? selected : [selected];
    setFiles(arr);
    setError('');
  }

  // fetch a small preview for the selected files
  const fetchPreview = async (selectedFiles) => {
    try {
      setIsProcessing(true);
      const data = await apiClient.previewChat(selectedFiles);
      // expected shape: { preview: [...], images: [...], participants: [...], blurred: boolean }
      setPreview(data.preview || []);
      setPreviewImages(data.images || []);
      setPreviewParticipants(data.participants || []);
      setPreviewBlurred(!!data.blurred);
    } catch (e) {
      setError(e.message || 'Preview failed');
      setPreview([]);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleGenerate = async ()=>{
    if (!files || files.length===0) return setError('No files');
    setIsProcessing(true); setError('');
    try{
      const blob = await apiClient.generatePDF(files);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='chat_converted.pdf'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); document.body.removeChild(a);
      setFiles(null);
      alert('Done');
    }catch(e){ setError(e.message||e.toString()); }
    setIsProcessing(false);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>WhatsApp Chat to PDF</h1>
          <p className={styles.subtitle}>Upload your exported .txt or .zip and get a clean PDF.</p>
        </section>

          <section className={styles.uploadSection}>
          <FileUpload onFileSelect={(f)=>{ handleFileSelect(f); fetchPreview(f); }} maxSize={30} />
          {files && <div className={styles.fileInfo}><p className={styles.fileName}><DocumentTextIcon className={styles.fileIcon} aria-hidden="true" /> {files.map(f=>f.name).join(', ')}</p></div>}
          {/* Render chat preview when available */}
          {preview && preview.length>0 && (
            <div style={{marginTop:20}}>
              <ChatPreview preview={preview} blurred={previewBlurred} images={previewImages} participants={previewParticipants} />
            </div>
          )}
          {error && <div className={styles.error}>❌ {error}</div>}
            <div style={{marginTop:12}}>
            <button className={styles.generateButton} onClick={handleGenerate} disabled={isProcessing}>
              <ArrowDownTrayIcon className={styles.btnIcon} aria-hidden="true" />
              {isProcessing? 'Processing...':'Convert to PDF'}
            </button>
          </div>
        </section>

        <section className={styles.instructions}>
          <h2>How It Works</h2>
          <div className={styles.instructionSteps}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div className={styles.stepContent}><h3>Export from WhatsApp</h3><p>Open the chat in WhatsApp, choose "Export chat" and save the `.txt` (optionally with media in a `.zip`).</p></div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div className={styles.stepContent}><h3>Upload</h3><p>Use the uploader above to add your exported file. If you exported media, upload the ZIP so we can reference media attachments.</p></div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div className={styles.stepContent}><h3>Convert & Download</h3><p>Click "Convert to PDF" and download the formatted PDF — ready to print, archive, or share.</p></div></div>
          </div>
        </section>

        <section className={styles.whySection}>
          <h2 className={styles.useCasesTitle}>Why convert WhatsApp chats to PDF?</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyItem}>
              <div className={styles.whyIcon}><ScaleIcon aria-hidden="true"/></div>
              <h4>Reliable Evidence</h4>
              <p>Preserve sender names, timestamps and message order in a fixed, printable format suitable for record-keeping or legal use.</p>
            </div>

            <div className={styles.whyItem}>
              <div className={styles.whyIcon}><DocumentTextIcon aria-hidden="true"/></div>
              <h4>Readable & Printable</h4>
              <p>Get a clean, paginated PDF that’s easy to read, annotate, print or submit — without messy chat UI elements.</p>
            </div>

            <div className={styles.whyItem}>
              <div className={styles.whyIcon}><ArrowUpTrayIcon aria-hidden="true"/></div>
              <h4>Backup & Share</h4>
              <p>Exported PDFs are portable and easy to archive or share with others, even when the original chat or device is unavailable.</p>
            </div>
          </div>
        </section>

        <section className={styles.faq}>
          <h2>WhatsApp → PDF — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <div className={styles.question}>How do I upload my WhatsApp chat?</div>
              <div className={styles.answer}>Export the chat from WhatsApp (iOS or Android), then upload the `.txt` file or the exported `.zip` containing media using the uploader above.</div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.question}>Will my media (photos, videos) be included?</div>
              <div className={styles.answer}>If you export with media in a zip, attachments referenced in the chat will be linked or embedded where possible. Large media may be linked as placeholders.</div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.question}>Is my data secure?</div>
              <div className={styles.answer}>Yes — uploaded files are processed transiently and removed after conversion. We recommend reading our privacy policy for full details.</div>
            </div>
          </div>
        </section>
      </div></main>
    </div>
  )
}
