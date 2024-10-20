document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const exportButton = document.getElementById('exportTasksButton');
    const importButton = document.getElementById('importTasksButton');
    const fileInput = document.getElementById('fileInput');
    const settingsIcon = document.getElementById('settingsIcon');
    const taskControls = document.getElementById('taskControls');
    const versionNumber = 'v0.8.5'; // Update version as needed
    const githubRepo = 'https://github.com/runter-vom-mattenwagen/js-browsertasks';

    // Utility: Toggle visibility for a given element
    function toggleVisibility(element) {
        element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : 'none';
    }

    // Footer erzeugen
    let versionInfo = document.createElement('footer');
    versionInfo.id = 'versionInfo';
    versionInfo.style = 'margin-top: 20px; text-align: center; font-size: 0.9em; display: none; text-decoration: none;';
    versionInfo.innerHTML = `Version: ${versionNumber} | <a href=${githubRepo} target="_blank"">js-browsertasks</a>`;
    document.body.appendChild(versionInfo);

    // Event: Toggle task controls and version info on settings icon click
    settingsIcon.addEventListener('click', () => {
        toggleVisibility(taskControls);
        toggleVisibility(versionInfo);
    });

    // Event: Export tasks to JSON
    exportButton.addEventListener('click', () => {
        const tasksJSON = JSON.stringify(tasks, null, 2);
        const blob = new Blob([tasksJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Event: Import tasks from JSON
    importButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    location.reload(); // Reload page to reflect imported tasks
                } else {
                    alert('Invalid file. Please upload a valid JSON file.');
                }
            } catch (error) {
                alert('Error loading file.');
            }
        };
        reader.readAsText(file);
    });
});

