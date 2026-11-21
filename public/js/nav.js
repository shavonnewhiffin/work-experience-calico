// Burger menu for small screens.
// The toggle button opens/closes the existing .nav-links list.
// CSS only hides the list once this script has run (the `nav-ready` class),
// so the links are still reachable if JavaScript fails to load.

const header = document.querySelector('.site-header');
const toggle = header && header.querySelector('.nav-toggle');

if (toggle) {
  header.classList.add('nav-ready');

  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('nav-open'));
  });

  // Close after picking a link (matters for same-page links like #playbook).
  header.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Close with the Escape key and return focus to the button.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset if the screen is resized back up to desktop width.
  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
