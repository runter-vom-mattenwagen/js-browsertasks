document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let categories = new Set(tasks.map(task => task.category));

    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const categoryFilter = document.getElementById('categoryFilter');

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    categoryInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    categoryFilter.addEventListener('change', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const categoryText = categoryInput.value.trim();

        if (taskText === '' || categoryText === '') {
            alert('Bitte sowohl eine Aufgabe als auch eine Kategorie eingeben.');
            return;
        }

        const task = {
            id: Date.now(),
            name: taskText,
            category: categoryText,
            completed: false
        };

        tasks.push(task);
        categories.add(categoryText);

        saveTasks();
        updateCategoryFilter();
        renderTasks();

        taskInput.value = '';
        categoryInput.value = '';
        taskInput.focus();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCategoryFilter() {
        const selectedCategory = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="all">Alle Kategorien</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.value = selectedCategory;
    }

    function filterTasks() {
        renderTasks();
    }

    function renderTasks() {
        const taskList = document.getElementById('taskList');
        const completedList = document.getElementById('completedList');
        const filter = categoryFilter.value;

        taskList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            if (filter === 'all' || task.category === filter) {
                const listItem = document.createElement('li');

                const categorySpan = document.createElement('span');
                categorySpan.textContent = task.category;
                categorySpan.className = 'category';

                const taskText = document.createElement('span');
                taskText.textContent = task.name;
                taskText.className = 'task-text';

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                if (task.completed) {
                    listItem.classList.add('completed');

                    const activateButton = document.createElement('button');
                    activateButton.className = 'activate-button';
                    activateButton.onclick = () => activateTask(task.id);
                    buttonContainer.appendChild(activateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => deleteTask(task.id);
                    buttonContainer.appendChild(deleteButton);

                    listItem.appendChild(categorySpan);
                    listItem.appendChild(taskText);
                    listItem.appendChild(buttonContainer);
                    completedList.appendChild(listItem);
                } else {
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                    editButton.onclick = () => editTask(task.id);

                    const completeButton = document.createElement('button');
                    completeButton.className = 'complete-button';
                    completeButton.onclick = () => completeTask(task.id);

                    buttonContainer.appendChild(editButton);
                    buttonContainer.appendChild(completeButton);

                    listItem.appendChild(categorySpan);
                    listItem.appendChild(taskText);
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
            }
            return task;
        });

        saveTasks();
        cleanUpCategories();
        renderTasks();
    }

    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);

        const newTaskName = prompt('Aufgabe bearbeiten:', task.name);
        const newCategoryName = prompt('Kategorie bearbeiten:', task.category);

        if (newTaskName && newCategoryName) {
            task.name = newTaskName;
            task.category = newCategoryName;

            categories.add(newCategoryName);
            saveTasks();
            cleanUpCategories();
            updateCategoryFilter();
            renderTasks();
        }
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

    function adjustCategoryInputWidth() {
        const maxCategoryWidth = Math.max(...tasks.map(task => task.category.length));
        categoryInput.style.width = `${Math.max(maxCategoryWidth * 10, 100)}px`; // Breite anpassen
    }

    // Initiale Anzeige der Aufgaben und Kategorien
    updateCategoryFilter();
    renderTasks();
    adjustCategoryInputWidth();
});

