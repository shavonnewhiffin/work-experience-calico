const path = require('path');
const express = require('express');
const { sendToSupport } = require('./support');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.post('/contact', (req, res) => {
  const honeypot = (req.body.website || '').trim();
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();
  const elapsed = Number(req.body.elapsed);

  if(honeypot){
    res.json({ ok: true })
    return
  }

  // Too fast to be a person, or no timing (a bot). Pretend it worked, but don't email support.
  if (Number.isNaN(elapsed) || elapsed < 3000) {
    console.log(`[contact] dropped: submitted after ${req.body.elapsed ?? 'unknown'} ms`);
    return res.json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Please fill in your name, email and message.' });
  }


  sendToSupport({ name, email, message });
  res.json({ ok: true })
});

app.listen(PORT, () => {
  console.log(`Calico Media site running at http://localhost:${PORT}`);
});
