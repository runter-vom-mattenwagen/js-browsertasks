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

    // ── Persistence ──────────────────────────────────────────────────────────
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // ── Derived data ─────────────────────────────────────────────────────────
    function activeCategories() {
        return [...new Set(tasks.map(t => t.category).filter(Boolean))].sort();
    }

    // ── UI refresh ───────────────────────────────────────────────────────────
    function refresh(rerender = true) {
        // Category dropdown
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

        // Category filter
        const selected = categoryFilter.value || 'all';
        categoryFilter.innerHTML = '<option value="all">Alle Kategorien</option>';
        activeCategories().forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat; opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });
        categoryFilter.value = [...categoryFilter.options].some(o => o.value === selected) ? selected : 'all';

        if (rerender) renderTasks();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function showError(msg) {
        taskError.textContent = msg;
        taskError.style.display = 'inline';
        setTimeout(() => { taskError.style.display = 'none'; }, 3000);
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

    // ── Category dropdown ────────────────────────────────────────────────────
    function openCatDropdown() {
        refresh(false);
        catDropdown.style.display = catDropdown.children.length > 0 ? 'block' : 'none';
    }

    function closeCatDropdown() { catDropdown.style.display = 'none'; }

    // ── Core ─────────────────────────────────────────────────────────────────
    function addTask() {
        const taskText = taskInput.value.trim();
        const catText  = categoryInput.value.trim();
        if (!taskText || !catText) { showError('Bitte Aufgabe und Kategorie eingeben.'); return; }
        tasks.push({
            id:          crypto.randomUUID(),
            name:        taskText,
            category:    catText,
            completed:   false,
            prioritized: false,
            notes:       '',
            dueDate:     dueDateInput.value || '',
        });
        taskInput.value = '';
        dueDateInput.value = '';
        updateDueDateBadge();
        saveTasks(); refresh();
        taskInput.focus();
    }

    function completeTask(id) {
        tasks = tasks.map(t => t.id === id
            ? {...t, completed: true, doneDate: new Date().toISOString().split('T')[0]}
            : t);
        saveTasks(); refresh();
    }

    function activateTask(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: false, doneDate: ''} : t);
        saveTasks(); refresh();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(); refresh();
    }

    // ── Render ───────────────────────────────────────────────────────────────
    function renderTasks() {
        const taskList      = document.getElementById('taskList');
        const completedList = document.getElementById('completedList');
        const doneHeader    = document.getElementById('doneHeader');
        const filter        = categoryFilter.value || 'all';
        const today         = new Date(); today.setHours(0, 0, 0, 0);
        taskList.innerHTML = '';
        completedList.innerHTML = '';

        let todoCount = 0, doneCount = 0;
        tasks.sort((a, b) => {
            if (a.prioritized !== b.prioritized) return a.prioritized ? -1 : 1;
            return String(a.id).localeCompare(String(b.id));
        }).forEach(task => {
            if (filter !== 'all' && task.category !== filter) return;
            if (task.completed) { completedList.appendChild(buildItem(task, today)); doneCount++; }
            else                { taskList.appendChild(buildItem(task, today));      todoCount++; }
        });

        if (todoCount === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.textContent = 'Noch keine Aufgaben';
            taskList.appendChild(empty);
        }
        if (doneHeader) {
            const label = doneCount > 0 ? `Done (${doneCount})` : 'Done';
            // Caret als erstes Kind beibehalten, nur Text-Suffix updaten
            const caret = doneHeader.querySelector('.caret');
            doneHeader.innerHTML = '';
            if (caret) doneHeader.appendChild(caret);
            doneHeader.appendChild(document.createTextNode(' ' + label));
        }
    }

    function buildItem(task, today) {
        const li = document.createElement('li');
        if (task.prioritized && !task.completed) li.classList.add('prioritized');

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

        } else {
            // Due date badge
            if (task.dueDate) {
                const d = new Date(task.dueDate + 'T00:00:00');
                const diffDays = Math.round((d - today) / 86400000);
                const dueBadge = document.createElement('span');
                let label, cls;
                if      (diffDays  <  0) { cls = 'overdue'; label = '⚠ überfällig'; }
                else if (diffDays === 0) { cls = 'today';   label = '📅 heute'; }
                else if (diffDays === 1) { cls = '';        label = '📅 morgen'; }
                else if (diffDays <=  6) { cls = '';        label = '📅 in ' + diffDays + ' Tagen'; }
                else                     { cls = '';        label = '📅 ' + d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'}); }
                dueBadge.className = 'task-due-date' + (cls ? ' ' + cls : '');
                dueBadge.textContent = label;
                dueBadge.title = d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
                mainRow.append(catSpan, nameSpan, noteInd, dueBadge, buttons);
            } else {
                mainRow.append(catSpan, nameSpan, noteInd, buttons);
            }

            // Priority toggle
            catSpan.style.cursor = 'pointer';
            catSpan.addEventListener('click', () => {
                task.prioritized = !task.prioritized;
                saveTasks(); renderTasks();
            });

            // Edit
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
                    saveTasks(); refresh();
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

            // Note area
            const noteArea = document.createElement('div');
            noteArea.className = 'note-area';
            const textarea = document.createElement('textarea');
            textarea.className = 'note-textarea';
            textarea.rows = 3;
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
        }

        li.appendChild(mainRow);
        return li;
    }

    // ── Events ───────────────────────────────────────────────────────────────
    addTaskButton.addEventListener('click', addTask);
    [taskInput, categoryInput, dueDateInput].forEach(el =>
        el.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); }));
    categoryFilter.addEventListener('change', renderTasks);
    categoryInput.addEventListener('focus', openCatDropdown);
    categoryInput.addEventListener('input', openCatDropdown);
    categoryInput.addEventListener('blur', () => setTimeout(closeCatDropdown, 200));
    categoryInput.addEventListener('keydown', e => {
        if (catDropdown.style.display !== 'block') return;
        const items = [...catDropdown.children];
        if (items.length === 0) return;
        const current = catDropdown.querySelector('.active');
        let idx = items.indexOf(current);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            idx = (idx + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            idx = idx <= 0 ? items.length - 1 : idx - 1;
        } else if (e.key === 'Enter' && current) {
            e.preventDefault();
            categoryInput.value = current.textContent;
            closeCatDropdown();
            return;
        } else if (e.key === 'Escape') {
            closeCatDropdown();
            return;
        } else {
            return;
        }

        items.forEach(i => i.classList.remove('active'));
        items[idx].classList.add('active');
        items[idx].scrollIntoView({block: 'nearest'});
    });
    dueDateTrigger.addEventListener('click', () => dueDateInput.showPicker?.());
    dueDateInput.addEventListener('change', updateDueDateBadge);
    dueDateBadge.addEventListener('click', () => { dueDateInput.value = ''; updateDueDateBadge(); });
    document.getElementById('clearDoneButton').addEventListener('click', () => {
        if (confirm('Alle erledigten Aufgaben löschen?')) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks(); refresh();
        }
    });

    // ── Done-Collapse ─────────────────────────────────────────────────────
    const doneHeader = document.getElementById('doneHeader');
    if (localStorage.getItem('done-collapsed') === '1') doneHeader.classList.add('collapsed');
    doneHeader.addEventListener('click', () => {
        doneHeader.classList.toggle('collapsed');
        localStorage.setItem('done-collapsed', doneHeader.classList.contains('collapsed') ? '1' : '0');
    });

    // ── Init ─────────────────────────────────────────────────────────────────
    refresh();
    taskInput.focus();
});
