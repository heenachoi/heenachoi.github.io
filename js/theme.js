/*
  Theme Toggle — shared across all pages
  Persists preference in localStorage
*/
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Add hover effect for custom cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        toggle.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        toggle.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    }

    toggle.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        if (next === 'light') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', 'dark');
        }

        localStorage.setItem('theme', next === 'light' ? '' : 'dark');
    });
});
