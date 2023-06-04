// Variables
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDeadlineInput = document.getElementById('taskDeadline');
const taskList = document.getElementById('taskList');
const remainingTasksCount = document.getElementById('remainingTasks');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let tasks = [];

// Functions
function addTask(event) {
  event.preventDefault();

  const taskTitle = taskTitleInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();
  const taskDeadline = taskDeadlineInput.value;

  if (taskTitle === '') {
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('taskItem');
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    taskItem.dataset.taskId = task.id;

    const taskTitle = document.createElement('div');
    taskTitle.classList.add('taskItem__title');
    taskTitle.textContent = task.title;
    taskItem.appendChild(taskTitle);

    const taskDetails = document.createElement('div');
    taskDetails.classList.add('taskItem__details');
    taskItem.appendChild(taskDetails);

    if (task.description !== '') {
      const taskDescription = document.createElement('div');
      taskDescription.classList.add('taskItem__description');
      taskDescription.textContent = task.description;
      taskDetails.appendChild(taskDescription);
    }

    if (task.deadline !== '') {
      const taskDeadline = document.createElement('div');
      taskDeadline.classList.add('taskItem__deadline');
      taskDeadline.textContent = 'Deadline: ' + task.deadline;
      taskDetails.appendChild(taskDeadline);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('taskItem__deleteBtn');
    deleteButton.innerHTML = '&#10005;';
    deleteButton.addEventListener('click', deleteTask);
    taskItem.appendChild(deleteButton);

    taskItem.addEventListener('click', toggleTaskDetails);
    taskList.appendChild(taskItem);
  });

  updateRemainingTasksCount();
  updateClearCompletedButton();
}

function deleteTask(event) {
  const taskId = event.target.parentNode.dataset.taskId;
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTaskDetails(event) {
  const taskId = event.target.dataset.taskId || event.target.parentNode.dataset.taskId;
  const taskItem = taskList.querySelector(`[data-task-id="${taskId}"]`);
  const taskDetails = taskItem.querySelector('.taskItem__details');
  taskDetails.classList.toggle('show');
}

function updateRemainingTasksCount() {
  const remainingTasks = tasks.filter((task) => !task.completed);
  remainingTasksCount.textContent = remainingTasks.length;
}

function updateClearCompletedButton() {
  const completedTasks = tasks.filter((task) => task.completed);
  if (completedTasks.length > 0) {
    clearCompletedBtn.style.display = 'block';
  } else {
    clearCompletedBtn.style.display = 'none';
  }
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasksData = localStorage.getItem('tasks');
  if (tasksData) {
    tasks = JSON.parse(tasksData);
    renderTasks();
  }
}

// Event Listeners
taskForm.addEventListener('submit', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Load Tasks from Local Storage
loadTasks();
