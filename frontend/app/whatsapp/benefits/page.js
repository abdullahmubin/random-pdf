"use client";
import Link from 'next/link'
import styles from '../../page.module.css'
import FeatureVideo from '../../../components/FeatureVideo'

export default function WhatsAppBenefits(){
  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Why convert WhatsApp chats to PDF?</h1>
          <p className={styles.subtitle}>Create a clear, timestamped and printable record of your conversations.</p>
        </section>

        <section className={styles.useCases}>
          <div className={styles.useCaseGrid}>
            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>💖</div>
              <h4>Preserve Memories</h4>
              <p>Keep treasured conversations with family and friends in a format that will last.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>⚖️</div>
              <h4>Evidence & Legal Use</h4>
              <p>Export chats with timestamps and participant names for reliable documentation and legal needs.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>🔒</div>
              <h4>Privacy-first</h4>
              <p>Process locally in your browser or via secure endpoints; you control what is kept.</p>
            </div>
          </div>
        </section>

        <section style={{textAlign:'center',marginTop:24}}>
          <Link href="/whatsapp" className="btn">Convert a WhatsApp chat →</Link>
        </section>

        <section className={styles.videoCards} aria-label="Feature demos">
          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Preserve Memories</h3>
              <p>Save important conversations with loved ones in a neat, printable format — easy to share and keep for posterity.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/Couple%20Memories.mp4" poster="/file.svg" />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Reliable Evidence</h3>
              <p>Export chats with timestamps and sender names for clear, court-friendly documentation and record keeping.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/Court%20Order.mp4" poster="/file.svg" />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Organize & Backup</h3>
              <p>Keep an offline, searchable archive of conversations and attachments for business, receipts, or personal backups.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/Cloud%20Data%20Recover.mp4" poster="/file.svg" />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Photo Albums & Receipts</h3>
              <p>Convert image galleries or multiple receipts into a single PDF for easy sharing, printing, or filing.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/PDF%20file.mp4" poster="/file.svg" />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Scan & Archive Documents</h3>
              <p>Turn photos of documents into a neat PDF — ideal for invoices, IDs, or paperwork you need to keep.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/Recover%20Pdf.mp4" poster="/file.svg" />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureText}>
              <h3>Merge & Consolidate</h3>
              <p>Combine multiple PDFs (reports, contracts, statements) into one ordered file for submissions or record-keeping.</p>
            </div>
            <div className={styles.featureVideo}>
              <FeatureVideo src="/feature/PDF.mp4" poster="/file.svg" />
            </div>
          </div>
        </section>
      </div></main>
    </div>
  )
}
