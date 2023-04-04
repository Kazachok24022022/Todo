function createTodoList(id) {
  let element = document.getElementById(`todoList${id}`);
  let newTodo = document.getElementById(`newTodo${id}`);
  let addTodo = document.getElementById(`addTodo${id}`);
  let todos = JSON.parse(localStorage.getItem(`todos${id}`)) || [];

  addTodo.disabled = true;

  function addTodoItem() {
    let todoText = newTodo.value.trim();
    if (todoText === "") {
      alert("Введите текст");
      return;
    }

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].text === todoText) {
        alert("Такое дело уже есть в списке!");
        return;
      }
    }

    let todo = {
      text: todoText,
      completed: false,
    };

    todos.push(todo);
    let todoItem = createTodoListItem(todo);
    element.appendChild(todoItem);

    newTodo.value = "";
    addTodo.disabled = true;

    saveTodos();
  }

  function createTodoListItem(todo) {
    let todoItem = document.createElement("li");
    let checkbox = document.createElement("input");
    let label = document.createElement("label");
    let deleteButton = document.createElement("button");

    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    label.innerHTML = todo.text;
    deleteButton.innerHTML = "Удалить";

    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        todoItem.classList.add("checked");
        todo.completed = true;
      } else {
        todoItem.classList.remove("checked");
        todo.completed = false;
      }
      saveTodos();
    });

    deleteButton.addEventListener("click", () => {
      element.removeChild(todoItem);
      todos.splice(todos.indexOf(todo), 1);
      saveTodos();
    });

    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    todoItem.appendChild(deleteButton);

    if (todo.completed) {
      todoItem.classList.add("checked");
    }

    return todoItem;
  }

  function saveTodos() {
    localStorage.setItem(`todos${id}`, JSON.stringify(todos));
  }

  function loadTodos() {
    for (let i = 0; i < todos.length; i++) {
      let todoItem = createTodoListItem(todos[i]);
      element.appendChild(todoItem);
    }
  }

  newTodo.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      addTodoItem();
    }
  });

  newTodo.addEventListener("input", () => {
    if (newTodo.value.trim() === "") {
      addTodo.disabled = true;
    } else {
      addTodo.disabled = false;
    }
  });

  addTodo.addEventListener("click", addTodoItem);

  loadTodos();

  return {
    element,
    todos,
    saveTodos,
    loadTodos,
  };
}

function createAppTitle() {
  const appTitle = document.createElement("h1");
  appTitle.innerText = "Список дел";
  return appTitle;
}

document.body.appendChild(createAppTitle());

let todoLists = [];

for (let i = 1; i <= 3; i++) {
  let todoList = createTodoList(i);
  todoLists.push(todoList);
}

let clearCompleted = document.getElementById("clearCompleted");
clearCompleted.addEventListener("click", () => {
  for (let i = 0; i < todoLists.length; i++) {
    let todos = todoLists[i].todos;
    for (let j = todos.length - 1; j >= 0; j--) {
      if (todos[j].completed) {
        todos.splice(j, 1);
      }
    }
    todoLists[i].saveTodos();
    while (todoLists[i].element.firstChild) {
      todoLists[i].element.removeChild(todoLists[i].element.firstChild);
    }
    todoLists[i].loadTodos();
  }
});