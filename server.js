import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const PROGRAMME_COURSES = Object.freeze([
  Object.freeze({ id: 'CS101', title: 'Foundations of Web Architecture', credits: 6 }),
  Object.freeze({ id: 'CS204', title: 'Asynchronous JavaScript & APIs', credits: 6 }),
  Object.freeze({ id: 'CS309', title: 'Distributed Systems & Cloud Deployment', credits: 8 }),
  Object.freeze({ id: 'CS315', title: 'Human-Computer Interaction', credits: 4 }),
]);

let requestsServed = 0;

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

const requestCounter = (req, res, next) => {
  requestsServed += 1;
  next();
};

app.use(requestLogger);
app.use(requestCounter);
app.use(express.static(publicDir));

app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Maya's server");
});

app.get('/robots.txt', (req, res) => {
  const robotsContent = [
    'User-agent: *',
    'Disallow: /api/admin',
    'Allow: /',
  ].join('\n');

  res.type('text/plain').send(robotsContent);
});

app.get('/old-page', (req, res) => {
  res.redirect(302, '/hello');
});

app.get('/api/courses', (req, res) => {
  res.json(PROGRAMME_COURSES);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent') || null,
    accept: req.get('Accept') || null,
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', (req, res) => {
  res.json({ requestsServed });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  return res.status(404).type('text/plain').send('404 - Page not found');
});

app.listen(PORT, () => {
  console.log(`Study Programme Server running at http://localhost:${PORT}`);
});