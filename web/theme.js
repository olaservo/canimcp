// Inlined into every page's <head> by scripts/build-site.js, so the stored theme applies before first paint.
(() => {
  const modes = ['system', 'light', 'dark'];
  let mode = 'system';
  try { mode = localStorage.getItem('theme') || mode; } catch {}
  if (!modes.includes(mode)) mode = 'system';
  const apply = () => {
    if (mode === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = mode;
    const button = document.getElementById('theme');
    if (button) { button.textContent = `Theme: ${mode}`; button.hidden = false; }
  };
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', (e) => {
    if (e.target.id !== 'theme') return;
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    try {
      if (mode === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', mode);
    } catch {}
    apply();
  });
})();
