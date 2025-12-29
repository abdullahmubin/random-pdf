export default function HowTo() {
  return (
    <main style={{padding: '24px', maxWidth: 900, margin: '0 auto'}}>
      <h1>How to Export WhatsApp Chats</h1>
      <p>This guide shows how to export WhatsApp chats from Android and iPhone so you can convert them to PDF.</p>

      <h2>Android</h2>
      <ol>
        <li>Open the chat → tap the three dots → More → Export chat.</li>
        <li>Choose to export <strong>Without media</strong> or <strong>Include media</strong>.</li>
        <li>Save the .txt file and upload it to the converter.</li>
      </ol>

      <h2>iPhone</h2>
      <ol>
        <li>Open the chat → Contact Info → Export Chat.</li>
        <li>Choose to export with or without media.</li>
        <li>Transfer the .txt file to your PC and upload.</li>
      </ol>

      <p>After uploading, our converter preserves timestamps, sender names, Bengali text, and emojis in the generated PDF.</p>
    </main>
  );
}
