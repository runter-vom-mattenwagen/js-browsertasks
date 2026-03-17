// Get the toggle button
const darkModeToggle = document.getElementById('darkModeToggle');

function updateDarkModeIcon() {
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Default to dark mode unless user explicitly disabled it
const darkModeEnabled = localStorage.getItem('dark-mode') !== 'disabled';

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
