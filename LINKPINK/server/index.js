// LINKPINK — Backend Server (Node.js / Express)
// This runs as a separate service (Railway, Render, etc.)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
});
app.use('/api/', limiter);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// --- AI Processing Endpoint ---
app.post('/api/ai/process', async (req, res) => {
  try {
    const { save_id, url, text, type } = req.body;

    // TODO: Implement actual AI pipeline
    // 1. Fetch content from URL if provided
    // 2. Run OCR (Google ML Kit) for images
    // 3. Run Whisper transcription for audio/video
    // 4. Generate summary via OpenAI
    // 5. Generate embeddings via OpenAI
    // 6. Classify content

    // Mock response for now
    const result = {
      title: `Processed: ${type}`,
      summary: 'AI-generated summary will appear here after pipeline integration.',
      classification: {
        main_category: 'General',
        subcategories: ['Uncategorized'],
        confidence: 0.5,
      },
      tags: ['saved', type],
      embedding: new Array(1536).fill(0), // OpenAI ada-002 dimensions
    };

    res.json(result);
  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// --- Embedding Generation ---
app.post('/api/ai/embed', async (req, res) => {
  try {
    const { text } = req.body;

    // TODO: Call OpenAI embeddings API
    // const response = await openai.embeddings.create({
    //   model: 'text-embedding-ada-002',
    //   input: text,
    // });

    const embedding = new Array(1536).fill(0);
    res.json({ embedding });
  } catch (error) {
    console.error('Embedding error:', error);
    res.status(500).json({ error: 'Embedding generation failed' });
  }
});

// --- Semantic Search ---
app.post('/api/search/semantic', async (req, res) => {
  try {
    const { query, filters, limit = 20 } = req.body;

    // TODO: 
    // 1. Generate query embedding
    // 2. Search pgvector in Supabase
    // 3. Apply filters
    // 4. Return ranked results

    res.json({ results: [] });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// --- Instagram Bot Webhook ---
app.post('/api/webhooks/instagram', async (req, res) => {
  try {
    const { entry } = req.body;
    
    // TODO: Process Instagram webhook
    // 1. Extract shared content
    // 2. Queue for AI processing (BullMQ)
    // 3. Notify user via push notification

    res.status(200).send('OK');
  } catch (error) {
    console.error('Instagram webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook verification for Instagram
app.get('/api/webhooks/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔗 LINKPINK Backend running on port ${PORT}`);
});
