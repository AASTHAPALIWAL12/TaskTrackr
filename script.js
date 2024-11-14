// Retrieve the tasks from local storage or start with an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// When the page is fully loaded, set up event listeners
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask); // Trigger add task when clicking 'Add'
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent Enter key's default behavior
      addTask(); // Add task on Enter key press
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks); // Trigger delete all tasks
  displayTasks(); // Display any existing tasks on page load
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false }); // Add new task to the list
    saveToLocalStorage(); // Save updated list to localStorage
    todoInput.value = ""; // Clear the input field after adding the task
    displayTasks(); // Refresh the task display
  } else {
    alert("Please enter a valid task!"); // Show alert if task input is empty
  }
}

function displayTasks() {
  todoList.innerHTML = ""; // Clear the list before displaying updated tasks
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index) // Toggle task completion when checkbox is clicked
    );
    todoList.appendChild(p); // Append the task to the list
  });
  todoCount.textContent = todo.length; // Update the total number of tasks
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement); // Replace task text with input field
  inputElement.focus(); // Focus on input for editing

  inputElement.addEventListener("blur", function () {
    saveEditedTask(index, inputElement); // Save changes when input field loses focus
  });

  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveEditedTask(index, inputElement); // Save changes on Enter key press
    }
  });
}

function saveEditedTask(index, inputElement) {
  const updatedText = inputElement.value.trim();
  if (updatedText) {
    todo[index].text = updatedText; // Update task text with new input
    saveToLocalStorage(); // Save the updated list to localStorage
  }
  displayTasks(); // Refresh the task display after editing
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled; // Toggle task completion status
  saveToLocalStorage(); // Save updated task status
  displayTasks(); // Refresh the task display
}

function deleteAllTasks() {
  const confirmation = confirm("Are you sure you want to delete all tasks?"); // Confirm deletion
  if (confirmation) {
    todo = []; // Clear the task list
    saveToLocalStorage(); // Save the empty list to localStorage
    displayTasks(); // Refresh the task display
  }
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo)); // Save the current task list to localStorage
}
