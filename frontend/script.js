const projectURL = "http://localhost:5000/projects";
const taskURL = "http://localhost:5000/tasks";

let currentProjectId = null;

// -------------------- Projects --------------------
async function fetchProjects() {
    const res = await fetch(projectURL);
    const projects = await res.json();
    const projectsDiv = document.getElementById("projects");
    projectsDiv.innerHTML = "";

    projects.forEach(p => {
        const div = document.createElement("div");
        div.className = "project-card";
        div.innerText = p.name;
        div.onclick = () => selectProject(p._id, p.name);
        projectsDiv.appendChild(div);
    });
}

async function addProject() {
    const name = document.getElementById("projectInput").value.trim();
    if (!name) return;
    await fetch(projectURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    document.getElementById("projectInput").value = "";
    fetchProjects();
}

function selectProject(id, name) {
    currentProjectId = id;
    document.getElementById("projectTitle").innerText = name;
    fetchTasks();
}

// -------------------- Tasks --------------------
async function fetchTasks() {
    if (!currentProjectId) return;
    const res = await fetch(`${projectURL}/${currentProjectId}/tasks`);
    const tasks = await res.json();
    const tasksDiv = document.getElementById("tasks");
    tasksDiv.innerHTML = "";

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-card" + (task.status === "Completed" ? " completed" : "");
        div.innerHTML = `
            <div>
                <p><strong>${task.title}</strong></p>
                <p>Status: <span class="status">${task.status}</span>
                   Priority: <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                   Due: <span class="due-date">${task.dueDate || "N/A"}</span>
                </p>
            </div>
            <div>
                <button class="update-btn" onclick="updateTask('${task._id}')">✅</button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑️</button>
            </div>
        `;
        tasksDiv.appendChild(div);
    });
}

async function addTask() {
    if (!currentProjectId) return;
    const title = document.getElementById("taskInput").value.trim();
    const status = document.getElementById("statusSelect").value;
    const priority = document.getElementById("prioritySelect").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title) return;

    await fetch(`${projectURL}/${currentProjectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, priority, dueDate })
    });

    document.getElementById("taskInput").value = "";
    document.getElementById("dueDate").value = "";
    fetchTasks();
}

async function updateTask(id) {
    await fetch(`${taskURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
    });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${taskURL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// -------------------- Theme Toggle --------------------
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// -------------------- Auto-refresh --------------------
setInterval(fetchTasks, 5000);

// -------------------- Initial Load --------------------
fetchProjects();


// ---------------- Projects ----------------
async function fetchProjects(){
    const res = await fetch(`${apiURL}/projects`);
    const projects = await res.json();
    const projectsDiv = document.getElementById("projects");
    projectsDiv.innerHTML = "";
    projects.forEach(p=>{
        const div = document.createElement("div");
        div.className = "project-card"+(currentProject===p._id?" active":"");
        div.innerText = p.name;
        div.onclick=()=>{ currentProject=p._id; document.getElementById("projectTitle").innerText=p.name; fetchTasks(); fetchProjects(); };
        projectsDiv.appendChild(div);
    });
}

async function addProject(){
    const name = document.getElementById("projectInput").value;
    if(!name.trim()){ showToast("Enter project name!"); return; }
    await fetch(`${apiURL}/projects`,{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name}) });
    document.getElementById("projectInput").value="";
    fetchProjects();
    showToast("Project added!");
}

// ---------------- Tasks ----------------
async function fetchTasks(){
    if(!currentProject){ document.getElementById("tasks").innerHTML="<p>Select a project</p>"; return; }
    const res = await fetch(`${apiURL}/projects/${currentProject}/tasks`);
    const tasks = await res.json();
    const tasksDiv = document.getElementById("tasks");
    tasksDiv.innerHTML="";
    if(!tasks.length){ tasksDiv.innerHTML="<p>No tasks yet</p>"; return; }

    tasks.forEach(task=>{
        const div=document.createElement("div");
        div.className=`task-card ${task.status.toLowerCase()}`;
        div.innerHTML=`
            <div>
                <p>${task.title}</p>
                <p>
                    <span class="badge ${task.status.toLowerCase()}">${task.status}</span>
                    <span class="priority ${task.priority}">${task.priority}</span>
                    ${task.dueDate? `<span>📅 ${task.dueDate}</span>`: ""}
                </p>
            </div>
            <div>
                <button onclick="updateTask('${task._id}')">✅</button>
                <button onclick="deleteTask('${task._id}')">🗑️</button>
            </div>
        `;
        tasksDiv.appendChild(div);
    });
}

async function addTask(){
    if(!currentProject){ showToast("Select project first"); return; }
    const title=document.getElementById("taskInput").value;
    const status=document.getElementById("statusSelect").value;
    const priority=document.getElementById("prioritySelect").value;
    const dueDate=document.getElementById("dueDate").value;
    if(!title.trim()){ showToast("Enter task title"); return; }
    await fetch(`${apiURL}/projects/${currentProject}/tasks`,{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({title,status,priority,dueDate}) });
    document.getElementById("taskInput").value="";
    fetchTasks();
    showToast("Task added!");
}

async function updateTask(id){ await fetch(`${apiURL}/tasks/${id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status:"Completed"}) }); fetchTasks(); showToast("Task completed!"); }
async function deleteTask(id){ await fetch(`${apiURL}/tasks/${id}`,{ method:"DELETE"}); fetchTasks(); showToast("Task deleted!"); }

// ---------------- Theme & Toast ----------------
function toggleTheme(){ document.body.classList.toggle("dark-mode"); showToast("Theme toggled"); }
function showToast(msg){ const t=document.createElement("div"); t.className="toast"; t.innerText=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2500); }

window.addEventListener("DOMContentLoaded", ()=>{ fetchProjects(); });
