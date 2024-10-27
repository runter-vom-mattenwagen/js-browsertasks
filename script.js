document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let categories = new Set(tasks.map(task => task.category));

    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const addTaskButton = document.getElementById('addTaskButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const presets = ['🛒', '🩺', '💻', '💰'];

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

    categoryDropdown.addEventListener('change', function() {
        categoryInput.value = categoryDropdown.value;
        taskInput.focus();
    });

    categoryFilter.addEventListener('change', renderTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const categoryText = categoryInput.value.trim();

        if (taskText === '' || categoryText === '') {
            alert('Please enter a task and a category.');
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

        saveTasks();
        updateCategoryFilter();
        updateCategoryDropdown();
        renderTasks();

        // taskInput.value = ''; // ueberfluessig
        if (categoryInput.value === 'all') {
            categoryInput.value = '';
        }
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
        if (categoryFilter.value === 'all') {
            categoryInput.value = '';
        } else {
            categoryInput.value = categoryFilter.value; // Wenn Cat-Filter setze Input
        }

        const taskList = document.getElementById('taskList');
        const completedList = document.getElementById('completedList');
        const filter = categoryFilter.value;

        taskList.innerHTML = '';
        completedList.innerHTML = '';

        // Sort tasks: prioritized tasks first, and sort by ID (newer tasks come later)
        tasks.sort((a, b) => {
            if (a.prioritized && !b.prioritized) {
                return -1; // a is prioritized, b is not, so a comes first
            } else if (!a.prioritized && b.prioritized) {
                return 1; // b is prioritized, a is not, so b comes first
            } else {
                return a.id - b.id; // If both are the same priority, sort by ID (oldest first)
            }
        });

        tasks.forEach(task => {
            if (filter === 'all' || task.category === filter) {
                const listItem = document.createElement('li');

                const categorySpan = document.createElement('span');
                categorySpan.textContent = task.category;
                categorySpan.className = 'category';
                categorySpan.style.cursor = 'pointer';

                // Change background color if prioritized
                if (task.prioritized) {
                    listItem.style.backgroundColor = 'gold';
                    listItem.style.color = 'black';
                }

                // marcokram: Klick auf Kategorie priorisiert Task
                function handleCategoryClick() {
                    task.prioritized = !task.prioritized;  // Toggle priority
                    saveTasks();
                    renderTasks();  // Re-render tasks to reflect changes
                }
                categorySpan.addEventListener('click', handleCategoryClick);

                const taskText = document.createElement('span');
                taskText.textContent = task.name;
                taskText.className = 'task-text';
                taskText.style.cursor = 'context-menu';
                taskText.addEventListener('click', handleContextClick); //Con-Text pro Task

                function handleContextClick() {
                    alert('Not yet implemented');
                    console.log("Name: ", task.name);
                    console.log("ID  : ", task.id);
                    console.log(task);
                        // const taskId = parseInt(taskTextElement.dataset.taskId);  // Assuming taskId is stored as a data attribute
                        // const task = tasks.find(task => task.id === taskId);
                    
                        // // Create a textarea element and set initial value
                        // const textarea = document.createElement('textarea');
                        // textarea.value = task.name;
                        // textarea.className = 'task-textarea';
                        // textarea.style.width = '100%';
                        // taskTextElement.replaceWith(textarea);  // Replace the task text with the textarea
                        // textarea.focus();
                    
                        // // Save and replace textarea with taskText on blur or Enter
                        // function saveAndClose() {
                        //     task.name = textarea.value.trim();
                        //     saveTasks();
                        //     renderTasks();  // Re-render to show updated task name
                        // }
                    
                        // // Add event listeners for blur and Enter key
                        // textarea.addEventListener('blur', saveAndClose);
                        // textarea.addEventListener('keypress', function(event) {
                        //     if (event.key === 'Enter') {
                        //         event.preventDefault();
                        //         saveAndClose();
                        //     }
                        // });
                }

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                if (task.completed) {
                    listItem.classList.add('completed');
                    taskText.style.textDecoration = 'line-through';
                    taskText.style.cursor = 'default';
                    listItem.style.backgroundColor = '';
                    listItem.style.color = '';
                    categorySpan.removeEventListener('click', handleCategoryClick);
                    categorySpan.style.cursor = 'default';

                    taskText.removeEventListener('click', handleContextClick);

                    const doneDateSpan = document.createElement('span');
                    doneDateSpan.className = 'done-date';
                    doneDateSpan.textContent = ` (${task.doneDate || 'Unknown'})`;
                    doneDateSpan.style.marginRight = '5px';
                    doneDateSpan.style.fontSize = '0.8rem';

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
                    listItem.appendChild(doneDateSpan);
                    listItem.appendChild(buttonContainer);
                    completedList.appendChild(listItem);
                } else {
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                    editButton.onclick = () => editTask(task.id);
                    buttonContainer.appendChild(editButton);

                    const completeButton = document.createElement('button');
                    completeButton.className = 'complete-button';
                    completeButton.onclick = () => completeTask(task.id);
                    buttonContainer.appendChild(completeButton);

                    listItem.appendChild(categorySpan);
                    listItem.appendChild(taskText);
                    listItem.appendChild(buttonContainer);
                    taskList.appendChild(listItem);
                }
            }
        });
        taskInput.value = '';
        taskInput.focus();
    }


    function completeTask(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = true;
                task.doneDate = new Date().toISOString().split('T')[0];  // Set done date as current date (YYYY-MM-DD)
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

    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);

        const newTaskName = prompt('Task', task.name);
        const newCategoryName = prompt('Category', task.category);

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

    // Das muss einfacher
    function adjustCategoryInputWidth() {
        const maxCategoryWidth = Math.max(...tasks.map(task => task.category.length));
        categoryInput.style.width = `${Math.max(maxCategoryWidth * 10, 100)}px`; // Breite anpassen
    }

    // Initiale Anzeige der Aufgaben und Kategorien
    updateCategoryDropdown();
    updateCategoryFilter();
    renderTasks();
    // categoryInput.style.width = "fit-content";
    adjustCategoryInputWidth();
    taskInput.focus();
});