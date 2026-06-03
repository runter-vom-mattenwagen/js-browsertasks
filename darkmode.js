// Get the toggle button
const darkModeToggle = document.getElementById('darkModeToggle');

function updateDarkModeIcon() {
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Use localStorage preference if set, otherwise fall back to OS/browser preference
const storedPreference = localStorage.getItem('dark-mode');
const darkModeEnabled = storedPreference !== null
    ? storedPreference !== 'disabled'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
}

updateDarkModeIcon();

// Add an event listener to toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }

    updateDarkModeIcon();
});
