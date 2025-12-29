import styles from './Footer.module.css'

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>bottopdf.com</div>
          <div className={styles.copy}>© {new Date().getFullYear()} bottopdf. All rights reserved.</div>
        </div>
        <div className={styles.links}>
          <a href="/whatsapp">WhatsApp → PDF</a>
          <a href="/images">Images → PDF</a>
          <a href="/merge">Merge PDFs</a>
        </div>
      </div>
    </footer>
  )
}
