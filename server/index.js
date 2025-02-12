require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'https://solana-builder.netlify.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Accept', 'Authorization'],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Add security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());

// Validate NowPayments API key middleware
const validateApiKey = (req, res, next) => {
  const apiKey = process.env.VITE_NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NowPayments API key not configured' });
  }
  req.apiKey = apiKey;
  next();
};

// GitHub OAuth endpoint
app.post('/api/github/oauth', async (req, res) => {
  try {
    const { code } = req.body;
    
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'Failed to exchange GitHub code' });
  }
});

// Create payment endpoint
app.post('/api/create-payment', validateApiKey, async (req, res) => {
  try {
    const { 
      price_amount,
      price_currency,
      pay_currency,
      order_id,
      order_description,
      success_url,
      cancel_url,
      ipn_callback_url
    } = req.body;

    console.log('Creating payment with data:', {
      price_amount,
      price_currency,
      pay_currency,
      order_id
    });

    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'x-api-key': req.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        price_amount,
        price_currency,
        pay_currency,
        order_id,
        order_description,
        success_url,
        cancel_url,
        ipn_callback_url
      })
    });

    const data = await response.json();
    console.log('NowPayments API response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Payment creation failed');
    }

    res.json(data);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment' });
  }
});

// IPN (Instant Payment Notification) webhook endpoint
app.post('/api/nowpayments/callback', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    console.log('Received payment notification:', event);
    
    switch (event.payment_status) {
      case 'finished':
        console.log('Payment successful:', event);
        break;
      case 'failed':
        console.log('Payment failed:', event);
        break;
      default:
        console.log('Payment status update:', event.payment_status);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NowPayments API URL: ${NOWPAYMENTS_API_URL}`);
});