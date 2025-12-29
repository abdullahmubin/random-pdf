import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parseWhatsAppChat } from './parser.js';
import { generatePDF } from './pdfGenerator.js';
import { extractZipFiles, pickTextFileFromFiles, pickImageFilesFromFiles } from './zipHandler.js';
import { mergePDFFiles } from './pdfUtils.js';
import { generatePDFfromImages } from './pdfGenerator.js';
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running with puppeteer' });
});

// Parse chat for preview
app.post('/api/preview', upload.any(), async (req, res) => {
  try {
    if ((!req.file && (!req.files || req.files.length === 0))) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let chatText = null;
    let imagesList = [];

    // If a single file was uploaded as .txt
    if (req.file) {
      chatText = req.file.buffer.toString('utf-8');
    }

    // If multer used upload.any(), check req.files
    if (!chatText && req.files && req.files.length) {
      // Look for .txt or a zip
      // If a zip present, extract and use .txt inside
      const zipFile = req.files.find(f => f.originalname.toLowerCase().endsWith('.zip'));
      const txtFile = req.files.find(f => f.originalname.toLowerCase().endsWith('.txt'));

      if (txtFile) {
        chatText = txtFile.buffer.toString('utf-8');
      } else if (zipFile) {
        const filesMap = await extractZipFiles(zipFile.buffer);
        const picked = pickTextFileFromFiles(filesMap);
        if (picked) chatText = picked.buffer.toString('utf-8');
        imagesList = pickImageFilesFromFiles(filesMap);
      }
    }

    if (!chatText) return res.status(400).json({ error: 'No .txt chat file found in upload' });
    const chatData = parseWhatsAppChat(chatText);

    // Format response to match frontend expectations
    const response = {
      preview: chatData.messages.slice(0, 10), // First 10 messages
      total: chatData.totalMessages,
      participants: chatData.participants,
      dateRange: {
        start: chatData.messages[0]?.date || 'N/A',
        end: chatData.messages[chatData.messages.length - 1]?.date || 'N/A'
      },
      images: imagesList.map(a => {
        const ext = a.name.split('.').pop().toLowerCase();
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
        return { name: a.name, dataUrl: `data:${mime};base64,${a.buffer.toString('base64')}` };
      }),
      blurred: false // No authentication needed anymore
    };

    res.json(response);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF
app.post('/api/generate-pdf', upload.any(), async (req, res) => {
  try {
    if ((!req.file && (!req.files || req.files.length === 0))) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let chatText = null;
    let imagesList = [];

    if (req.file) {
      chatText = req.file.buffer.toString('utf-8');
    }

    if (req.files && req.files.length) {
      const zipFile = req.files.find(f => f.originalname.toLowerCase().endsWith('.zip'));
      const txtFile = req.files.find(f => f.originalname.toLowerCase().endsWith('.txt'));

      if (txtFile) {
        chatText = txtFile.buffer.toString('utf-8');
      }

      if (zipFile) {
        const filesMap = await extractZipFiles(zipFile.buffer);
        const picked = pickTextFileFromFiles(filesMap);
        if (picked) chatText = picked.buffer.toString('utf-8');
        imagesList = pickImageFilesFromFiles(filesMap); // array of {name, buffer}
      }

      // Also pick up any image files uploaded alongside
      for (const f of req.files) {
        const lower = f.originalname.toLowerCase();
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || lower.endsWith('.webp')) {
          imagesList.push({ name: f.originalname, buffer: f.buffer });
        }
      }
    }

    if (!chatText) return res.status(400).json({ error: 'No .txt chat file found in upload' });

    const chatData = parseWhatsAppChat(chatText);

    const options = {
      includeWatermark: req.body.includeWatermark !== 'false',
      userEmail: req.body.userEmail || ''
    };

    const pdfBuffer = await generatePDF(chatData, options, imagesList);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="whatsapp-chat.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Images -> PDF
app.post('/api/images-to-pdf', upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    // collect image assets in order
    const images = [];
    for (const f of req.files) {
      const lower = f.originalname.toLowerCase();
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || lower.endsWith('.webp')) {
        images.push({ name: f.originalname, buffer: f.buffer });
      }
    }

    if (images.length === 0) return res.status(400).json({ error: 'No supported image types found' });

    const options = { includeWatermark: false };
    // generate PDF from images
    const pdfBuffer = await generatePDFfromImages(images, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="images.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Images to PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Merge PDFs
app.post('/api/merge-pdf', upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const pdfBuffers = [];
    for (const f of req.files) {
      if (f.originalname.toLowerCase().endsWith('.pdf')) {
        pdfBuffers.push(f.buffer);
      }
    }

    if (pdfBuffers.length === 0) return res.status(400).json({ error: 'No PDF files found in upload' });

    const merged = await mergePDFFiles(pdfBuffers);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.send(merged);
  } catch (error) {
    console.error('Merge PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📄 With puppeteer support for Bengali/Unicode`);
});
