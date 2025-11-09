const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

addBtn.addEventListener("click", () => {
  const taskInput = document.getElementById("taskInput").value.trim();
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value.trim();

  if (!taskInput || !deadline) {
    alert("Please enter both task and deadline!");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskInput,
    status,
    priority,
    deadline,
  };

  tasks.push(task);
  document.getElementById("taskInput").value = "";
  document.getElementById("deadline").value = "";
  renderTasks();
});

function renderTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML = "No tasks yet. Add your first task!";
    return;
  }

  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.classList.add("task");
    div.innerHTML = `
      <p><strong>${task.name}</strong></p>
      <p>Status: ${task.status}</p>
      <p>Priority: ${task.priority}</p>
      <p>Deadline: ${task.deadline}</p>
      <button class="complete-btn" onclick="markComplete(${task.id})">Mark Complete</button>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(div);
  });
}

function markComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, status: "Completed" } : task
  );
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

renderTasks();
