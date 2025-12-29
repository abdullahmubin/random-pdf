/**
 * PDF Generator using Puppeteer + HTML
 * Full Unicode support including Bengali, Arabic, Emojis, etc.
 */

import puppeteer from 'puppeteer';

export async function generatePDF(chatData, options = {}, assets = []) {
  const { includeWatermark = true, userEmail = '' } = options;

  // Generate HTML content
  const html = generateHTML(chatData, includeWatermark, userEmail, assets);

  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // Increase launch timeout to 10 minutes (600000ms) to avoid intermittent timeouts
    timeout: 600000
  });

  const page = await browser.newPage();
  // Increase page timeouts to 10 minutes
  page.setDefaultNavigationTimeout(600000);
  page.setDefaultTimeout(600000);
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 600000 });

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    },
    printBackground: true
  });

  await browser.close();

  return pdfBuffer;
}

export async function generatePDFfromImages(images = [], options = {}) {
  const { includeWatermark = false, userEmail = '' } = options;

  // Build simple HTML that places each image centered on its own page
  const imageBlocks = images.map(img => {
    const ext = img.name.split('.').pop().toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    const data = img.buffer.toString('base64');
    return `
      <div class="imgPage">
        <img src="data:${mime};base64,${data}" />
      </div>
    `;
  }).join('\n');

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      @page { size: A4; margin: 15mm; }
      html,body { height: 100%; margin:0; padding:0; }
      .imgPage { page-break-after: always; width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
      .imgPage img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius:8px; }
    </style>
  </head>
  <body>
    ${imageBlocks}
  </body>
  </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 600000 });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(600000);
  page.setDefaultTimeout(600000);
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 600000 });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' } });
  await browser.close();
  return pdfBuffer;
}

function generateHTML(chatData, includeWatermark, userEmail, assets = []) {
  const { messages, participants } = chatData;

  const participantsList = participants.join(', ');
  
  // Prepare a filename->buffer map for direct filename matches
  const assetsMap = {};
  for (const a of assets || []) {
    if (a && a.name) assetsMap[a.name] = a.buffer;
  }

  // Keep an index to map sequential <Media omitted> placeholders to images
  let mediaIndex = 0;

  // Infer current user for alignment (prefer last participant)
  const currentUser = (participants && participants.length) ? participants[participants.length - 1] : null;

  const messagesHTML = messages.map(msg => {
    // Raw content
    const raw = msg.message;
    let content = escapeHtml(raw).replace(/\n/g, '<br>');

    // Handle explicit image filenames first (e.g., IMG-1234.jpg)
    content = content.replace(/([\w\-_.() ]+\.(?:jpg|jpeg|png|gif|webp))/gi, (match) => {
      const filename = match.trim();
      const a = assetsMap[filename] || assetsMap[filename.replace(/\s/g, '')];
      if (a) {
        const base64 = a.toString('base64');
        const ext = filename.split('.').pop().toLowerCase();
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
        return `<div class="embedded-image"><img src="data:${mime};base64,${base64}" /></div>`;
      }
      return `<span class="attachment">${escapeHtml(filename)}</span>`;
    });

    // Then handle <Media omitted> placeholders by sequentially assigning images
    const mediaPattern = /<Media omitted>|<media omitted>|\[Media omitted\]/gi;
    if (mediaPattern.test(raw)) {
      // Replace each occurrence with next available image or a placeholder text
      content = content.replace(mediaPattern, () => {
        const a = assets[mediaIndex];
        mediaIndex += 1;
        if (a && a.buffer) {
          const base64 = a.buffer.toString('base64');
          const ext = a.name.split('.').pop().toLowerCase();
          const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
          return `<div class="embedded-image"><img src="data:${mime};base64,${base64}" /></div>`;
        }
        return `<span class="attachment">&lt;Media omitted&gt;</span>`;
      });
    }

    const isCurrentUser = currentUser && msg.sender === currentUser;

    return `
    <div class="message ${isCurrentUser ? 'right' : 'left'}">
      <div class="bubble">
        <div class="bubbleHeader">
          <div class="sender">${escapeHtml(msg.sender)}</div>
          <div class="time">${escapeHtml(msg.time)}</div>
        </div>
        <div class="message-content">${content}</div>
      </div>
    </div>
  `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Chat Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Noto+Sans+Bengali:wght@400;600&family=Noto+Emoji:wght@400&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Sans', 'Noto Sans Bengali', 'Noto Emoji', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
    }

    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }

    .title {
      font-size: 18pt;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .metadata {
      font-size: 9pt;
      color: #333;
      margin-top: 5px;
    }

    .message {
      margin-bottom: 12px;
      page-break-inside: avoid;
      display: flex;
    }

    .left { justify-content: flex-start; }
    .right { justify-content: flex-end; }

    .bubble {
      max-width: 78%;
      padding: 10px 12px;
      border-radius: 12px;
      background: #f7fafc;
      border-left: 3px solid #4299e1;
      box-shadow: 0 1px 0 rgba(0,0,0,0.02);
      font-size: 10pt;
      color: #000;
      overflow: hidden;
    }

    .right .bubble {
      background: #dff6dd;
      border-left: none;
      border-radius: 12px 12px 8px 12px;
    }

    .bubbleHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      font-size: 9pt;
      color: #555;
    }

    .sender { font-weight: 600; color: #2d3748; }
    .time { font-size: 8.5pt; color: #718096; }

    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 10pt;
      color: #000;
    }

    .embedded-image img {
      display: block;
      width: 100%;
      max-width: 320px;
      height: auto;
      max-height: 320px;
      margin-top: 8px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .datePill {
      display: inline-block;
      margin: 8px 0 12px 0;
      padding: 6px 12px;
      background: #edf2f7;
      color: #4a5568;
      border-radius: 999px;
      font-size: 9pt;
      text-align: center;
    }

    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
      font-size: 8pt;
      color: #666;
      text-align: center;
    }

    .watermark {
      color: #999;
      font-style: italic;
    }

    @page {
      margin: 20mm 15mm;
    }
  </style>
</head>
<body>
    <div class="header">
    <div class="title">WhatsApp Chat Export</div>
    <div class="metadata">
      <div><strong>Total Messages:</strong> ${messages.length}</div>
      <div><strong>Participants:</strong> ${escapeHtml(participantsList)}</div>
      <div><strong>Date Range:</strong> ${messages[0]?.date || 'N/A'} - ${messages[messages.length - 1]?.date || 'N/A'}</div>
    </div>
  </div>

  <div class="messages">
    <div class="datePill">${messages[0]?.date || ''}</div>
    ${messagesHTML}
  </div>

  <div class="footer">
    <div>Generated on ${new Date().toLocaleDateString()}</div>
    ${includeWatermark ? '<div class="watermark">Generated by WhatsApp Chat to PDF Converter</div>' : ''}
  </div>
</body>
</html>
  `;
}

function escapeHtml(text) {
  const div = { textContent: text };
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => escapeMap[char]);
}
