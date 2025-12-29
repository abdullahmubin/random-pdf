/**
 * Main Home Page - Upload and Convert Interface
 */
"use client"

import Link from 'next/link'
import styles from './page.module.css'
import FeatureVideo from '../components/FeatureVideo'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
}

export default function Home() {
  return (
    <motion.div className={styles.container} initial="hidden" animate="show" variants={container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <motion.section className={styles.hero} variants={item}>
            <div className={styles.heroInner}>
              <motion.div className={styles.heroText} variants={item}>
                <motion.h1 className={styles.title} variants={item}>Convert Chats & PDFs Instantly</motion.h1>
                <motion.p className={styles.subtitle} variants={item}>bottopdf makes it fast and simple: convert WhatsApp chats to PDFs, turn images into PDFs, or merge multiple PDFs. No installs, privacy-first.</motion.p>

                <motion.div style={{display:'flex',gap:12,justifyContent:'flex-start',marginTop:20}} variants={item}>
                  <Link href="/whatsapp" className="btn">WhatsApp → PDF</Link>
                  <Link href="/images" className="btn">Images → PDF</Link>
                  <Link href="/merge" className="btn">Merge PDFs</Link>
                </motion.div>
              </motion.div>

              <motion.div className={styles.heroImage} variants={item}>
                <img src="/marketing/marketing-hero.png" alt="bottopdf marketing" />
              </motion.div>
            </div>
          </motion.section>

          <motion.section className={styles.features} variants={item}>
            <motion.h2 className={styles.featuresTitle} variants={item}>Our Services</motion.h2>
            <div className={styles.featureGrid}>
              <motion.div className={styles.feature} variants={item}>
                <div className={styles.featureIcon}>💬</div>
                <h3>WhatsApp Chat to PDF</h3>
                <p>Upload your exported .txt chat and get a clean, court-ready PDF with timestamps and participants.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/whatsapp">Try it →</Link>
                  <Link href="/whatsapp/benefits">Learn more →</Link>
                </div>
              </motion.div>
              <motion.div className={styles.feature} variants={item}>
                <div className={styles.featureIcon}>🖼️</div>
                <h3>Images to PDF</h3>
                <p>Combine multiple images into a single PDF. Perfect for receipts, photos, or evidence bundles.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/images">Try it →</Link>
                  <Link href="/images/benefits">Learn more →</Link>
                </div>
              </motion.div>
              <motion.div className={styles.feature} variants={item}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Merge PDFs</h3>
                <p>Upload multiple PDFs and merge them into one ordered file — quick and private.</p>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/merge">Try it →</Link>
                  <Link href="/merge/benefits">Learn more →</Link>
                </div>
              </motion.div>
            </div>
          </motion.section>

            <motion.section className={styles.useCases} variants={item}>
              <motion.h2 className={styles.useCasesTitle} variants={item}>Why convert WhatsApp chats to PDF?</motion.h2>
              <div className={styles.videoCards}>
                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>💖</div>
                    <h4>Preserve Memories</h4>
                    <p>Save important conversations with loved ones in a neat, printable format — easy to share and keep for posterity.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/Couple%20Memories.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>

                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>⚖️</div>
                    <h4>Reliable Evidence</h4>
                    <p>Export chats with timestamps and sender names for clear, court-friendly documentation and record keeping.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/Court%20Order.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>

                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🗂️</div>
                    <h4>Organize & Backup</h4>
                    <p>Keep an offline, searchable archive of conversations and attachments for business, receipts, or personal backups.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/Cloud%20Data%20Recover.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>

                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🖼️</div>
                    <h4>Photo Albums & Receipts</h4>
                    <p>Convert image galleries or multiple receipts into a single PDF for easy sharing, printing, or filing.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/PDF%20file.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>

                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>📷</div>
                    <h4>Scan & Archive Documents</h4>
                    <p>Turn photos of documents into a neat PDF — ideal for invoices, IDs, or paperwork you need to keep.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/Recover%20Pdf.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>

                <motion.div className={styles.featureCard} variants={item}>
                  <div className={styles.featureText}>
                    <div className={styles.useCaseIcon}>🔗</div>
                    <h4>Merge & Consolidate</h4>
                    <p>Combine multiple PDFs (reports, contracts, statements) into one ordered file for submissions or record-keeping.</p>
                  </div>
                  <motion.div className={styles.featureVideo} variants={item}>
                    <FeatureVideo src="/feature/PDF.mp4" poster="/file.svg" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.section>

          <motion.section className={styles.instructions} variants={item}>
            <motion.h2>How It Works</motion.h2>
            <div className={styles.instructionSteps}>
              <motion.div className={styles.step} variants={item}><div className={styles.stepNumber}>1</div><div className={styles.stepContent}><h3>Choose a service</h3><p>Pick WhatsApp → PDF, Images → PDF or Merge PDFs.</p></div></motion.div>
              <motion.div className={styles.step} variants={item}><div className={styles.stepNumber}>2</div><div className={styles.stepContent}><h3>Upload files</h3><p>Drag & drop or browse to select your files. We support .txt, .zip, images, and PDFs.</p></div></motion.div>
              <motion.div className={styles.step} variants={item}><div className={styles.stepNumber}>3</div><div className={styles.stepContent}><h3>Download</h3><p>Get your processed PDF immediately — no account required for basic conversions.</p></div></motion.div>
            </div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  )
}

