"use client";
import Link from 'next/link'
import styles from '../../page.module.css'

export default function ImagesBenefits(){
  return (
    <div className={styles.container}>
      <main className={styles.main}><div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Why convert images to PDF?</h1>
          <p className={styles.subtitle}>Turn collections of photos or scanned documents into shareable, printable PDFs.</p>
        </section>

        <section className={styles.useCases}>
          <div className={styles.useCaseGrid}>
            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>🖼️</div>
              <h4>Photo Albums</h4>
              <p>Create a single, elegant PDF from multiple images for easy sharing or printing.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>🧾</div>
              <h4>Receipts & Invoices</h4>
              <p>Collect receipts and invoices into one PDF for expense reports or tax filing.</p>
            </div>

            <div className={styles.useCase}>
              <div className={styles.useCaseIcon}>📑</div>
              <h4>Document Scans</h4>
              <p>Convert photographed documents (IDs, contracts) into a neat PDF for archiving.</p>
            </div>
          </div>
        </section>

        <section style={{textAlign:'center',marginTop:24}}>
          <Link href="/images" className="btn">Convert images →</Link>
        </section>
      </div></main>
    </div>
  )
}
