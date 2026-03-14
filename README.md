# Task Manager

A simple task management application that runs in the browser. This app allows users to create tasks, categorize them, mark them as completed, and edit them. Completed tasks can be reactivated or permanently deleted. The application uses `localStorage` for persistent task storage, so tasks remain even after restarting the browser.


**Live Demo (Dev):**

Full browser version:
[![Full](https://img.shields.io/badge/Dev-Full-blue)](https://runter-vom-mattenwagen.github.io/js-browsertasks/)<br>
Compact popup view:
[![Popup](https://img.shields.io/badge/Dev-Popup-orange)](https://runter-vom-mattenwagen.github.io/js-browsertasks/launcher.html)

## Features

- **Add Tasks**: Create new tasks with a name and category.
- **Category Filtering**: Filter tasks by category for better organization.
- **Mark Tasks as Completed**: Completed tasks are moved to a separate list.
- **Mark Tasks as prioritized**: Tasks are colored yellow and moved to beginning of list.
- **Edit Tasks**: Existing tasks can be edited.
- **Reactivate Tasks**: Reactivate completed tasks and move them back to the main list.
- **Persistent Storage**: Tasks are saved in `localStorage` and remain even after a browser restart.
- **Automatic Category Removal**: Categories with no associated tasks are automatically deleted.
- **Survive Browser Restarts**: Tasks are stored in `localStorage` for persistence across browser sessions.
- **Import/Export**: Tasks can be saved to and restored from file.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/runter-vom-mattenwagen/js-browsertasks
   ```
   
2. **Navigate to the directory**:
   ```bash
   cd js-browsertasks
   ```

3. **Open in the browser**:
   - Open the `launcher.html` file in your browser. This will open a new window sized appropriately for the task manager.
   - Or open `index.html`. This will start the task manager in current browser size.

## Technologies Used

- **HTML**: Structure of the page.
- **CSS**: Styling for the task manager.
- **JavaScript**: Functionality for adding, editing, filtering, and saving tasks.
- **localStorage**: Used to store tasks and categories in the browser.

## How to Use

1. Open the `launcher.html` (or `index.html`) file in your browser.
2. A new window will open containing the task manager interface.
3. Start creating, editing, and managing your tasks.
4. Click on category to check/uncheck priority of task.
5. Click on icon right to heading to open the import/export dialog

## Development Details

- Each task is assigned a unique ID (`Date.now()`) when added.
- Categories with no remaining tasks are automatically removed.
- The application uses `localStorage` for task persistence.

## Acknowledgment

The entire code for this task manager was developed with the assistance of **ChatGPT** by OpenAI. Credit goes to AI for helping shape this application. 😊

## License

This is an open-source project. Feel free to use, modify, and adapt the code as needed.


