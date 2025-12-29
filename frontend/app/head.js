export default function Head() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Convert your WhatsApp chat exports into professional, court-ready PDFs — supports Bengali and emojis." />
      <meta name="theme-color" content="#0f172a" />

      {/* Open Graph */}
      <meta property="og:title" content="WhatsApp Chat to PDF Converter" />
      <meta property="og:description" content="Convert WhatsApp chats (including Bengali & emojis) into court-ready PDFs." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="WhatsApp Chat to PDF Converter" />
      <meta name="twitter:description" content="Convert WhatsApp chats (including Bengali & emojis) into court-ready PDFs." />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Structured data - WebApplication */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "WhatsApp Chat to PDF Converter",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "description": "Convert WhatsApp chat exports into professional PDFs with Bengali and emoji support.",
      }) }} />

      {/* Google Analytics (GA4) */}
      {GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');` }} />
        </>
      )}
    </>
  );
}
