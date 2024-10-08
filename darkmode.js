// Get the toggle button
const darkModeToggle = document.getElementById('darkModeToggle');

// Check if dark mode was enabled previously (saved in localStorage)
const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';

// If dark mode was enabled, apply it on page load
if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
}

// Add an event listener to toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');  // Toggle dark mode class

    // Save the current mode in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});
