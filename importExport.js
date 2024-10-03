document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const exportButton = document.getElementById('exportTasksButton');
    const importButton = document.getElementById('importTasksButton');
    const fileInput = document.getElementById('fileInput');
    const settingsIcon = document.getElementById('settingsIcon');
    const taskControls = document.getElementById('taskControls');

    // Toggle visibility of import/export buttons when the settings icon is clicked
    settingsIcon.addEventListener('click', function() {
        if (taskControls.style.display === 'none') {
            taskControls.style.display = 'block';
        } else {
            taskControls.style.display = 'none';
        }
    });

    // Event listener for exporting tasks
    exportButton.addEventListener('click', exportTasks);
    
    // Event listener for triggering file input for importing tasks
    importButton.addEventListener('click', () => fileInput.click());
    
    // Event listener for reading file input and importing tasks
    fileInput.addEventListener('change', importTasks);

    function exportTasks() {
        const tasksJSON = JSON.stringify(tasks, null, 2);
        const blob = new Blob([tasksJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    location.reload(); // Refresh the page to reflect imported tasks
                } else {
                    alert('Ungültige Datei. Bitte eine gültige JSON-Datei hochladen.');
                }
            } catch (error) {
                alert('Fehler beim Laden der Datei.');
            }
        };
        reader.readAsText(file);
    }
});

