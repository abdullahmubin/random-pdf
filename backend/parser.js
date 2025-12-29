/**
 * WhatsApp Chat Parser
 * Supports both Android and iPhone export formats
 */

const ANDROID_PATTERN = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\]?\s*[-–]\s*([^:]+?):\s*(.*)$/i;
const IPHONE_PATTERN = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\]?\s*([^:]+?):\s*(.*)$/i;

export function parseWhatsAppChat(chatText) {
  const lines = chatText.split('\n');
  const messages = [];
  let currentMessage = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Try Android format first
    let match = line.match(ANDROID_PATTERN);
    if (!match) {
      // Try iPhone format
      match = line.match(IPHONE_PATTERN);
    }

    if (match) {
      // Save previous message if exists
      if (currentMessage) {
        messages.push(currentMessage);
      }

      // Start new message
      currentMessage = {
        date: match[1],
        time: match[2],
        sender: match[3].trim(),
        message: match[4].trim()
      };
    } else if (currentMessage) {
      // Continuation of previous message
      currentMessage.message += '\n' + line;
    }
  }

  // Add last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  return {
    messages,
    totalMessages: messages.length,
    participants: [...new Set(messages.map(m => m.sender))]
  };
}
