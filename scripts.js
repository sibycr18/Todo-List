// Function to fetch and render uncompleted tasks
function loadPendingTasks() {
    var url = `http://127.0.0.1:5000/fetch/tasks`;

    // Make a GET request to the backend endpoint
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Clear the tasks container
            clearTasks()
            // Call a function to render the tasks immediately
            renderTasks(data.tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}
loadPendingTasks()

// Function to remove all tasks from the HTML
function clearTasks() {
    const tasksContainer = document.querySelector('.tasks-wrapper');

    // Check if the container exists
    if (tasksContainer) {
        // Clear the content of the container
        tasksContainer.innerHTML = '';
    } else {
        console.error('Tasks container not found.');
    }
}

// Function to remove a task
function removeTask(taskId) {
    // Find the task element by task ID
    const taskToRemove = document.querySelector(`input[task_id="${taskId}"]`);

    // Check if the task element exists
    if (taskToRemove) {
        // Remove the task element's parent (the taskDiv)
        taskToRemove.parentNode.remove();
    } else {
        console.warn(`Task with ID ${taskId} not found.`);
    }
}

// Function to render tasks dynamically
function renderTasks(tasks) {
    const tasksWrapper = document.querySelector('.tasks-wrapper');

    if (tasks.length === 0) {
        // If tasks array is empty, display a message
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = 'No tasks to show here';
        noTasksMessage.className = 'no-tasks-message';
        tasksWrapper.appendChild(noTasksMessage);
    } else {
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'task';
            checkbox.id = `item-${index + 1}`;
            checkbox.className = 'task-item';
            checkbox.checked = task.completed;
            checkbox.setAttribute('task_id', task._id);

            const label = document.createElement('label');
            label.setAttribute('for', `item-${index + 1}`);
            label.innerHTML = `<span class="label-text">${task.task}</span>`;

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            tasksWrapper.appendChild(taskDiv);
        });
    }}

// Add task when button clicked
document.addEventListener('DOMContentLoaded', function () {
    const addTasksContainer = document.getElementById('addTaskWrapper');
    const addTaskButton = document.getElementById('add-task');

    addTaskButton.addEventListener('click', function () {
        // Disable the button whhile adding a task
        addTaskButton.disabled = true

        // Create a new task input field
        const newTaskInput = document.createElement('input');
        newTaskInput.type = 'text';
        newTaskInput.placeholder = 'Enter task here...';

        // Create a "tick" button
        const tickButton = document.createElement('button');
        tickButton.classList.add('icon-button');
        tickButton.innerText = '';

        // Append the new input and button to the tasks container
        addTasksContainer.appendChild(newTaskInput);
        addTasksContainer.appendChild(tickButton);

        // Add event listener to the "tick" button
        tickButton.addEventListener('click', function () {
            // Get the text from the input field
            const taskText = newTaskInput.value;
            
            if (taskText !== '') {
                // Call a function to add the task using an API request
                addTask(taskText);
            }

            // Remove the input field and button after adding the task
            addTasksContainer.removeChild(newTaskInput);
            addTasksContainer.removeChild(tickButton);
            // Enable the button after adding a task
            addTaskButton.disabled = false
        });
    });

    function addTask(taskText) {
        // Make an API request to add the task
        fetch('http://127.0.0.1:5000/add/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: taskText,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the API response, update UI, etc.
                console.log('Task added:', data);
                loadPendingTasks()
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
    }
});


// Function to mark a task as complete
function markTaskAsComplete(task_id) {
    console.log("Task:" + JSON.stringify({
        task_id: task_id
    }))
    // Make a POST request to mark the task as complete
    fetch(`http://127.0.0.1:5000/mark/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: task_id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Task marked as complete:', data);
                loadPendingTasks();
            }
        })
        .catch(error => {
            console.error('Error marking task as complete:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Event listener for changes in task checkboxes
    document.addEventListener('change', function (event) {
        const checkbox = event.target;
        console.log("Checkbox clicked:" + checkbox.id)
        const taskId = checkbox.getAttribute('task_id'); // Extract the taskId from the checkbox's ID or other attributes;
        const userId = localStorage.getItem('user_id');
        // Check if the changed element is a task checkbox
        if (checkbox.type === 'checkbox' && checkbox.classList.contains('task-item')) {
            if (checkbox.checked) {
                // Call the function to mark the task as complete
                markTaskAsComplete(taskId, userId);
            }
        }
    });
});