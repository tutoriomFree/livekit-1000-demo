const express = require('express');
const path = require('path');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Token endpoint
app.get('/getToken', (req, res) => {
  const identity = req.query.identity || `user-${Math.floor(Math.random() * 10000)}`;
  const room = req.query.room || 'demo-room';
  const role = req.query.role || 'student';

  const at = new AccessToken(API_KEY, API_SECRET, { identity });

  at.addGrant({
    roomJoin: true,
    room,
    canPublish: role === 'teacher',
    canSubscribe: true,
  });

  res.json({ token: at.toJwt(), identity, room, url: LIVEKIT_URL });
});

app.listen(PORT, () => {
  console.log(`Demo server running: http://localhost:${PORT}`);
});
