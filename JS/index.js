const todoList = document.getElementById("todo-list");
const input = document.getElementById("input");
const form = document.querySelector(".todo-form");
const emptyMsg = document.getElementById("empty-msg");
const duplicateMsg = document.getElementById("duplicate-msg");

// Load todos from localStorage (fixed key name: "todos")
const getItemsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
};

let localTodoList = getItemsFromLocalStorage();

// Save to localStorage
const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(localTodoList));
};

// Show/hide empty state message
const updateEmptyState = () => {
    emptyMsg.style.display = localTodoList.length === 0 ? "block" : "none";
};

// Create and append a todo item to the DOM (fixed: uses textContent, not innerHTML)
const addTodoDynamicElem = (todoText) => {
    const todoDiv = document.createElement("div");
    todoDiv.className = "todo-item";

    const li = document.createElement("li");
    li.textContent = todoText; // fixed: was innerHTML (XSS risk)

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    todoDiv.append(li, deleteBtn);
    todoList.append(todoDiv);
};

// Show duplicate warning briefly
let duplicateTimer;
const showDuplicateWarning = () => {
    duplicateMsg.classList.add("show");
    clearTimeout(duplicateTimer);
    duplicateTimer = setTimeout(() => duplicateMsg.classList.remove("show"), 2500);
};

// Add Todo on form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoText = input.value.trim();

    // Fixed: validate BEFORE pushing to localStorage
    if (!todoText) return;

    // Fixed: duplicate detection with user feedback
    if (localTodoList.includes(todoText)) {
        showDuplicateWarning();
        return;
    }

    localTodoList.push(todoText);
    saveToLocalStorage(); // Fixed: save after validation passes

    addTodoDynamicElem(todoText); // Fixed: reuse the helper function
    updateEmptyState();

    input.value = ""; // Fixed: was " " (space), now proper empty string
});

// Delete Todo — Fixed: also removes item from localStorage
todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const li = e.target.parentElement.querySelector("li");
        localTodoList = localTodoList.filter((t) => t !== li.textContent);
        saveToLocalStorage(); // Fixed: persist deletion
        e.target.parentElement.remove();
        updateEmptyState();
    }
});

// Load saved todos on page load — Fixed: now passes todoText argument
const showTodoList = () => {
    localTodoList.forEach((todoText) => {
        addTodoDynamicElem(todoText); // Fixed: argument was missing before
    });
    updateEmptyState();
};

showTodoList();
