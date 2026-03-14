document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let categories = new Set(tasks.map(task => task.category));

    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const addTaskButton = document.getElementById('addTaskButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const taskError = document.getElementById('taskError');
    const presets = ['🛒', '🩺', '💻', '💰'];

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') addTask();
    });

    categoryInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') addTask();
    });

    categoryDropdown.addEventListener('change', function() {
        categoryInput.value = categoryDropdown.value;
        taskInput.focus();
    });

    categoryFilter.addEventListener('change', function() {
        if (categoryFilter.value === 'all') {
            categoryInput.value = '';
        } else {
            categoryInput.value = categoryFilter.value;
        }
        renderTasks();
    });

    function showError(msg) {
        taskError.textContent = msg;
        taskError.style.display = 'inline';
        setTimeout(() => { taskError.style.display = 'none'; }, 3000);
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const categoryText = categoryInput.value.trim();

        if (taskText === '' || categoryText === '') {
            showError('Bitte Aufgabe und Kategorie eingeben.');
            return;
        }

        const task = {
            id: Date.now(),
            name: taskText,
            category: categoryText,
            completed: false,
            prioritized: false
        };

        tasks.push(task);
        categories.add(categoryText);
        taskInput.value = '';

        saveTasks();
        updateCategoryFilter();
        updateCategoryDropdown();
        renderTasks();

        taskInput.focus();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCategoryDropdown() {
        categoryDropdown.innerHTML = '<option value=""></option>';
        categories.forEach(category => {
            if (!presets.includes(category)) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryDropdown.appendChild(option);
            }
        });
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset;
            option.textContent = preset;
            categoryDropdown.appendChild(option);
        });
    }

    function updateCategoryFilter() {
        const selectedCategory = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        categoryFilter.value = selectedCategory;
    }

    function renderTasks() {
        const taskList = document.getElementById('taskList');
        const completedList = document.getElementById('completedList');
        const filter = categoryFilter.value;

        taskList.innerHTML = '';
        completedList.innerHTML = '';

        // Sort: prioritized first, then by ID (oldest first)
        tasks.sort((a, b) => {
            if (a.prioritized && !b.prioritized) return -1;
            if (!a.prioritized && b.prioritized) return 1;
            return a.id - b.id;
        });

        tasks.forEach(task => {
            if (filter === 'all' || task.category === filter) {
                const listItem = document.createElement('li');

                const categorySpan = document.createElement('span');
                categorySpan.textContent = task.category;
                categorySpan.className = 'category';

                const taskText = document.createElement('span');
                taskText.textContent = task.name;
                taskText.className = 'task-text';

                const noteIndicator = document.createElement('span');
                noteIndicator.className = 'note-indicator';
                noteIndicator.textContent = task.notes ? '📝' : '';
                noteIndicator.title = task.notes || '';

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                if (task.completed) {
                    listItem.classList.add('completed');
                    taskText.style.textDecoration = 'line-through';

                    const doneDateSpan = document.createElement('span');
                    doneDateSpan.className = 'done-date';
                    doneDateSpan.textContent = ` (${task.doneDate || 'Unknown'})`;
                    doneDateSpan.style.fontSize = '0.8rem';

                    const activateButton = document.createElement('button');
                    activateButton.className = 'activate-button';
                    activateButton.onclick = () => activateTask(task.id);
                    buttonContainer.appendChild(activateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => {
                        if (confirm(`"${task.name}" löschen?`)) deleteTask(task.id);
                    };
                    buttonContainer.appendChild(deleteButton);

                    listItem.appendChild(categorySpan);
                    listItem.appendChild(taskText);
                    listItem.appendChild(noteIndicator);
                    listItem.appendChild(doneDateSpan);
                    listItem.appendChild(buttonContainer);
                    completedList.appendChild(listItem);

                } else {
                    if (task.prioritized) {
                        listItem.style.backgroundColor = 'gold';
                        listItem.style.color = 'black';
                    }

                    // Klick auf Kategorie: Priorität toggeln
                    categorySpan.style.cursor = 'pointer';
                    categorySpan.addEventListener('click', () => {
                        task.prioritized = !task.prioritized;
                        saveTasks();
                        renderTasks();
                    });

                    // Klick auf Aufgabentext: Notiz-Textarea öffnen
                    taskText.style.cursor = 'pointer';
                    taskText.addEventListener('click', () => {
                        if (listItem.querySelector('.note-textarea')) return;

                        const textarea = document.createElement('textarea');
                        textarea.className = 'note-textarea';
                        textarea.rows = 3;
                        textarea.value = task.notes || '';
                        textarea.placeholder = 'Notiz …';

                        function saveNote() {
                            const val = textarea.value.trim();
                            task.notes = val || undefined;
                            saveTasks();
                            noteIndicator.textContent = val ? '📝' : '';
                            noteIndicator.title = val || '';
                            noteIndicator.style.marginRight = '';
                            textarea.remove();
                        }

                        textarea.addEventListener('blur', saveNote);
                        textarea.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                saveNote();
                            }
                            if (e.key === 'Escape') {
                                noteIndicator.style.marginRight = '';
                                textarea.remove();
                            }
                        });

                        noteIndicator.style.marginRight = '0';
                        textarea.style.marginRight = 'auto';
                        listItem.insertBefore(textarea, buttonContainer);
                        textarea.focus();
                    });

                    // Edit-Button: Inline-Bearbeitung
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                    editButton.onclick = () => {
                        if (listItem.querySelector('.edit-input')) return;

                        const nameInput = document.createElement('input');
                        nameInput.className = 'edit-input';
                        nameInput.value = task.name;
                        taskText.replaceWith(nameInput);

                        const catInput = document.createElement('input');
                        catInput.className = 'edit-input edit-category';
                        catInput.value = task.category;
                        categorySpan.replaceWith(catInput);

                        editButton.className = 'save-edit-button';

                        function saveEdit() {
                            const newName = nameInput.value.trim();
                            const newCat = catInput.value.trim();
                            if (!newName || !newCat) return;
                            task.name = newName;
                            task.category = newCat;
                            categories.add(newCat);
                            saveTasks();
                            cleanUpCategories();
                            updateCategoryFilter();
                            updateCategoryDropdown();
                            renderTasks();
                        }

                        editButton.onclick = saveEdit;

                        [nameInput, catInput].forEach(input => {
                            input.addEventListener('keydown', e => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') renderTasks();
                            });
                        });

                        nameInput.focus();
                        nameInput.select();
                    };
                    buttonContainer.appendChild(editButton);

                    const completeButton = document.createElement('button');
                    completeButton.className = 'complete-button';
                    completeButton.onclick = () => completeTask(task.id);
                    buttonContainer.appendChild(completeButton);

                    listItem.appendChild(categorySpan);
                    listItem.appendChild(taskText);
                    listItem.appendChild(noteIndicator);
                    listItem.appendChild(buttonContainer);
                    taskList.appendChild(listItem);
                }
            }
        });
    }

    function completeTask(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = true;
                task.doneDate = new Date().toISOString().split('T')[0];
            }
            return task;
        });
        saveTasks();
        cleanUpCategories();
        renderTasks();
    }

    function activateTask(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = false;
                delete task.doneDate;
            }
            return task;
        });
        saveTasks();
        cleanUpCategories();
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        cleanUpCategories();
        renderTasks();
    }

    function cleanUpCategories() {
        const activeCategories = new Set(tasks.map(task => task.category));
        categories.forEach(category => {
            if (!activeCategories.has(category)) {
                categories.delete(category);
            }
        });
        updateCategoryFilter();
    }

    updateCategoryDropdown();
    updateCategoryFilter();
    renderTasks();
    taskInput.focus();
});
