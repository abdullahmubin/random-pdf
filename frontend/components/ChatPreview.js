/**
 * Chat Preview Component
 * Shows preview of parsed chat messages with blur effect for free users
 */
'use client';

import styles from './ChatPreview.module.css';

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function (c) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[c];
  });
}

export default function ChatPreview({ preview, blurred, images = [], participants = [] }) {
  if (!preview || preview.length === 0) {
    return null;
  }

  // Build image map and sequential list for <Media omitted>
  const imageMap = {};
  images.forEach(img => {
    imageMap[img.name] = img.dataUrl;
  });
  let mediaIndex = 0;

  // Infer current user name: prefer last participant, falling back to null
  const currentUser = (participants && participants.length) ? participants[participants.length - 1] : null;

  const renderMessageContent = (text) => {
    if (!text) return null;

    // Replace explicit filenames with images if available
    let html = escapeHtml(text).replace(/\n/g, '<br>');
    html = html.replace(/([\w\-_.() ]+\.(?:jpg|jpeg|png|gif|webp))/gi, (match) => {
      const key = match.trim();
      const src = imageMap[key] || imageMap[key.replace(/\s/g, '')];
      if (src) return `<div class="preview-image"><img style="width: 100%; max-width: 320px; height: auto; max-height: 320px;" src="${src}" alt="${escapeHtml(key)}" /></div>`;
      return `<span class="attachment">${escapeHtml(key)}</span>`;
    });

    // Replace <Media omitted> sequentially
    const mediaPattern = /<Media omitted>|<media omitted>|\[Media omitted\]/gi;
    if (mediaPattern.test(text)) {
      html = html.replace(mediaPattern, () => {
        const img = images[mediaIndex];
        mediaIndex += 1;
        if (img && img.dataUrl) {
          return `<div class="preview-image"><img src="${img.dataUrl}" alt="${escapeHtml(img.name)}" /></div>`;
        }
        return `<span class="attachment">&lt;Media omitted&gt;</span>`;
      });
    }

    return <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Chat Preview</h3>

      {/* date pill for the first message's date (if available) */}
      {preview[0] && (
        <div className={styles.datePill}>{preview[0].date}</div>
      )}

      <div className={styles.messageList}>
        {preview.map((message, index) => {
          const isCurrentUser = currentUser && message.sender === currentUser;
          return (
            <div key={index} className={`${styles.message} ${isCurrentUser ? styles.right : styles.left}`}>
              <div className={styles.bubble}>
                <div className={styles.bubbleHeader}>
                  <div className={styles.sender}>{message.sender}</div>
                  <div className={styles.time}>{message.time}</div>
                </div>

                {renderMessageContent(message.message)}

                <div className={styles.msgMeta}>
                  {/* duplicate small time at end if needed or additional meta */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {blurred && (
        <div className={styles.blurOverlay}>
          <div className={styles.blurContent}>
            <p className={styles.blurText}>
              🔒 More messages available
            </p>
            <p className={styles.blurSubtext}>
              Sign in to preview and convert your full chat
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
