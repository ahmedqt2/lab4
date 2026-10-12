const manager = new TaskManager();
const loadTasksBtn = document.getElementById("loadTasksBtn");
const taskList = document.getElementById("taskList");
const statusMessage = document.getElementById("statusMessage");

function renderTasks() {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  manager.tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    const title = document.createElement("span");
    title.textContent = task.title;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = "Toggle";
    toggleButton.setAttribute("aria-label", `Toggle ${task.title}`);
    toggleButton.setAttribute("aria-pressed", String(task.completed));
    toggleButton.addEventListener("click", () => {
      manager.toggleTask(task.id);
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => {
      manager.removeTask(task.id);
      renderTasks();
    });

    taskElement.appendChild(title);
    taskElement.appendChild(toggleButton);
    taskElement.appendChild(deleteButton);
    taskList.appendChild(taskElement);
  });
}

loadTasksBtn.addEventListener("click", async () => {
  statusMessage.textContent = "Loading tasks...";
  loadTasksBtn.disabled = true;
  try {
    const rawTasks = await fetchTasks();
    const json = JSON.stringify(rawTasks);
    const parsedTasks = JSON.parse(json);
    const tasks = parsedTasks.map((task) => {
      return new Task(task.id, task.title, task.completed);
    });
    manager.setTasks(tasks);
    renderTasks();
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = "Unable to load tasks. Please try again.";
    console.error("Task loading failed:", error);
  } finally {
    loadTasksBtn.disabled = false;
  }
});
