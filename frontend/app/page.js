/**
 * Main Home Page - Upload and Convert Interface
 */
import Link from 'next/link'
import styles from './page.module.css'
import FeatureVideo from '../components/FeatureVideo'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.heroText}>
                <h1 className={styles.title}>Convert Chats & PDFs Instantly</h1>
                <p className={styles.subtitle}>bottopdf makes it fast and simple: convert WhatsApp chats to PDFs, turn images into PDFs, or merge multiple PDFs. No installs, privacy-first.</p>

                <div style={{display:'flex',gap:12,justifyContent:'flex-start',marginTop:20}}>
                  <Link href="/whatsapp" className="btn">WhatsApp → PDF</Link>
                  <Link href="/images" className="btn">Images → PDF</Link>
                  <Link href="/merge" className="btn">Merge PDFs</Link>
                </div>
              </div>

              <div className={styles.heroImage}>
                <img src="/marketing/marketing-hero.png" alt="bottopdf marketing" />
              </div>
            </div>
          </section>

          <section className={styles.features}>
            <h2 className={styles.featuresTitle}>Our Services</h2>
            <div className={styles.featureGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>💬</div>
                <h3>WhatsApp Chat to PDF</h3>
                <p>Upload your exported .txt chat and get a clean, court-ready PDF with timestamps and participants.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/whatsapp">Try it →</Link>
                  <Link href="/whatsapp/benefits">Learn more →</Link>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🖼️</div>
                <h3>Images to PDF</h3>
                <p>Combine multiple images into a single PDF. Perfect for receipts, photos, or evidence bundles.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/images">Try it →</Link>
                  <Link href="/images/benefits">Learn more →</Link>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Merge PDFs</h3>
                <p>Upload multiple PDFs and merge them into one ordered file — quick and private.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/merge">Try it →</Link>
                  <Link href="/merge/benefits">Learn more →</Link>
                </div>
              </div>
            </div>
          </section>

            <section className={styles.useCases}>
              <h2 className={styles.useCasesTitle}>Why convert WhatsApp chats to PDF?</h2>
              <div className={styles.videoCards}>
                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>💖</div>
                    <h4>Preserve Memories</h4>
                    <p>Save important conversations with loved ones in a neat, printable format — easy to share and keep for posterity.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/Couple%20Memories.mp4" poster="/file.svg" />
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>⚖️</div>
                    <h4>Reliable Evidence</h4>
                    <p>Export chats with timestamps and sender names for clear, court-friendly documentation and record keeping.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/Court%20Order.mp4" poster="/file.svg" />
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🗂️</div>
                    <h4>Organize & Backup</h4>
                    <p>Keep an offline, searchable archive of conversations and attachments for business, receipts, or personal backups.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/Cloud%20Data%20Recover.mp4" poster="/file.svg" />
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🖼️</div>
                    <h4>Photo Albums & Receipts</h4>
                    <p>Convert image galleries or multiple receipts into a single PDF for easy sharing, printing, or filing.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/PDF%20file.mp4" poster="/file.svg" />
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>📷</div>
                    <h4>Scan & Archive Documents</h4>
                    <p>Turn photos of documents into a neat PDF — ideal for invoices, IDs, or paperwork you need to keep.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/Recover%20Pdf.mp4" poster="/file.svg" />
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🔗</div>
                    <h4>Merge & Consolidate</h4>
                    <p>Combine multiple PDFs (reports, contracts, statements) into one ordered file for submissions or record-keeping.</p>
                  </div>
                  <div className={styles.featureVideo}>
                    <FeatureVideo src="/feature/PDF.mp4" poster="/file.svg" />
                  </div>
                </div>
              </div>
            </section>

          <section className={styles.instructions}>
            <h2>How It Works</h2>
            <div className={styles.instructionSteps}>
              <div className={styles.step}><div className={styles.stepNumber}>1</div><div className={styles.stepContent}><h3>Choose a service</h3><p>Pick WhatsApp → PDF, Images → PDF or Merge PDFs.</p></div></div>
              <div className={styles.step}><div className={styles.stepNumber}>2</div><div className={styles.stepContent}><h3>Upload files</h3><p>Drag & drop or browse to select your files. We support .txt, .zip, images, and PDFs.</p></div></div>
              <div className={styles.step}><div className={styles.stepNumber}>3</div><div className={styles.stepContent}><h3>Download</h3><p>Get your processed PDF immediately — no account required for basic conversions.</p></div></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

