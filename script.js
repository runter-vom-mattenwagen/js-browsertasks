document.addEventListener('DOMContentLoaded', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const taskInput      = document.getElementById('taskInput');
    const categoryInput  = document.getElementById('categoryInput');
    const catDropdown    = document.getElementById('cat-dropdown');
    const addTaskButton  = document.getElementById('addTaskButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const taskError      = document.getElementById('taskError');
    const dueDateInput   = document.getElementById('due-date-input');
    const dueDateBadge   = document.getElementById('due-date-badge');
    const dueDateTrigger = document.getElementById('due-date-trigger');
    const presets        = ['🛒', '🩺', '💻', '💰'];

    // ── Events ───────────────────────────────────────────────────────────────
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress',     e => { if (e.key === 'Enter') addTask(); });
    categoryInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
    dueDateInput.addEventListener('keypress',  e => { if (e.key === 'Enter') addTask(); });
    categoryFilter.addEventListener('change',  () => renderTasks());
    categoryInput.addEventListener('focus', openCatDropdown);
    categoryInput.addEventListener('input', openCatDropdown);
    categoryInput.addEventListener('blur',  () => setTimeout(closeCatDropdown, 200));
    dueDateTrigger.addEventListener('click', () => dueDateInput.showPicker?.());
    document.getElementById('clearDoneButton').addEventListener('click', () => {
        if (confirm('Alle erledigten Aufgaben löschen?')) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
        }
    });
    dueDateInput.addEventListener('change',  () => updateDueDateBadge());
    dueDateBadge.addEventListener('click',   () => { dueDateInput.value = ''; updateDueDateBadge(); });

    // ── Helpers ──────────────────────────────────────────────────────────────
    function showError(msg) {
        taskError.textContent = msg;
        taskError.style.display = 'inline';
        setTimeout(() => { taskError.style.display = 'none'; }, 3000);
    }

    function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

    function activeCategories() {
        return [...new Set(tasks.map(t => t.category))].sort();
    }

    function updateDueDateBadge() {
        const val = dueDateInput.value;
        if (val) {
            const d = new Date(val + 'T00:00:00');
            dueDateBadge.textContent = '📅 ' + d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'}) + ' ✕';
            dueDateBadge.classList.add('visible');
        } else {
            dueDateBadge.textContent = '';
            dueDateBadge.classList.remove('visible');
        }
    }

    // ── Category Dropdown ────────────────────────────────────────────────────
    function buildDropdownItems() {
        catDropdown.innerHTML = '';
        const cats = activeCategories().filter(c => !presets.includes(c));
        [...cats, ...presets].forEach(cat => {
            const item = document.createElement('div');
            item.textContent = cat;
            item.addEventListener('pointerdown', e => {
                e.preventDefault();
                categoryInput.value = cat;
                closeCatDropdown();
            });
            catDropdown.appendChild(item);
        });
    }

    function openCatDropdown() {
        buildDropdownItems();
        catDropdown.style.display = catDropdown.children.length > 0 ? 'block' : 'none';
    }

    function closeCatDropdown() { catDropdown.style.display = 'none'; }

    // ── Filter ───────────────────────────────────────────────────────────────
    function updateCategoryFilter() {
        const selected = categoryFilter.value || 'all';
        categoryFilter.innerHTML = '<option value="all">Alle Kategorien</option>';
        activeCategories().forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat; opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });
        categoryFilter.value = [...categoryFilter.options].some(o => o.value === selected) ? selected : 'all';
    }

    // ── Core ─────────────────────────────────────────────────────────────────
    function addTask() {
        const taskText = taskInput.value.trim();
        const catText  = categoryInput.value.trim();
        if (!taskText || !catText) { showError('Bitte Aufgabe und Kategorie eingeben.'); return; }
        tasks.push({
            id: Date.now(), name: taskText, category: catText,
            completed: false, prioritized: false, notes: '',
            dueDate: dueDateInput.value || '',
        });
        taskInput.value = '';
        dueDateInput.value = '';
        updateDueDateBadge();
        saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
        taskInput.focus();
    }

    function completeTask(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: true, doneDate: new Date().toISOString().split('T')[0]} : t);
        saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
    }

    function activateTask(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: false, doneDate: ''} : t);
        saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
    }

    // ── Render ───────────────────────────────────────────────────────────────
    function renderTasks() {
        const taskList      = document.getElementById('taskList');
        const completedList = document.getElementById('completedList');
        const filter        = categoryFilter.value || 'all';
        taskList.innerHTML = '';
        completedList.innerHTML = '';

        [...tasks].sort((a, b) => {
            if (a.prioritized !== b.prioritized) return a.prioritized ? -1 : 1;
            return a.id - b.id;
        }).forEach(task => {
            if (filter !== 'all' && task.category !== filter) return;
            (task.completed ? completedList : taskList).appendChild(buildItem(task));
        });
    }

    function buildItem(task) {
        const li = document.createElement('li');
        if (task.prioritized && !task.completed) li.classList.add('prioritized');

        // ── shared elements ──
        const catSpan = document.createElement('span');
        catSpan.textContent = task.category;
        catSpan.className = 'category';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = task.name;
        nameSpan.className = 'task-text';

        const noteInd = document.createElement('span');
        noteInd.className = 'note-indicator';
        noteInd.textContent = task.notes ? '📝' : '';
        noteInd.title = task.notes || '';

        const buttons = document.createElement('div');
        buttons.className = 'button-container';

        // ── main row ──
        const mainRow = document.createElement('div');
        mainRow.className = 'task-row-main';

        if (task.completed) {
            const doneDateSpan = document.createElement('span');
            doneDateSpan.textContent = ` (${task.doneDate || '?'})`;
            doneDateSpan.style.fontSize = '0.8rem';
            nameSpan.style.textDecoration = 'line-through';

            const activateBtn = document.createElement('button');
            activateBtn.className = 'activate-button';
            activateBtn.onclick = () => activateTask(task.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.onclick = () => { if (confirm(`"${task.name}" löschen?`)) deleteTask(task.id); };

            buttons.append(activateBtn, deleteBtn);
            mainRow.append(catSpan, nameSpan, noteInd, doneDateSpan, buttons);
            li.appendChild(mainRow);

        } else {
            // due date badge
            if (task.dueDate) {
                const d = new Date(task.dueDate + 'T00:00:00');
                const today = new Date(); today.setHours(0,0,0,0);
                const overdue = d < today;
                const dueBadge = document.createElement('span');
                dueBadge.className = 'task-due-date' + (overdue ? ' overdue' : '');
                dueBadge.textContent = (overdue ? '⚠ ' : '📅 ') + d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'});
                mainRow.append(catSpan, nameSpan, noteInd, dueBadge, buttons);
            } else {
                mainRow.append(catSpan, nameSpan, noteInd, buttons);
            }

            // priority toggle
            catSpan.style.cursor = 'pointer';
            catSpan.addEventListener('click', () => {
                task.prioritized = !task.prioritized;
                saveTasks(); renderTasks();
            });

            // edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-button';
            editBtn.onclick = () => {
                if (li.querySelector('.edit-input')) return;
                document.querySelectorAll('.edit-input').forEach(el => {
                    const other = el.closest('li');
                    if (other && other !== li) renderTasks();
                });
                const nameInput = document.createElement('input');
                nameInput.className = 'edit-input';
                nameInput.value = task.name;
                const catInput = document.createElement('input');
                catInput.className = 'edit-input edit-category';
                catInput.value = task.category;
                nameSpan.replaceWith(nameInput);
                catSpan.replaceWith(catInput);
                editBtn.className = 'save-edit-button';
                function saveEdit() {
                    const n = nameInput.value.trim(), c = catInput.value.trim();
                    if (!n || !c) return;
                    task.name = n; task.category = c;
                    saveTasks(); buildDropdownItems(); updateCategoryFilter(); renderTasks();
                }
                editBtn.onclick = saveEdit;
                [nameInput, catInput].forEach(inp => inp.addEventListener('keydown', e => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') renderTasks();
                }));
                nameInput.focus(); nameInput.select();
            };

            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-button';
            completeBtn.onclick = () => completeTask(task.id);
            buttons.append(editBtn, completeBtn);

            // note area — AFTER mainRow in DOM
            li.appendChild(mainRow);

            const noteArea = document.createElement('div');
            noteArea.className = 'note-area';
            const textarea = document.createElement('textarea');
            textarea.className = 'note-textarea';
            textarea.rows = 3;
            textarea.value = task.notes || '';
            textarea.placeholder = 'Notiz …';
            noteArea.appendChild(textarea);
            function saveNote() {
                task.notes = textarea.value.trim() || '';
                saveTasks();
                noteInd.textContent = task.notes ? '📝' : '';
                noteInd.title = task.notes || '';
                noteArea.style.display = 'none';
            }
            textarea.addEventListener('blur', () => setTimeout(() => {
                if (noteArea.style.display === 'block') saveNote();
            }, 150));
            textarea.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); }
                if (e.key === 'Escape') noteArea.style.display = 'none';
            });

            nameSpan.style.cursor = 'pointer';
            nameSpan.addEventListener('click', () => {
                if (noteArea.style.display === 'block') {
                    saveNote();
                } else {
                    textarea.value = task.notes || '';
                    li.appendChild(noteArea);
                    noteArea.style.display = 'block';
                    textarea.focus();
                }
            });

            return li; // early return — li already has mainRow appended
        }

        return li;
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    buildDropdownItems();
    updateCategoryFilter();
    renderTasks();
    taskInput.focus();
});
