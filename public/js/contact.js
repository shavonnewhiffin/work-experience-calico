const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const honeypot = document.getElementById('honeypot');

// Runs once, when the page loads: remember the time in milliseconds.
const pageLoadedAt = Date.now();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (honeypot.value) {
    // If the honeypot field is filled, it's a bot submission. Do nothing.
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = Object.fromEntries(new FormData(form));

  // How long the visitor spent on the page before submitting.
  // Worked out here so both times come from the same (browser) clock.
  data.elapsed = Date.now() - pageLoadedAt;

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
});
