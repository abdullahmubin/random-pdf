"use client";
import Link from 'next/link'
import styles from '../../page.module.css'

export default function MergeBenefits(){
  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Why merge PDFs?</h1>
          <p className={styles.subtitle}>Combine multiple PDFs into one organized file for submissions, sharing, or archiving.</p>
        </section>

        <section className={styles.useCases}>
          <div className={styles.useCaseGrid}>
            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>🔗</div>
              <h4>Consolidate Reports</h4>
              <p>Join multiple reports or chapters into a single document for easy distribution.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>🧾</div>
              <h4>Organize Records</h4>
              <p>Merge invoices, statements, and receipts into one file for bookkeeping and record-keeping.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>📤</div>
              <h4>Submission Ready</h4>
              <p>Create a single PDF package for job applications, court filings, or client deliveries.</p>
            </div>
          </div>
        </section>

        <section style={{textAlign:'center',marginTop:24}}>
          <Link href="/merge" className="btn">Merge PDFs →</Link>
        </section>
      </div></main>
    </div>
  )
}
